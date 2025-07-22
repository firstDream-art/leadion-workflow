import cron from 'node-cron';
import { Report } from '../models/Report.js';
import CloudinaryService from '../services/cloudinary.js';
import EmailService from '../services/email.js';
import { testConnection, closeDatabase } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

// 清理過期報告的主函數
async function cleanupExpiredReports() {
  console.log('🧹 Starting expired reports cleanup...');
  
  try {
    // 查找所有過期的報告
    const expiredReports = await Report.findExpired();
    console.log(`📋 Found ${expiredReports.length} expired reports`);
    
    if (expiredReports.length === 0) {
      console.log('✅ No expired reports to cleanup');
      return 0;
    }
    
    let cleanedCount = 0;
    let errors = [];
    
    for (const report of expiredReports) {
      try {
        console.log(`🗑️ Cleaning up report: ${report.id} (${report.websiteUrl})`);
        
        // 1. 從 Cloudinary 刪除文件
        const publicId = CloudinaryService.extractPublicId(report.reportUrl);
        if (publicId) {
          const deleted = await CloudinaryService.deleteReport(publicId);
          if (!deleted) {
            console.warn(`⚠️ Failed to delete from Cloudinary: ${publicId}`);
          }
        }
        
        // 2. 軟刪除數據庫記錄
        await report.update({ status: 'deleted' });
        
        cleanedCount++;
        console.log(`✅ Successfully cleaned report: ${report.id}`);
        
      } catch (error) {
        console.error(`❌ Failed to cleanup report ${report.id}:`, error.message);
        errors.push({ reportId: report.id, error: error.message });
      }
    }
    
    console.log(`🎉 Cleanup completed: ${cleanedCount}/${expiredReports.length} reports cleaned`);
    
    if (errors.length > 0) {
      console.error(`⚠️ ${errors.length} cleanup errors occurred:`, errors);
    }
    
    return cleanedCount;
    
  } catch (error) {
    console.error('❌ Cleanup process failed:', error.message);
    throw error;
  }
}

