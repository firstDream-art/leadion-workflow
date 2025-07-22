import { query, testConnection, closeDatabase } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

// 數據庫表結構
const migrations = [
  {
    version: '001',
    name: 'create_seo_reports_table',
    up: `
      CREATE TABLE IF NOT EXISTS seo_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        clerk_user_id VARCHAR(255) NOT NULL COMMENT '來自Clerk的用戶ID',
        report_url TEXT NOT NULL COMMENT '報告的完整訪問URL',
        report_title VARCHAR(500) NOT NULL COMMENT '報告標題',
        website_url VARCHAR(500) NOT NULL COMMENT '被分析的網站URL',
        file_size BIGINT COMMENT '文件大小(bytes)',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'deleted'))
      );
    `,
    down: `DROP TABLE IF EXISTS seo_reports;`
  },
  {
    version: '002',
    name: 'create_indexes_on_seo_reports',
    up: `
      CREATE INDEX IF NOT EXISTS idx_seo_reports_clerk_user_id ON seo_reports(clerk_user_id);
      CREATE INDEX IF NOT EXISTS idx_seo_reports_status ON seo_reports(status);
      CREATE INDEX IF NOT EXISTS idx_seo_reports_expires_at ON seo_reports(expires_at);
      CREATE INDEX IF NOT EXISTS idx_seo_reports_created_at ON seo_reports(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_seo_reports_user_status ON seo_reports(clerk_user_id, status);
    `,
    down: `
      DROP INDEX IF EXISTS idx_seo_reports_user_id;
      DROP INDEX IF EXISTS idx_seo_reports_status;
      DROP INDEX IF EXISTS idx_seo_reports_expires_at;
      DROP INDEX IF EXISTS idx_seo_reports_created_at;
      DROP INDEX IF EXISTS idx_seo_reports_user_status;
    `
  },
  {
    version: '003',
    name: 'create_migration_history_table',
    up: `
      CREATE TABLE IF NOT EXISTS migration_history (
        id SERIAL PRIMARY KEY,
        version VARCHAR(10) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
    down: `DROP TABLE IF EXISTS migration_history;`
  },
  {
    version: '004',
    name: 'add_updated_at_trigger',
    up: `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      CREATE TRIGGER update_seo_reports_updated_at
        BEFORE UPDATE ON seo_reports
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `,
    down: `
      DROP TRIGGER IF EXISTS update_seo_reports_updated_at ON seo_reports;
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `
  }
];

// 檢查是否已執行過某個遷移
async function isMigrationExecuted(version) {
  try {
    const result = await query(
      'SELECT 1 FROM migration_history WHERE version = $1',
      [version]
    );
    return result.rows.length > 0;
  } catch (error) {
    // 如果 migration_history 表不存在，則認為所有遷移都未執行
    if (error.code === '42P01') { // table does not exist
      return false;
    }
    throw error;
  }
}

// 記錄遷移執行
async function recordMigration(migration) {
  try {
    await query(
      'INSERT INTO migration_history (version, name) VALUES ($1, $2)',
      [migration.version, migration.name]
    );
    console.log(`✅ Migration ${migration.version} recorded`);
  } catch (error) {
    // 如果表還不存在，跳過記錄（這會在後續遷移中創建）
    if (error.code === '42P01') {
      console.log(`⚠️ Migration history table not yet created, skipping record`);
      return;
    }
    throw error;
  }
}

// 執行單個遷移
async function runMigration(migration) {
  try {
    console.log(`🔄 Running migration ${migration.version}: ${migration.name}`);
    
    // 執行 SQL 語句（可能包含多個語句）
    const statements = migration.up.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement.trim());
      }
    }
    
    // 記錄遷移執行（如果可能）
    await recordMigration(migration);
    
    console.log(`✅ Migration ${migration.version} completed successfully`);
    
  } catch (error) {
    console.error(`❌ Migration ${migration.version} failed:`, error.message);
    throw error;
  }
}

// 執行所有待執行的遷移
async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');
  
  try {
    // 測試數據庫連接
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Cannot connect to database');
    }
    
    let executedCount = 0;
    
    for (const migration of migrations) {
      const alreadyExecuted = await isMigrationExecuted(migration.version);
      
      if (alreadyExecuted) {
        console.log(`⏭️ Migration ${migration.version} already executed, skipping`);
        continue;
      }
      
      await runMigration(migration);
      executedCount++;
    }
    
    console.log(`\n🎉 Database migrations completed!`);
    console.log(`📊 Executed ${executedCount} new migrations`);
    
    // 顯示當前數據庫狀態
    await showDatabaseStatus();
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// 顯示數據庫狀態
async function showDatabaseStatus() {
  try {
    console.log('\n📊 Database Status:');
    
    // 檢查表是否存在
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('📋 Tables:', tablesResult.rows.map(row => row.table_name).join(', '));
    
    // 如果 seo_reports 表存在，顯示記錄數
    if (tablesResult.rows.some(row => row.table_name === 'seo_reports')) {
      const countResult = await query('SELECT COUNT(*) FROM seo_reports');
      console.log('📄 SEO Reports count:', countResult.rows[0].count);
    }
    
    // 顯示遷移歷史
    try {
      const migrationResult = await query(`
        SELECT version, name, executed_at 
        FROM migration_history 
        ORDER BY executed_at DESC
      `);
      console.log('🕒 Migration History:');
      migrationResult.rows.forEach(row => {
        console.log(`   ${row.version}: ${row.name} (${new Date(row.executed_at).toLocaleString()})`);
      });
    } catch (error) {
      console.log('⚠️ Migration history not available');
    }
    
  } catch (error) {
    console.error('❌ Failed to show database status:', error.message);
  }
}

// 回滾遷移（危險操作）
async function rollbackMigration(version) {
  console.log(`🔄 Rolling back migration ${version}...`);
  
  const migration = migrations.find(m => m.version === version);
  if (!migration) {
    throw new Error(`Migration ${version} not found`);
  }
  
  try {
    // 執行回滾 SQL
    const statements = migration.down.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement.trim());
      }
    }
    
    // 從遷移歷史中移除記錄
    await query('DELETE FROM migration_history WHERE version = $1', [version]);
    
    console.log(`✅ Migration ${version} rolled back successfully`);
    
  } catch (error) {
    console.error(`❌ Rollback ${version} failed:`, error.message);
    throw error;
  }
}

// 主執行邏輯
async function main() {
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'up':
      case undefined:
        await runMigrations();
        break;
        
      case 'rollback':
        const version = process.argv[3];
        if (!version) {
          console.error('❌ Please provide migration version to rollback');
          process.exit(1);
        }
        await rollbackMigration(version);
        break;
        
      case 'status':
        await testConnection();
        await showDatabaseStatus();
        break;
        
      default:
        console.log('📖 Usage:');
        console.log('  npm run migrate          # Run all pending migrations');
        console.log('  npm run migrate up       # Same as above');
        console.log('  npm run migrate status   # Show database status');
        console.log('  npm run migrate rollback <version>  # Rollback specific migration');
        break;
    }
  } finally {
    await closeDatabase();
  }
}

// 如果直接執行此腳本
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });
}

export { runMigrations, rollbackMigration, showDatabaseStatus };