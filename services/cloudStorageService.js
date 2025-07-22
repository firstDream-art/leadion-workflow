import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// 統一雲端存儲服務
export class CloudStorageService {
  
  constructor() {
    this.provider = process.env.CLOUD_STORAGE_PROVIDER || 'aws'; // aws, digitalocean, cloudinary
    this.initializeProvider();
  }

  initializeProvider() {
    switch (this.provider) {
      case 'aws':
        this.initializeAWS();
        break;
      case 'digitalocean':
        this.initializeDigitalOcean();
        break;
      case 'cloudinary':
        this.initializeCloudinary();
        break;
      default:
        throw new Error(`Unsupported storage provider: ${this.provider}`);
    }
  }

  // AWS S3 配置
  initializeAWS() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'ap-east-1', // 香港區域
    });
    this.bucket = process.env.AWS_S3_BUCKET || 'leadio-reports';
    this.cdnUrl = process.env.AWS_CLOUDFRONT_URL; // 可選的CloudFront CDN
  }

  // DigitalOcean Spaces 配置
  initializeDigitalOcean() {
    this.s3 = new AWS.S3({
      endpoint: new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT), // 例：sgp1.digitaloceanspaces.com
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET,
    });
    this.bucket = process.env.DO_SPACES_NAME;
    this.cdnUrl = process.env.DO_SPACES_CDN_URL;
  }

  // Cloudinary 配置
  initializeCloudinary() {
    // 使用現有的 Cloudinary 服務
    import('./cloudinary.js').then(module => {
      this.cloudinary = module.default;
    });
  }

  // 上傳HTML報告到雲端
  async uploadReport(htmlContent, options = {}) {
    const {
      userId,
      websiteUrl,
      reportTitle = 'SEO Report'
    } = options;

    try {
      switch (this.provider) {
        case 'aws':
        case 'digitalocean':
          return await this.uploadToS3Compatible(htmlContent, options);
        case 'cloudinary':
          return await this.uploadToCloudinary(htmlContent, options);
        default:
          throw new Error(`Upload not implemented for ${this.provider}`);
      }
    } catch (error) {
      console.error('❌ Cloud storage upload failed:', error);
      throw new Error('Failed to upload report to cloud storage: ' + error.message);
    }
  }

  // S3兼容服務上傳
  async uploadToS3Compatible(htmlContent, options) {
    const { userId, websiteUrl, reportTitle } = options;

    // 生成文件名
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '-')
      .substring(0, 16);
    
    const siteName = this.extractSiteName(websiteUrl);
    const fileName = `${siteName}-${timestamp}.html`;
    
    // S3 對象鍵（路徑）
    const key = `reports/${userId}/${fileName}`;

    const uploadParams = {
      Bucket: this.bucket,
      Key: key,
      Body: htmlContent,
      ContentType: 'text/html; charset=utf-8',
      CacheControl: 'public, max-age=31536000', // 1年緩存
      Metadata: {
        'user-id': userId,
        'website-url': websiteUrl,
        'report-title': reportTitle,
        'upload-time': new Date().toISOString()
      }
    };

    console.log(`📤 Uploading to ${this.provider.toUpperCase()}:`, key);
    
    const result = await this.s3.upload(uploadParams).promise();

    // 構建訪問URL
    let publicUrl;
    if (this.cdnUrl) {
      publicUrl = `${this.cdnUrl}/${key}`;
    } else {
      publicUrl = result.Location;
    }

    console.log('✅ Upload successful:', publicUrl);

    return {
      url: publicUrl,
      fileName,
      key,
      fileSize: Buffer.byteLength(htmlContent, 'utf8'),
      provider: this.provider,
      createdAt: new Date().toISOString()
    };
  }

  // Cloudinary上傳（作為HTML文件）
  async uploadToCloudinary(htmlContent, options) {
    const { userId, websiteUrl, reportTitle } = options;
    
    // Cloudinary主要用於媒體文件，HTML上傳需要特殊處理
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '-')
      .substring(0, 16);
    
    const siteName = this.extractSiteName(websiteUrl);
    const fileName = `${siteName}-${timestamp}`;
    
    const uploadOptions = {
      resource_type: 'raw', // 上傳為原始文件
      public_id: `reports/${userId}/${fileName}`,
      use_filename: true,
      unique_filename: false,
      tags: ['seo-report', userId, siteName],
      context: {
        user_id: userId,
        website_url: websiteUrl,
        report_title: reportTitle
      }
    };

    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              fileName: fileName + '.html',
              publicId: result.public_id,
              fileSize: result.bytes,
              provider: 'cloudinary',
              createdAt: new Date().toISOString()
            });
          }
        }
      ).end(htmlContent);
    });
  }

  // 刪除報告
  async deleteReport(fileKey) {
    try {
      switch (this.provider) {
        case 'aws':
        case 'digitalocean':
          await this.s3.deleteObject({
            Bucket: this.bucket,
            Key: fileKey
          }).promise();
          break;
        case 'cloudinary':
          await this.cloudinary.uploader.destroy(fileKey, { resource_type: 'raw' });
          break;
      }
      console.log('✅ Report deleted from cloud storage:', fileKey);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete from cloud storage:', error);
      throw error;
    }
  }

  // 獲取文件信息
  async getFileInfo(fileKey) {
    try {
      switch (this.provider) {
        case 'aws':
        case 'digitalocean':
          const result = await this.s3.headObject({
            Bucket: this.bucket,
            Key: fileKey
          }).promise();
          
          return {
            size: result.ContentLength,
            lastModified: result.LastModified,
            contentType: result.ContentType,
            metadata: result.Metadata
          };
        case 'cloudinary':
          const info = await this.cloudinary.api.resource(fileKey, { resource_type: 'raw' });
          return {
            size: info.bytes,
            lastModified: new Date(info.created_at),
            contentType: 'text/html',
            metadata: info.context
          };
      }
    } catch (error) {
      console.error('❌ Failed to get file info:', error);
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

  // 測試連接
  async testConnection() {
    try {
      switch (this.provider) {
        case 'aws':
        case 'digitalocean':
          await this.s3.listObjectsV2({
            Bucket: this.bucket,
            MaxKeys: 1
          }).promise();
          break;
        case 'cloudinary':
          await this.cloudinary.api.ping();
          break;
      }
      console.log(`✅ ${this.provider.toUpperCase()} connection successful`);
      return true;
    } catch (error) {
      console.error(`❌ ${this.provider.toUpperCase()} connection failed:`, error.message);
      return false;
    }
  }
}

export default CloudStorageService;