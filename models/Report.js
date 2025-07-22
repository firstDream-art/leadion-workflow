import { query, transaction } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class Report {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.clerkUserId = data.clerk_user_id || data.clerkUserId;
    this.reportUrl = data.report_url || data.reportUrl;
    this.reportTitle = data.report_title || data.reportTitle;
    this.websiteUrl = data.website_url || data.websiteUrl;
    this.fileSize = data.file_size || data.fileSize;
    this.createdAt = data.created_at || data.createdAt;
    this.expiresAt = data.expires_at || data.expiresAt;
    this.status = data.status || 'active';
  }

  // 創建新報告
  static async create(reportData) {
    const report = new Report(reportData);
    const insertQuery = `
      INSERT INTO seo_reports (
        id, clerk_user_id, report_url, report_title, website_url, 
        file_size, expires_at, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      report.id,
      report.clerkUserId,
      report.reportUrl,
      report.reportTitle,
      report.websiteUrl,
      report.fileSize,
      report.expiresAt || new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 天後過期
      report.status
    ];

    try {
      const result = await query(insertQuery, values);
      console.log('✅ Report created:', report.id);
      return new Report(result.rows[0]);
    } catch (error) {
      console.error('❌ Failed to create report:', error);
      throw new Error('Failed to create report: ' + error.message);
    }
  }

  // 根據 ID 查找報告
  static async findById(id) {
    const selectQuery = 'SELECT * FROM seo_reports WHERE id = $1';
    
    try {
      const result = await query(selectQuery, [id]);
      return result.rows.length > 0 ? new Report(result.rows[0]) : null;
    } catch (error) {
      console.error('❌ Failed to find report by ID:', error);
      throw new Error('Failed to find report: ' + error.message);
    }
  }

  // 根據 Clerk 用戶 ID 查找所有報告
  static async findByUserId(clerkUserId, options = {}) {
    const {
      limit = 50,
      offset = 0,
      status = 'active',
      orderBy = 'created_at',
      orderDir = 'DESC'
    } = options;

    const selectQuery = `
      SELECT * FROM seo_reports 
      WHERE clerk_user_id = $1 AND status = $2
      ORDER BY ${orderBy} ${orderDir}
      LIMIT $3 OFFSET $4
    `;

    try {
      const result = await query(selectQuery, [clerkUserId, status, limit, offset]);
      return result.rows.map(row => new Report(row));
    } catch (error) {
      console.error('❌ Failed to find reports by user ID:', error);
      throw new Error('Failed to find user reports: ' + error.message);
    }
  }

  // 統計用戶報告數量
  static async countByUserId(clerkUserId, status = 'active') {
    const countQuery = 'SELECT COUNT(*) FROM seo_reports WHERE clerk_user_id = $1 AND status = $2';
    
    try {
      const result = await query(countQuery, [clerkUserId, status]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('❌ Failed to count reports:', error);
      throw new Error('Failed to count reports: ' + error.message);
    }
  }

  // 更新報告
  async update(updateData) {
    const allowedFields = ['report_title', 'is_emailed', 'status'];
    const updates = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(this.id);
    const updateQuery = `
      UPDATE seo_reports 
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `;

    try {
      const result = await query(updateQuery, values);
      if (result.rows.length > 0) {
        Object.assign(this, result.rows[0]);
        console.log('✅ Report updated:', this.id);
        return this;
      }
      throw new Error('Report not found');
    } catch (error) {
      console.error('❌ Failed to update report:', error);
      throw new Error('Failed to update report: ' + error.message);
    }
  }

  // 軟刪除報告
  async softDelete() {
    return this.update({ status: 'deleted' });
  }

  // 硬刪除報告
  async delete() {
    const deleteQuery = 'DELETE FROM seo_reports WHERE id = $1';
    
    try {
      await query(deleteQuery, [this.id]);
      console.log('✅ Report deleted permanently:', this.id);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete report:', error);
      throw new Error('Failed to delete report: ' + error.message);
    }
  }

  // 查找過期的報告
  static async findExpired() {
    const selectQuery = `
      SELECT * FROM seo_reports 
      WHERE expires_at < NOW() AND status = 'active'
      ORDER BY expires_at ASC
    `;

    try {
      const result = await query(selectQuery);
      return result.rows.map(row => new Report(row));
    } catch (error) {
      console.error('❌ Failed to find expired reports:', error);
      throw new Error('Failed to find expired reports: ' + error.message);
    }
  }

  // 清理過期報告
  static async cleanupExpired() {
    const expiredReports = await Report.findExpired();
    let cleanedCount = 0;

    for (const report of expiredReports) {
      try {
        await report.softDelete();
        cleanedCount++;
      } catch (error) {
        console.error('❌ Failed to cleanup report:', report.id, error);
      }
    }

    console.log(`🧹 Cleaned up ${cleanedCount} expired reports`);
    return cleanedCount;
  }

  // 轉換為 JSON 響應格式
  toJSON() {
    return {
      id: this.id,
      clerkUserId: this.clerkUserId,
      reportUrl: this.reportUrl,
      reportTitle: this.reportTitle,
      websiteUrl: this.websiteUrl,
      fileSize: this.fileSize,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
      status: this.status,
      daysUntilExpiry: this.expiresAt ? 
        Math.ceil((new Date(this.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)) : null
    };
  }
}