export const errorHandler = (err, req, res, next) => {
  console.error('🚨 Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Clerk 認證錯誤
  if (err.name === 'ClerkAPIResponseError' || err.message.includes('clerk')) {
    return res.status(401).json({
      error: 'Authentication Error',
      message: 'Invalid or expired authentication token'
    });
  }

  // 數據庫連接錯誤
  if (err.code === 'ECONNREFUSED' || err.message.includes('database')) {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Database connection failed. Please try again later.'
    });
  }

  // 文件上傳錯誤
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File Too Large',
      message: 'Report file size exceeds the maximum allowed limit'
    });
  }

  // Cloudinary 錯誤
  if (err.message.includes('cloudinary') || err.http_code) {
    return res.status(502).json({
      error: 'Storage Service Error',
      message: 'Failed to upload file to storage service'
    });
  }

  // 驗證錯誤
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details || []
    });
  }

  // 404 錯誤
  if (err.status === 404 || err.message.includes('not found')) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'The requested resource was not found'
    });
  }

  // 默認服務器錯誤
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong. Please try again later.' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack,
      details: err
    })
  });
};