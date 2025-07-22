import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Zeabur 持久化存儲服務
export class ZeaburStorageService {
  
  constructor() {
    // Zeabur 持久化存儲路徑
    this.reportsDir = process.env.STORAGE_PATH || path.join(__dirname, '..', 'data', 'reports');
    this.publicUrl = process.env.PUBLIC_URL || 'https://your-app.zeabur.app';
    
    // 初始化存儲目錄
    this.initializeStorageSync();
  }

  // 同步初始化存儲目錄
  initializeStorageSync() {
    try {
      fsSync.mkdirSync(this.reportsDir, { recursive: true });
      console.log('✅ Zeabur persistent storage initialized:', this.reportsDir);
    } catch (error) {
      console.error('❌ Failed to initialize Zeabur storage:', error);
    }
  }

  // 存儲HTML報告到Zeabur持久化存儲
  async uploadReport(htmlContent, options = {}) {
    const {
      userId,
      websiteUrl,
      reportTitle = 'SEO Report'
    } = options;

    try {
      // 生成文件名（符合你的 SIRO-20250721-1319.html 格式）
      const timestamp = new Date().toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '-')
        .substring(0, 16); // YYYY-MM-DD-HHMM
      
      const siteName = this.extractSiteName(websiteUrl);
      const fileName = `${siteName}-${timestamp}.html`;
      
      // 創建用戶目錄
      const userDir = path.join(this.reportsDir, userId);
      await fs.mkdir(userDir, { recursive: true });

      // 文件完整路徑
      const filePath = path.join(userDir, fileName);

      // 寫入HTML內容
      await fs.writeFile(filePath, htmlContent, 'utf-8');

      // 生成公開訪問URL
      const publicUrl = `${this.publicUrl}/reports/${userId}/${fileName}`;

      const result = {
        url: publicUrl,
        fileName,
        filePath,
        fileSize: Buffer.byteLength(htmlContent, 'utf8'),
        createdAt: new Date().toISOString()
      };

      console.log('✅ Report saved to Zeabur storage:', result);

      return result;

    } catch (error) {
      console.error('❌ Failed to save report to Zeabur storage:', error);
      throw new Error('Zeabur storage upload failed: ' + error.message);
    }
  }

  // 刪除報告
  async deleteReport(filePath) {
    try {
      await fs.unlink(filePath);
      console.log('✅ Report deleted from Zeabur storage:', filePath);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete from Zeabur storage:', error);
      throw new Error('Failed to delete report: ' + error.message);
    }
  }

  // 獲取文件信息
  async getFileInfo(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        lastModified: stats.mtime,
        created: stats.birthtime,
        isFile: stats.isFile()
      };
    } catch (error) {
      console.error('❌ Failed to get file info:', error);
      return null;
    }
  }

  // 列出用戶的所有報告
  async listUserReports(userId) {
    try {
      const userDir = path.join(this.reportsDir, userId);
      
      try {
        const files = await fs.readdir(userDir);
        const reports = [];

        for (const file of files) {
          if (file.endsWith('.html')) {
            const filePath = path.join(userDir, file);
            const stats = await fs.stat(filePath);
            reports.push({
              fileName: file,
              filePath,
              size: stats.size,
              createdAt: stats.birthtime,
              url: `${this.publicUrl}/reports/${userId}/${file}`
            });
          }
        }

        return reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (error) {
        // 用戶目錄不存在
        return [];
      }
    } catch (error) {
      console.error('❌ Failed to list user reports:', error);
      return [];
    }
  }

  // 清理過期報告
  async cleanupExpiredReports(retentionDays = 30) {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() - retentionDays);

      let cleanedCount = 0;
      const userDirs = await fs.readdir(this.reportsDir);

      for (const userDir of userDirs) {
        const userPath = path.join(this.reportsDir, userDir);
        const stats = await fs.stat(userPath);

        if (stats.isDirectory()) {
          const files = await fs.readdir(userPath);
          
          for (const file of files) {
            if (file.endsWith('.html')) {
              const filePath = path.join(userPath, file);
              const fileStats = await fs.stat(filePath);

              if (fileStats.birthtime < expiryDate) {
                await fs.unlink(filePath);
                cleanedCount++;
                console.log(`🗑️ Cleaned expired report: ${file}`);
              }
            }
          }
        }
      }

      console.log(`🧹 Cleaned up ${cleanedCount} expired reports`);
      return cleanedCount;
    } catch (error) {
      console.error('❌ Failed to cleanup expired reports:', error);
      return 0;
    }
  }

  // 獲取存儲統計信息
  async getStorageStats() {
    try {
      let totalFiles = 0;
      let totalSize = 0;
      const userStats = {};

      const userDirs = await fs.readdir(this.reportsDir);

      for (const userDir of userDirs) {
        const userPath = path.join(this.reportsDir, userDir);
        const stats = await fs.stat(userPath);

        if (stats.isDirectory()) {
          const files = await fs.readdir(userPath);
          let userFiles = 0;
          let userSize = 0;

          for (const file of files) {
            if (file.endsWith('.html')) {
              const filePath = path.join(userPath, file);
              const fileStats = await fs.stat(filePath);
              userFiles++;
              userSize += fileStats.size;
            }
          }

          userStats[userDir] = {
            files: userFiles,
            size: userSize,
            sizeFormatted: this.formatBytes(userSize)
          };

          totalFiles += userFiles;
          totalSize += userSize;
        }
      }

      return {
        totalFiles,
        totalSize,
        totalSizeFormatted: this.formatBytes(totalSize),
        userStats,
        storagePath: this.reportsDir
      };
    } catch (error) {
      console.error('❌ Failed to get storage stats:', error);
      return null;
    }
  }

  // 提取網站名稱用於文件命名
  extractSiteName(url) {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain.split('.')[0].toUpperCase();
    } catch {
      return 'WEBSITE';
    }
  }

  // 格式化文件大小
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // 測試存儲系統
  async testStorage() {
    try {
      const testContent = `<!DOCTYPE html><html><body><h1>Zeabur Storage Test - ${new Date().toISOString()}</h1></body></html>`;
      
      const result = await this.uploadReport(testContent, {
        userId: 'test-zeabur',
        websiteUrl: 'https://example.com',
        reportTitle: 'Zeabur Storage Test'
      });

      console.log('✅ Zeabur storage test successful:', result.url);
      
      // 清理測試文件
      setTimeout(async () => {
        try {
          await this.deleteReport(result.filePath);
          console.log('🧹 Test file cleaned up');
        } catch (error) {
          console.log('⚠️ Test file cleanup failed:', error.message);
        }
      }, 5000);

      return true;
    } catch (error) {
      console.error('❌ Zeabur storage test failed:', error);
      return false;
    }
  }
}

export default ZeaburStorageService;