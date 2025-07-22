import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 本地存儲服務 - Cloudinary 的替代方案
export class LocalStorageService {
  
  constructor() {
    // 報告存儲目錄
    this.reportsDir = path.join(__dirname, '..', 'uploads', 'reports');
    this.publicUrl = process.env.PUBLIC_URL || 'http://localhost:3001';
    
    // 同步初始化存儲目錄
    this.initializeStorageSync();
  }

  // 同步初始化存儲目錄
  initializeStorageSync() {
    try {
      fsSync.mkdirSync(this.reportsDir, { recursive: true });
      console.log('✅ Reports storage directory initialized:', this.reportsDir);
    } catch (error) {
      console.error('❌ Failed to initialize storage:', error);
    }
  }
  
  // 異步初始化存儲目錄
  async initializeStorage() {
    try {
      await fs.mkdir(this.reportsDir, { recursive: true });
      console.log('✅ Reports storage directory initialized:', this.reportsDir);
    } catch (error) {
      console.error('❌ Failed to initialize storage:', error);
    }
  }

  // 存儲HTML報告
  async uploadReport(htmlContent, options = {}) {
    const {
      userId,
      websiteUrl,
      reportTitle = 'SEO Report'
    } = options;

    try {
      // 生成文件名（類似你的 SIRO-20250721-1319.html 格式）
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
      
      // 寫入HTML文件
      await fs.writeFile(filePath, htmlContent, 'utf-8');
      
      // 獲取文件大小
      const stats = await fs.stat(filePath);
      const fileSize = stats.size;
      
      // 生成公開訪問URL
      const publicUrl = `${this.publicUrl}/reports/${userId}/${fileName}`;
      
      console.log('✅ Report saved locally:', {
        fileName,
        fileSize,
        publicUrl
      });

      return {
        url: publicUrl,
        fileName,
        filePath,
        fileSize,
        createdAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Failed to save report locally:', error);
      throw new Error('Local file storage failed: ' + error.message);
    }
  }

  // 刪除本地報告文件
  async deleteReport(filePath) {
    try {
      // 如果傳入的是URL，轉換為文件路徑
      let actualPath = filePath;
      if (filePath.startsWith('http')) {
        actualPath = this.urlToPath(filePath);
      }

      await fs.unlink(actualPath);
      console.log('✅ Report deleted locally:', actualPath);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete local report:', error);
      return false;
    }
  }

  // 從URL提取本地路徑
  urlToPath(url) {
    const relativePath = url.replace(this.publicUrl, '');
    return path.join(__dirname, '..', 'public', relativePath);
  }

  // 從網址提取站點名稱
  extractSiteName(websiteUrl) {
    try {
      const url = new URL(websiteUrl);
      let hostname = url.hostname;
      
      // 移除 www. 前綴
      if (hostname.startsWith('www.')) {
        hostname = hostname.substring(4);
      }
      
      // 取域名部分（移除.com等後綴）
      const parts = hostname.split('.');
      const siteName = parts[0] || 'UNKNOWN';
      
      return siteName.toUpperCase();
    } catch (error) {
      return 'SITE';
    }
  }

  // 批量清理用戶報告
  async deleteUserReports(userId) {
    try {
      const userDir = path.join(this.reportsDir, userId);
      
      // 檢查目錄是否存在
      try {
        await fs.access(userDir);
      } catch {
        console.log('📂 User directory does not exist:', userId);
        return [];
      }

      // 讀取並刪除所有文件
      const files = await fs.readdir(userDir);
      const deleted = [];

      for (const file of files) {
        if (file.endsWith('.html')) {
          const filePath = path.join(userDir, file);
          await fs.unlink(filePath);
          deleted.push(file);
        }
      }

      // 如果目錄為空，刪除目錄
      const remainingFiles = await fs.readdir(userDir);
      if (remainingFiles.length === 0) {
        await fs.rmdir(userDir);
      }

      console.log('✅ User reports deleted locally:', {
        userId,
        deletedFiles: deleted
      });

      return deleted;
    } catch (error) {
      console.error('❌ Failed to delete user reports:', error);
      throw new Error('Batch deletion failed: ' + error.message);
    }
  }

  // 獲取報告文件信息
  async getFileInfo(filePath) {
    try {
      let actualPath = filePath;
      if (filePath.startsWith('http')) {
        actualPath = this.urlToPath(filePath);
      }

      const stats = await fs.stat(actualPath);
      const fileName = path.basename(actualPath);

      return {
        fileName,
        filePath: actualPath,
        fileSize: stats.size,
        createdAt: stats.birthtime.toISOString(),
        modifiedAt: stats.mtime.toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to get file info:', error);
      throw new Error('File info retrieval failed: ' + error.message);
    }
  }

  // 檢查服務狀態
  async checkConnection() {
    try {
      // 檢查存儲目錄是否可寫
      await fs.access(this.reportsDir, fs.constants.W_OK);
      console.log('✅ Local storage connection successful');
      return true;
    } catch (error) {
      console.error('❌ Local storage connection failed:', error);
      return false;
    }
  }

  // 獲取存儲統計
  async getStorageStats() {
    try {
      const stats = {
        totalFiles: 0,
        totalSize: 0,
        userDirectories: 0
      };

      // 讀取所有用戶目錄
      const userDirs = await fs.readdir(this.reportsDir);
      
      for (const userDir of userDirs) {
        const userPath = path.join(this.reportsDir, userDir);
        const userStat = await fs.stat(userPath);
        
        if (userStat.isDirectory()) {
          stats.userDirectories++;
          
          // 統計該用戶的文件
          const files = await fs.readdir(userPath);
          for (const file of files) {
            if (file.endsWith('.html')) {
              const filePath = path.join(userPath, file);
              const fileStat = await fs.stat(filePath);
              stats.totalFiles++;
              stats.totalSize += fileStat.size;
            }
          }
        }
      }

      return stats;
    } catch (error) {
      console.error('❌ Failed to get storage stats:', error);
      return { error: error.message };
    }
  }
}

export default LocalStorageService;