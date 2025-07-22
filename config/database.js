import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// 數據庫配置
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  max: 20, // 連接池最大連接數
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// 創建連接池
export const pool = new Pool(dbConfig);

// 測試數據庫連接
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connected successfully at:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// 優雅關閉數據庫連接
export const closeDatabase = async () => {
  try {
    await pool.end();
    console.log('🔐 Database connection pool closed');
  } catch (error) {
    console.error('❌ Error closing database:', error);
  }
};

// 數據庫查詢包裝器
export const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query executed:', {
      query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      duration: duration + 'ms',
      rows: result.rows.length
    });
    return result;
  } catch (error) {
    console.error('🚨 Database query error:', {
      query: text,
      params,
      error: error.message
    });
    throw error;
  }
};

// 事務包裝器
export const transaction = async (queries) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const results = [];
    
    for (const { text, params } of queries) {
      const result = await client.query(text, params);
      results.push(result);
    }
    
    await client.query('COMMIT');
    console.log('✅ Transaction completed successfully');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('🚨 Transaction failed, rolled back:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

export default pool;