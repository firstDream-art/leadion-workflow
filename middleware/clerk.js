import { clerkClient } from '@clerk/express';

export const clerkMiddleware = async (req, res, next) => {
  try {
    // 從 Authorization header 取得 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header'
      });
    }

    const token = authHeader.substring(7); // 移除 'Bearer ' 前綴

    // 驗證 Clerk token
    const payload = await clerkClient.verifyToken(token);
    
    if (!payload || !payload.sub) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }

    // 將用戶 ID 附加到請求對象
    req.userId = payload.sub;
    req.user = payload;

    console.log(`✅ User authenticated: ${req.userId}`);
    next();
  } catch (error) {
    console.error('🚨 Authentication error:', error);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token verification failed'
    });
  }
};

// 可選的認證中間件 - 如果有 token 就驗證，沒有也放行
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = await clerkClient.verifyToken(token);
      
      if (payload && payload.sub) {
        req.userId = payload.sub;
        req.user = payload;
      }
    }
    next();
  } catch (error) {
    // 可選認證失敗不阻止請求
    console.log('Optional auth failed, continuing without auth');
    next();
  }
};