// 發送即將過期的報告提醒
async function sendExpirationReminders() {
  console.log('📧 Checking for reports nearing expiration...');
  
  try {
    // 查找 3 天內即將過期的報告
    const nearExpiryQuery = `
      SELECT r.*, u.email_address, u.first_name, u.last_name
      FROM seo_reports r
      LEFT JOIN users u ON r.user_id = u.clerk_id
      WHERE r.status = 'active'
        AND r.expires_at > NOW()
        AND r.expires_at <= NOW() + INTERVAL '3 days'
        AND r.reminder_sent = FALSE
    `;
    
    // 注意：此查詢假設你有 users 表，如果沒有，需要通過 Clerk API 獲取用戶信息
    // 簡化版本：僅處理有明確郵箱的記錄
    
    const reports = await Report.findByStatus('active');
    const nearExpiry = reports.filter(report => {
      const daysUntilExpiry = Math.ceil((new Date(report.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
    });
    
    console.log(`📊 Found ${nearExpiry.length} reports nearing expiration`);
    
    if (nearExpiry.length === 0) {
      console.log('✅ No expiration reminders to send');
      return 0;
    }
    
    // 按用戶分組報告
    const userReports = {};
    nearExpiry.forEach(report => {
      if (!userReports[report.userId]) {
        userReports[report.userId] = [];
      }
      userReports[report.userId].push(report);
    });
    
    let sentCount = 0;
    
    for (const [userId, reports] of Object.entries(userReports)) {
      try {
        // 這裡需要通過 Clerk API 獲取用戶郵箱
        // 暫時跳過此功能，在實際部署時需要整合 Clerk 用戶 API
        console.log(`📧 Would send reminder to user ${userId} for ${reports.length} reports`);
        sentCount++;
        
      } catch (error) {
        console.error(`❌ Failed to send reminder to user ${userId}:`, error.message);
      }
    }
    
    console.log(`📧 Reminders processed for ${sentCount} users`);
    return sentCount;
    
  } catch (error) {
    console.error('❌ Reminder sending failed:', error.message);
    throw error;
  }
}

// 清理舊的已刪除記錄（硬刪除）
async function cleanupDeletedRecords(olderThanDays = 7) {
  console.log(`🗑️ Cleaning up records deleted more than ${olderThanDays} days ago...`);
  
  try {
    const deleteQuery = `
      DELETE FROM seo_reports 
      WHERE status = 'deleted' 
        AND updated_at < NOW() - INTERVAL '${olderThanDays} days'
      RETURNING id
    `;
    
    const result = await query(deleteQuery);
    const deletedCount = result.rows.length;
    
    console.log(`🗑️ Permanently deleted ${deletedCount} old records`);
    return deletedCount;
    
  } catch (error) {
    console.error('❌ Failed to cleanup deleted records:', error.message);
    throw error;
  }
}

// 數據庫維護任務
async function performDatabaseMaintenance() {
  console.log('🔧 Starting database maintenance...');
  
  try {
    // 更新表統計信息
    await query('ANALYZE seo_reports');
    console.log('✅ Database statistics updated');
    
    // 清理查詢計劃緩存
    await query('DISCARD PLANS');
    console.log('✅ Query plan cache cleared');
    
    return true;
  } catch (error) {
    console.error('❌ Database maintenance failed:', error.message);
    return false;
  }
}

// 系統健康檢查
async function healthCheck() {
  console.log('🏥 Performing system health check...');
  
  const health = {
    timestamp: new Date().toISOString(),
    database: false,
    cloudinary: false,
    email: false,
    reportStats: null
  };
  
  try {
    // 數據庫連接檢查
    health.database = await testConnection();
    
    // Cloudinary 連接檢查
    health.cloudinary = await CloudinaryService.checkConnection();
    
    // 郵件服務檢查
    health.email = await EmailService.testConnection();
    
    // 報告統計
    const activeCount = await query('SELECT COUNT(*) FROM seo_reports WHERE status = $1', ['active']);
    const expiredCount = await query('SELECT COUNT(*) FROM seo_reports WHERE expires_at < NOW() AND status = $1', ['active']);
    
    health.reportStats = {
      active: parseInt(activeCount.rows[0].count),
      expired: parseInt(expiredCount.rows[0].count)
    };
    
    const allHealthy = health.database && health.cloudinary && health.email;
    console.log(`🏥 Health check ${allHealthy ? 'PASSED' : 'FAILED'}:`, health);
    
    return health;
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    health.error = error.message;
    return health;
  }
}

// 設置定時任務
export function setupCronJobs() {
  console.log('⏰ Setting up scheduled tasks...');
  
  // 每天凌晨 2:00 清理過期報告
  cron.schedule('0 2 * * *', async () => {
    console.log('⏰ Running scheduled cleanup task...');
    try {
      await cleanupExpiredReports();
      await cleanupDeletedRecords();
    } catch (error) {
      console.error('❌ Scheduled cleanup failed:', error);
    }
  }, {
    timezone: "Asia/Taipei"
  });
  
  // 每天上午 9:00 發送過期提醒
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰ Running scheduled reminder task...');
    try {
      await sendExpirationReminders();
    } catch (error) {
      console.error('❌ Scheduled reminders failed:', error);
    }
  }, {
    timezone: "Asia/Taipei"
  });
  
  // 每週日凌晨 3:00 執行數據庫維護
  cron.schedule('0 3 * * 0', async () => {
    console.log('⏰ Running scheduled maintenance task...');
    try {
      await performDatabaseMaintenance();
    } catch (error) {
      console.error('❌ Scheduled maintenance failed:', error);
    }
  }, {
    timezone: "Asia/Taipei"
  });
  
  // 每小時執行健康檢查
  cron.schedule('0 * * * *', async () => {
    try {
      await healthCheck();
    } catch (error) {
      console.error('❌ Health check failed:', error);
    }
  });
  
  console.log('✅ Scheduled tasks configured:');
  console.log('  - Daily cleanup: 2:00 AM');
  console.log('  - Daily reminders: 9:00 AM');
  console.log('  - Weekly maintenance: Sunday 3:00 AM');
  console.log('  - Hourly health check');
}

// 手動執行清理（用於測試或緊急情況）
async function manualCleanup() {
  console.log('🔧 Manual cleanup requested...');
  
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }
    
    const results = {
      expiredReports: await cleanupExpiredReports(),
      deletedRecords: await cleanupDeletedRecords(),
      maintenance: await performDatabaseMaintenance(),
      healthCheck: await healthCheck()
    };
    
    console.log('✅ Manual cleanup completed:', results);
    return results;
    
  } catch (error) {
    console.error('❌ Manual cleanup failed:', error);
    throw error;
  } finally {
    if (process.argv[1].includes('cleanup.js')) {
      await closeDatabase();
    }
  }
}

// 命令行接口
async function main() {
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'cleanup':
        await manualCleanup();
        break;
        
      case 'health':
        await healthCheck();
        break;
        
      case 'reminders':
        await sendExpirationReminders();
        break;
        
      case 'maintenance':
        await performDatabaseMaintenance();
        break;
        
      default:
        console.log('📖 Available commands:');
        console.log('  node scripts/cleanup.js cleanup      # Manual cleanup');
        console.log('  node scripts/cleanup.js health       # Health check');
        console.log('  node scripts/cleanup.js reminders    # Send reminders');
        console.log('  node scripts/cleanup.js maintenance  # Database maintenance');
        break;
    }
  } finally {
    await closeDatabase();
  }
}

// 如果直接執行此腳本
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Cleanup script failed:', error);
    process.exit(1);
  });
}

export { 
  cleanupExpiredReports, 
  sendExpirationReminders, 
  cleanupDeletedRecords, 
  performDatabaseMaintenance,
  healthCheck,
  setupCronJobs,
  manualCleanup 
};