import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置 Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export class CloudinaryService {
  
  // 上傳 HTML 文件到 Cloudinary
  static async uploadReport(htmlContent, options = {}) {
    const {
      userId,
      websiteUrl,
      reportTitle = 'SEO Report'
    } = options;

    try {
      // 創建臨時文件名
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const sanitizedUrl = websiteUrl ? websiteUrl.replace(/[^a-zA-Z0-9]/g, '-') : 'unknown';
      const fileName = `seo-report-${sanitizedUrl}-${timestamp}`;

      // 上傳到 Cloudinary
      const uploadResult = await cloudinary.uploader.upload(
        `data:text/html;base64,${Buffer.from(htmlContent).toString('base64')}`,
        {
          resource_type: 'raw',
          public_id: `leadio/reports/${userId}/${fileName}`,
          folder: `leadio/reports/${userId}`,
          tags: ['seo-report', 'leadio', userId],
          context: {
            website_url: websiteUrl || '',
            report_title: reportTitle,
            upload_date: new Date().toISOString(),
            user_id: userId
          },
          // 自動過期設置（30天）
          invalidate: true,
          overwrite: true
        }
      );

      console.log('✅ Report uploaded to Cloudinary:', {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
        bytes: uploadResult.bytes
      });

      return {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        fileSize: uploadResult.bytes,
        format: uploadResult.format,
        createdAt: uploadResult.created_at
      };

    } catch (error) {
      console.error('❌ Failed to upload report to Cloudinary:', error);
      throw new Error('File upload failed: ' + error.message);
    }
  }

  // 刪除 Cloudinary 上的文件
  static async deleteReport(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw',
        invalidate: true
      });

      if (result.result === 'ok') {
        console.log('✅ Report deleted from Cloudinary:', publicId);
        return true;
      } else {
        console.warn('⚠️ Report deletion may have failed:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to delete report from Cloudinary:', error);
      throw new Error('File deletion failed: ' + error.message);
    }
  }

  // 從 URL 提取 public_id
  static extractPublicId(cloudinaryUrl) {
    try {
      const urlParts = cloudinaryUrl.split('/');
      const rawIndex = urlParts.findIndex(part => part === 'raw');
      if (rawIndex !== -1 && urlParts[rawIndex + 2]) {
        // 移除文件擴展名
        const fullPath = urlParts.slice(rawIndex + 2).join('/');
        return fullPath.replace(/\.[^/.]+$/, '');
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to extract public ID:', error);
      return null;
    }
  }

  // 批量刪除用戶的報告
  static async deleteUserReports(userId) {
    try {
      const result = await cloudinary.api.delete_resources_by_prefix(
        `leadio/reports/${userId}/`,
        {
          resource_type: 'raw',
          invalidate: true
        }
      );

      console.log('✅ User reports deleted from Cloudinary:', {
        userId,
        deleted: result.deleted
      });

      return result.deleted;
    } catch (error) {
      console.error('❌ Failed to delete user reports:', error);
      throw new Error('Batch deletion failed: ' + error.message);
    }
  }

  // 獲取文件信息
  static async getFileInfo(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: 'raw'
      });

      return {
        publicId: result.public_id,
        url: result.secure_url,
        fileSize: result.bytes,
        format: result.format,
        createdAt: result.created_at,
        tags: result.tags,
        context: result.context
      };
    } catch (error) {
      console.error('❌ Failed to get file info:', error);
      throw new Error('File info retrieval failed: ' + error.message);
    }
  }

  // 生成臨時下載 URL（有時效性）
  static generateSecureUrl(publicId, expirationSeconds = 3600) {
    try {
      const timestamp = Math.floor(Date.now() / 1000) + expirationSeconds;
      
      const secureUrl = cloudinary.url(publicId, {
        resource_type: 'raw',
        secure: true,
        sign_url: true,
        auth_token: {
          key: process.env.CLOUDINARY_API_KEY,
          duration: expirationSeconds,
          start_time: Math.floor(Date.now() / 1000)
        }
      });

      return secureUrl;
    } catch (error) {
      console.error('❌ Failed to generate secure URL:', error);
      throw new Error('Secure URL generation failed: ' + error.message);
    }
  }

  // 檢查服務狀態
  static async checkConnection() {
    try {
      const result = await cloudinary.api.ping();
      console.log('✅ Cloudinary connection successful');
      return true;
    } catch (error) {
      console.error('❌ Cloudinary connection failed:', error);
      return false;
    }
  }
}

export default CloudinaryService;