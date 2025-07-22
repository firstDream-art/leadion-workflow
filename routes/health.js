import express from 'express';
import { testConnection } from '../config/database.js';
import CloudinaryService from '../services/cloudinary.js';
import EmailService from '../services/email.js';

const router = express.Router();

// 基本健康檢查
router.get('/', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    services: {
      database: 'unknown',
      cloudinary: 'unknown',
      email: 'unknown'
    }
  };

  try {
    // 檢查數據庫連接
    const dbConnected = await testConnection();
    health.services.database = dbConnected ? 'connected' : 'disconnected';

    // 檢查 Cloudinary
    const cloudinaryConnected = await CloudinaryService.checkConnection();
    health.services.cloudinary = cloudinaryConnected ? 'connected' : 'disconnected';

    // 檢查郵件服務
    const emailConnected = await EmailService.testConnection();
    health.services.email = emailConnected ? 'configured' : 'not_configured';

    // 判斷總體狀態
    const allServicesOk = Object.values(health.services).every(
      status => status === 'connected' || status === 'configured'
    );

    if (!allServicesOk) {
      health.status = 'degraded';
    }

    const statusCode = health.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(health);

  } catch (error) {
    health.status = 'error';
    health.error = error.message;
    res.status(500).json(health);
  }
});

// 詳細健康檢查
router.get('/detailed', async (req, res) => {
  const details = {
    status: 'checking',
    timestamp: new Date().toISOString(),
    checks: {}
  };

  try {
    // 數據庫詳細檢查
    details.checks.database = {
      status: 'checking',
      responseTime: null,
      error: null
    };

    const dbStart = Date.now();
    const dbConnected = await testConnection();
    details.checks.database.responseTime = Date.now() - dbStart;
    details.checks.database.status = dbConnected ? 'healthy' : 'unhealthy';

    // Cloudinary 詳細檢查
    details.checks.cloudinary = {
      status: 'checking',
      responseTime: null,
      error: null
    };

    const cloudinaryStart = Date.now();
    const cloudinaryConnected = await CloudinaryService.checkConnection();
    details.checks.cloudinary.responseTime = Date.now() - cloudinaryStart;
    details.checks.cloudinary.status = cloudinaryConnected ? 'healthy' : 'unhealthy';

    // 郵件服務檢查
    details.checks.email = {
      status: 'configured',
      apiKey: process.env.RESEND_API_KEY ? 'present' : 'missing'
    };

    // 系統資源檢查
    details.checks.system = {
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      uptime: Math.round(process.uptime()),
      nodeVersion: process.version
    };

    // 判斷總體狀態
    const healthyServices = Object.values(details.checks).filter(
      check => check.status === 'healthy' || check.status === 'configured'
    ).length;

    details.status = healthyServices === Object.keys(details.checks).length ? 'healthy' : 'degraded';

    const statusCode = details.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(details);

  } catch (error) {
    details.status = 'error';
    details.error = error.message;
    res.status(500).json(details);
  }
});

export default router;