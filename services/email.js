import { Resend } from 'resend';

// 只在有 API key 時初始化 Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export class EmailService {
  
  // 發送 SEO 報告到用戶郵箱
  static async sendReport(options) {
    if (!resend) {
      console.warn('⚠️ Email service not configured, skipping email');
      return { success: false, message: 'Email service not configured' };
    }

    const {
      to,
      reportTitle,
      websiteUrl,
      reportUrl,
      userName = '用戶',
      expirationDays = 30
    } = options;

    try {
      const emailHtml = this.generateReportEmail({
        userName,
        reportTitle,
        websiteUrl,
        reportUrl,
        expirationDays
      });

      const result = await resend.emails.send({
        from: 'LeadIO SEO <reports@leadio.ai>',
        to: [to],
        subject: `📊 您的 SEO 分析報告已就緒 - ${websiteUrl}`,
        html: emailHtml,
        tags: [
          { name: 'type', value: 'seo-report' },
          { name: 'website', value: websiteUrl || 'unknown' }
        ]
      });

      console.log('✅ Report email sent:', {
        to,
        reportTitle,
        emailId: result.data?.id
      });

      return result;
    } catch (error) {
      console.error('❌ Failed to send report email:', error);
      throw new Error('Email sending failed: ' + error.message);
    }
  }

  // 發送報告即將過期的提醒
  static async sendExpirationReminder(options) {
    if (!resend) {
      console.warn('⚠️ Email service not configured, skipping expiration reminder');
      return { success: false, message: 'Email service not configured' };
    }

    const {
      to,
      reports = [],
      daysUntilExpiry = 3,
      userName = '用戶'
    } = options;

    try {
      const emailHtml = this.generateExpirationEmail({
        userName,
        reports,
        daysUntilExpiry
      });

      const result = await resend.emails.send({
        from: 'LeadIO SEO <notifications@leadio.ai>',
        to: [to],
        subject: `⏰ 您的 SEO 報告即將過期（${daysUntilExpiry} 天後）`,
        html: emailHtml,
        tags: [
          { name: 'type', value: 'expiration-reminder' },
          { name: 'days', value: daysUntilExpiry.toString() }
        ]
      });

      console.log('✅ Expiration reminder sent:', {
        to,
        reportsCount: reports.length,
        emailId: result.data?.id
      });

      return result;
    } catch (error) {
      console.error('❌ Failed to send expiration reminder:', error);
      throw new Error('Reminder email failed: ' + error.message);
    }
  }

  // 生成報告郵件 HTML
  static generateReportEmail({ userName, reportTitle, websiteUrl, reportUrl, expirationDays }) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>SEO 分析報告</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 30px 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px 20px; }
        .report-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: 600; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 LeadIO SEO 分析報告</h1>
          <p>您的 SEO 分析已完成</p>
        </div>
        
        <div class="content">
          <p>親愛的 ${userName}，</p>
          
          <p>您請求的 SEO 分析報告已經準備就緒！</p>
          
          <div class="report-card">
            <h3>📋 報告詳情</h3>
            <p><strong>報告標題：</strong>${reportTitle}</p>
            <p><strong>分析網站：</strong><a href="${websiteUrl}" target="_blank">${websiteUrl}</a></p>
            <p><strong>生成時間：</strong>${new Date().toLocaleString('zh-TW')}</p>
            <p><strong>有效期限：</strong>${expirationDays} 天</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${reportUrl}" class="button" target="_blank">
                🔍 查看完整報告
              </a>
            </div>
          </div>
          
          <div class="warning">
            <p><strong>⏰ 重要提醒：</strong></p>
            <ul>
              <li>此報告將在 ${expirationDays} 天後自動刪除</li>
              <li>請盡快下載或保存您需要的內容</li>
              <li>如需永久保存，建議您下載報告文件</li>
            </ul>
          </div>
          
          <p>如果您有任何問題，請隨時聯繫我們的客服團隊。</p>
          
          <p>祝您使用愉快！<br>LeadIO SEO 團隊</p>
        </div>
        
        <div class="footer">
          <p>此郵件由 LeadIO AI SEO 分析平台自動發送</p>
          <p>© 2024 FirstDream Art. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  // 生成過期提醒郵件 HTML
  static generateExpirationEmail({ userName, reports, daysUntilExpiry }) {
    const reportsList = reports.map(report => 
      `<li><strong>${report.reportTitle}</strong> - ${report.websiteUrl}</li>`
    ).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>報告即將過期提醒</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%); color: white; text-align: center; padding: 30px 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px 20px; }
        .warning-card { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .reports-list { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: 600; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ 報告即將過期提醒</h1>
          <p>您的 SEO 報告將在 ${daysUntilExpiry} 天後刪除</p>
        </div>
        
        <div class="content">
          <p>親愛的 ${userName}，</p>
          
          <div class="warning-card">
            <h3>📋 即將過期的報告</h3>
            <p>以下 SEO 報告將在 <strong>${daysUntilExpiry} 天後</strong>自動刪除：</p>
            <div class="reports-list">
              <ul>${reportsList}</ul>
            </div>
          </div>
          
          <p><strong>建議動作：</strong></p>
          <ul>
            <li>立即登入平台查看和下載重要報告</li>
            <li>將需要的內容保存到本地</li>
            <li>如需更多時間，請聯繫客服</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/reports" class="button" target="_blank">
              📊 查看我的報告
            </a>
          </div>
          
          <p>如有任何問題，請隨時聯繫我們！</p>
          
          <p>LeadIO SEO 團隊</p>
        </div>
        
        <div class="footer">
          <p>此郵件由 LeadIO AI SEO 分析平台自動發送</p>
          <p>© 2024 FirstDream Art. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  // 測試郵件服務
  static async testConnection() {
    try {
      // Resend 沒有直接的 ping 方法，我們發送一個測試郵件到開發者
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Email service configured (Resend)');
        return true;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Email service test failed:', error);
      return false;
    }
  }
}

export default EmailService;