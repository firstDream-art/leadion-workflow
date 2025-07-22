import express from 'express';
import { Report } from '../models/Report.js';
import CloudinaryService from '../services/cloudinary.js';
import LocalStorageService from '../services/localStorage.js';
import ZeaburStorageService from '../services/zeaburStorageService.js';
import EmailService from '../services/email.js';
import { optionalAuth } from '../middleware/clerk.js';

const router = express.Router();

// 🔧 存儲服務選擇器
const storageType = process.env.STORAGE_TYPE || 'local';
let storageService;

switch (storageType) {
  case 'zeabur':
    storageService = new ZeaburStorageService();
    break;
  case 'cloudinary':
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      storageService = CloudinaryService;
    } else {
      console.warn('⚠️ Cloudinary not configured, falling back to Zeabur storage');
      storageService = new ZeaburStorageService();
    }
    break;
  case 'local':
  default:
    storageService = new LocalStorageService();
    break;
}

console.log(`📁 使用存儲服務: ${storageType.toUpperCase()}`);

// 🔒 為需要認證的路由使用認證中間件
// 注意：POST /reports 用於 n8n 調用，使用 API key 而非 Clerk 認證

// API Key 認證中間件（供 n8n 使用）
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Valid API key required'
    });
  }
  next();
};

// 📊 獲取用戶的所有報告
router.get('/', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User authentication required'
      });
    }

    const {
      limit = 20,
      offset = 0,
      status = 'active'
    } = req.query;

    const reports = await Report.findByUserId(req.userId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      status
    });

    const totalCount = await Report.countByUserId(req.userId, status);

    res.json({
      success: true,
      data: {
        reports: reports.map(report => report.toJSON()),
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: totalCount > parseInt(offset) + parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Failed to fetch reports:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch reports'
    });
  }
});

// 📄 獲取特定報告
router.get('/:id', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User authentication required'
      });
    }

    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Report not found'
      });
    }

    // 檢查報告是否屬於當前用戶
    if (report.userId !== req.userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: report.toJSON()
    });

  } catch (error) {
    console.error('❌ Failed to fetch report:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch report'
    });
  }
});

// ⬆️ 創建新報告（供 n8n 調用）
router.post('/', apiKeyAuth, async (req, res) => {
  try {
    const {
      userId,
      htmlContent,
      websiteUrl,
      reportTitle = `SEO Report - ${websiteUrl}`,
      userEmail
    } = req.body;

    // 驗證必要欄位
    if (!userId || !htmlContent || !websiteUrl) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: userId, htmlContent, websiteUrl'
      });
    }

    // 上傳報告到選定的存儲服務
    console.log(`📤 上傳報告到 ${useCloudinary ? 'Cloudinary' : '本地存儲'}...`);
    const uploadResult = await storageService.uploadReport(htmlContent, {
      userId,
      websiteUrl,
      reportTitle
    });

    // 創建數據庫記錄
    console.log('💾 Creating database record...');
    let report;
    try {
      report = await Report.create({
        clerkUserId: userId,  // 使用 Clerk 提供的用戶 ID
        reportUrl: uploadResult.url,
        reportTitle,
        websiteUrl,
        fileSize: uploadResult.fileSize
      });
      console.log('✅ Report created successfully:', report.id);
    } catch (dbError) {
      console.warn('⚠️ Database not available, continuing without database record');
      // 生成臨時 ID 用於回應
      report = {
        id: 'temp-' + Date.now(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };
    }

    // 如果提供了郵件，發送通知（異步）
    if (userEmail) {
      EmailService.sendReport({
        to: userEmail,
        reportTitle,
        websiteUrl,
        reportUrl: uploadResult.url,
        userName: 'LeadIO 用戶'
      }).catch(emailError => {
        console.error('❌ Failed to send report email:', emailError);
      });
    }

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: {
        reportId: report.id,
        reportUrl: uploadResult.url,
        expiresAt: report.expiresAt
      }
    });

  } catch (error) {
    console.error('❌ Failed to create report:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create report: ' + error.message
    });
  }
});

// 📧 發送報告到郵箱
router.post('/:id/email', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User authentication required'
      });
    }

    const { id } = req.params;
    const { email, userName = 'LeadIO 用戶' } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email address is required'
      });
    }

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Report not found'
      });
    }

    // 檢查報告是否屬於當前用戶
    if (report.userId !== req.userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied'
      });
    }

    // 發送郵件
    await EmailService.sendReport({
      to: email,
      reportTitle: report.reportTitle,
      websiteUrl: report.websiteUrl,
      reportUrl: report.reportUrl,
      userName,
      expirationDays: Math.ceil((new Date(report.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
    });

    // 更新已發送郵件狀態
    await report.update({ is_emailed: true });

    res.json({
      success: true,
      message: 'Report sent to email successfully'
    });

  } catch (error) {
    console.error('❌ Failed to send report email:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to send email'
    });
  }
});

// 🗑️ 刪除報告
router.delete('/:id', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User authentication required'
      });
    }

    const { id } = req.params;
    const { permanent = false } = req.query;

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Report not found'
      });
    }

    // 檢查報告是否屬於當前用戶
    if (report.userId !== req.userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied'
      });
    }

    if (permanent === 'true') {
      // 硬刪除：從存儲服務和數據庫中完全刪除
      try {
        if (useCloudinary) {
          const publicId = CloudinaryService.extractPublicId(report.reportUrl);
          if (publicId) {
            await storageService.deleteReport(publicId);
          }
        } else {
          // 對於本地存儲，直接刪除文件
          await storageService.deleteReport(report.reportUrl);
        }
      } catch (error) {
        console.warn('⚠️ 刪除存儲文件時出錯:', error.message);
      }
      
      await report.delete();
    } else {
      // 軟刪除：僅標記為已刪除
      await report.softDelete();
    }

    res.json({
      success: true,
      message: permanent === 'true' ? 'Report permanently deleted' : 'Report deleted'
    });

  } catch (error) {
    console.error('❌ Failed to delete report:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete report'
    });
  }
});

// 🧹 清理過期報告（系統調用）
router.post('/cleanup', apiKeyAuth, async (req, res) => {
  try {
    console.log('🧹 Starting expired reports cleanup...');
    const cleanedCount = await Report.cleanupExpired();

    res.json({
      success: true,
      message: `Cleaned up ${cleanedCount} expired reports`
    });

  } catch (error) {
    console.error('❌ Failed to cleanup reports:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to cleanup reports'
    });
  }
});

// 📊 獲取用戶報告統計
router.get('/stats/summary', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User authentication required'
      });
    }

    const [activeCount, totalCount] = await Promise.all([
      Report.countByUserId(req.userId, 'active'),
      Report.countByUserId(req.userId, 'all')
    ]);

    const recentReports = await Report.findByUserId(req.userId, {
      limit: 5,
      status: 'active'
    });

    res.json({
      success: true,
      data: {
        counts: {
          active: activeCount,
          total: totalCount
        },
        recentReports: recentReports.map(report => report.toJSON())
      }
    });

  } catch (error) {
    console.error('❌ Failed to fetch report stats:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch statistics'
    });
  }
});

export default router;