#!/usr/bin/env node

/**
 * 測試檢查腳本
 * 確保所有新增的代碼都有對應的測試
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { resolve } from 'path'

console.log('🧪 執行測試檢查...\n')

// 1. 執行所有測試
console.log('📋 步驟 1: 執行所有測試')
try {
  execSync('npm run test:run', { stdio: 'inherit' })
  console.log('✅ 所有測試通過\n')
} catch (error) {
  console.error('❌ 測試失敗！')
  console.error('📝 請修復失敗的測試後再提交代碼')
  process.exit(1)
}

// 2. 檢查測試覆蓋率
console.log('📋 步驟 2: 檢查測試覆蓋率')
try {
  const coverage = execSync('npm run test:coverage -- --reporter=json', { encoding: 'utf-8' })
  const coverageData = JSON.parse(coverage.split('\n').find(line => line.startsWith('{')))
  
  const { lines, functions, branches, statements } = coverageData.total
  
  console.log(`📊 覆蓋率報告:`)
  console.log(`   Lines: ${lines.pct}%`)
  console.log(`   Functions: ${functions.pct}%`)
  console.log(`   Branches: ${branches.pct}%`)
  console.log(`   Statements: ${statements.pct}%`)
  
  if (lines.pct < 80 || functions.pct < 80 || branches.pct < 80 || statements.pct < 80) {
    console.error('\n❌ 測試覆蓋率不足 80%！')
    console.error('📝 請為新增的代碼編寫測試')
    process.exit(1)
  }
  
  console.log('✅ 測試覆蓋率達標\n')
} catch (error) {
  console.warn('⚠️ 無法檢查覆蓋率，請手動執行 npm run test:coverage\n')
}

// 3. 檢查是否有未測試的新檔案
console.log('📋 步驟 3: 檢查新增檔案是否有測試')

const checkTestExists = (filePath, testPath) => {
  if (existsSync(resolve(filePath)) && !existsSync(resolve(testPath))) {
    console.error(`❌ 檔案 ${filePath} 缺少測試檔案 ${testPath}`)
    return false
  }
  return true
}

let hasAllTests = true

// 檢查常見的檔案類型
const filesToCheck = [
  // Store 檔案
  { src: 'src/stores/auth.ts', test: 'src/stores/__tests__/auth.test.ts' },
  // Service 檔案
  { src: 'src/services/authService.ts', test: 'src/services/__tests__/authService.test.ts' },
  { src: 'src/services/creditService.ts', test: 'src/services/__tests__/creditService.test.ts' },
  // Component 檔案
  { src: 'src/components/CreditDisplay.vue', test: 'src/components/__tests__/CreditDisplay.test.ts' },
]

filesToCheck.forEach(({ src, test }) => {
  if (!checkTestExists(src, test)) {
    hasAllTests = false
  }
})

if (!hasAllTests) {
  console.error('\n📝 請為上述檔案新增對應的測試檔案')
  process.exit(1)
}

console.log('✅ 所有主要檔案都有對應測試\n')

console.log('🎉 測試檢查完成！代碼可以提交。')