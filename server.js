import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// 路由導入
import reportsRouter from './routes/reports.js';
import healthRouter from './routes/health.js';

// 中間件導入
import { errorHandler } from './middleware/errorHandler.js';
import { clerkMiddleware } from './middleware/clerk.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 🛡️ 安全中間件
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
    },
  },
}));

// 🗜️ 壓縮中間件
app.use(compression());

// 🌍 CORS 配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// 📊 速率限制
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 分鐘
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 每 IP 限制請求數
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 📝 請求解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 📁 靜態文件服務 - 提供報告文件訪問
app.use('/reports', express.static(path.join(__dirname, 'uploads', 'reports')));

// 📋 請求日誌
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 🔐 Clerk 認證中間件 (僅對需要認證的路由)
app.use('/api/reports', clerkMiddleware);

// 📍 路由配置
app.use('/health', healthRouter);
app.use('/api/reports', reportsRouter);

// 🏠 根路由
app.get('/', (req, res) => {
  res.json({
    message: '🚀 LeadIO API Server is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      reports: '/api/reports',
      docs: '/api/docs'
    }
  });
});

// 📚 API 文檔路由
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'LeadIO API Documentation',
    version: '1.0.0',
    endpoints: {
      'GET /health': '服務器健康檢查',
      'GET /api/reports': '取得用戶的所有報告',
      'GET /api/reports/:id': '取得特定報告',
      'POST /api/reports': '創建新報告 (供 n8n 調用)',
      'POST /api/reports/:id/email': '發送報告到郵件',
      'DELETE /api/reports/:id': '刪除報告'
    },
    authentication: 'Bearer token from Clerk',
    rateLimit: {
      window: '15 minutes',
      maxRequests: 100
    }
  });
});

// ❌ 404 處理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: ['/health', '/api/reports', '/api/docs']
  });
});

// 🚨 錯誤處理中間件
app.use(errorHandler);

// 🔄 優雅關閉
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// 🚀 啟動服務器
const server = app.listen(PORT, () => {
  console.log(`
  🚀 LeadIO API Server started successfully!
  
  📍 Server: http://localhost:${PORT}
  📚 API Docs: http://localhost:${PORT}/api/docs
  💊 Health Check: http://localhost:${PORT}/health
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  
  🔗 Ready to receive requests from Vue frontend!
  `);
});

export default app;