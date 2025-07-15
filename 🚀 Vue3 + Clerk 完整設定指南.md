# 🚀 Vue3 + Clerk 完整設定指南

## 🎯 專案概述

這是一個使用 **Vue3 + Clerk + n8n** 的現代化 SEO 分析平台：

- ✅ **Vue3 + TypeScript** - 現代化前端框架
- ✅ **Clerk** - 企業級認證服務
- ✅ **Element Plus** - 美觀的 UI 組件庫
- ✅ **n8n 整合** - 無程式碼後端處理
- ✅ **完整響應式設計** - 支援桌面和行動裝置

---

## 📋 完整設定流程

### 第 1 步：安裝 Node.js 和依賴

#### 1.1 確認 Node.js 版本
```bash
node --version  # 需要 v18 或更高版本
npm --version
```

#### 1.2 初始化項目
```bash
# 進入項目目錄
cd leadio-vue3

# 安裝所有依賴
npm install

# 如果遇到依賴問題，可以嘗試：
npm install --force
```

#### 1.3 安裝額外依賴（如果需要）
```bash
# 安裝 VueUse（用於深色模式等）
npm install @vueuse/core

# 安裝頭部管理（如果使用 SEO）
npm install @unhead/vue
```

---

### 第 2 步：設定 Clerk 認證

#### 2.1 註冊 Clerk 帳號
1. 前往 [clerk.com](https://clerk.com)
2. 建立免費帳號
3. 建立新應用程式

#### 2.2 取得 API 金鑰
在 Clerk Dashboard 中：
1. 進入 **API Keys** 頁面
2. 複製 **Publishable Key**（以 `pk_` 開頭）

#### 2.3 設定環境變數
建立 `.env` 檔案：
```bash
# 複製範例檔案
cp .env.example .env

# 編輯 .env 檔案
```

在 `.env` 中填入：
```env
# Clerk 認證配置
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_key_here

# n8n 後端配置
VITE_N8N_BASE_URL=https://your-n8n-instance.zeabur.app
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.zeabur.app/webhook

# 應用配置
VITE_APP_NAME=LeadIO
VITE_APP_VERSION=1.0.0
```

#### 2.4 設定 Clerk 認證選項
在 Clerk Dashboard 中：

**認證方式設定：**
- ✅ Email/Password
- ✅ Google OAuth（推薦）
- ✅ GitHub OAuth（可選）

**重定向 URL 設定：**
- Sign-in URL: `http://localhost:3000/sign-in`
- Sign-up URL: `http://localhost:3000/sign-up`
- After sign-in: `http://localhost:3000/dashboard`
- After sign-up: `http://localhost:3000/dashboard`

---

### 第 3 步：設定 n8n 後端

#### 3.1 確認 n8n 運行
確認你的 Zeabur n8n 實例正常運行：
```bash
# 測試 n8n 健康狀態
curl https://your-n8n-instance.zeabur.app/webhook/health
```

#### 3.2 建立必要的 n8n Workflows

**需要建立的 workflows：**
1. **表單處理** (`/analysis/submit`)
2. **狀態查詢** (`/analysis/status/:id`)
3. **報告獲取** (`/analysis/report/:id`)
4. **歷史記錄** (`/analysis/history`)
5. **健康檢查** (`/health`)

**參考現有的 n8n 設定文檔：**
- `n8n-workflows-config.md`
- `zeabur-n8n-setup.md`

---

### 第 4 步：啟動開發伺服器

```bash
# 啟動開發伺服器
npm run dev

# 應用程式將在以下位址運行：
# http://localhost:3000
```

**首次啟動檢查清單：**
- [ ] 伺服器成功啟動
- [ ] 可以訪問 `http://localhost:3000`
- [ ] Clerk 登入/註冊功能正常
- [ ] 可以成功登入並跳轉到儀表板

---

### 第 5 步：測試功能

#### 5.1 測試認證流程
1. **註冊新帳號**：
   - 訪問 `/sign-up`
   - 使用 Email 註冊
   - 驗證 Email（檢查收信匣）

2. **登入現有帳號**：
   - 訪問 `/sign-in`
   - 使用註冊的 Email 登入

3. **測試認證保護**：
   - 登出後嘗試訪問 `/dashboard`
   - 應該自動重定向到登入頁

#### 5.2 測試 n8n 整合
1. **健康檢查**：
   ```bash
   # 在瀏覽器開發者工具 Console 中執行
   fetch('/api/health').then(r => r.json()).then(console.log)
   ```

2. **分析功能**：
   - 前往分析頁面
   - 提交分析請求
   - 檢查是否正確呼叫 n8n

---

## 🚀 部署到生產環境

### 選項 1：部署到 Zeabur（推薦）

#### 1. 準備部署
```bash
# 建立生產版本
npm run build

# 預覽生產版本（可選）
npm run preview
```

#### 2. 設定 Zeabur
1. 前往 [zeabur.com](https://zeabur.com)
2. 建立新專案
3. 連接 Git 倉庫
4. 選擇 Vue.js 模板

#### 3. 設定環境變數
在 Zeabur Dashboard 中設定：
```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
VITE_N8N_BASE_URL=https://your-production-n8n.zeabur.app
VITE_N8N_WEBHOOK_URL=https://your-production-n8n.zeabur.app/webhook
VITE_APP_NAME=LeadIO
VITE_APP_VERSION=1.0.0
```

#### 4. 更新 Clerk 生產設定
在 Clerk Dashboard 中更新：
- Production Domain: `https://your-app.zeabur.app`
- Redirect URLs: 更新為生產網址

### 選項 2：部署到 Vercel

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel

# 設定環境變數
vercel env add VITE_CLERK_PUBLISHABLE_KEY
vercel env add VITE_N8N_BASE_URL
# ... 其他環境變數
```

---

## 🔧 疑難排解

### 常見問題 1：Clerk 初始化失敗

**症狀：** 白畫面或 Clerk 載入錯誤

**解決方案：**
1. 檢查 `.env` 中的 `VITE_CLERK_PUBLISHABLE_KEY`
2. 確認金鑰格式正確（以 `pk_` 開頭）
3. 檢查網路連線

### 常見問題 2：n8n 連線失敗

**症狀：** API 呼叫失敗或 CORS 錯誤

**解決方案：**
1. 檢查 n8n 網址是否正確
2. 確認 n8n 服務正常運行
3. 檢查 n8n CORS 設定

### 常見問題 3：依賴安裝失敗

**症狀：** `npm install` 失敗

**解決方案：**
```bash
# 清理快取
npm cache clean --force

# 刪除 node_modules 重新安裝
rm -rf node_modules package-lock.json
npm install

# 使用 yarn 替代（可選）
npm i -g yarn
yarn install
```

### 常見問題 4：TypeScript 錯誤

**症狀：** 編譯錯誤

**解決方案：**
```bash
# 檢查 TypeScript 版本
npx tsc --version

# 重新生成自動導入類型
rm -rf auto-imports.d.ts components.d.ts
npm run dev
```

---

## 📚 進階自訂

### 自訂主題顏色
在 `src/main.ts` 中：
```typescript
// 自訂 Element Plus 主題
const app = createApp(App)
app.use(ElementPlus, {
  // 自訂主題變數
})
```

### 添加更多 OAuth 提供商
在 Clerk Dashboard 中：
1. 前往 **Social Connections**
2. 啟用 Google、GitHub、Apple 等
3. 設定對應的 OAuth 應用

### 自訂 Clerk 樣式
在組件中使用 `:appearance` 屬性：
```vue
<SignIn :appearance="{
  elements: {
    formButtonPrimary: 'custom-button-class'
  }
}" />
```

---

## 🎯 效能優化

### 1. 建立優化
```bash
# 分析打包大小
npm run build -- --analyze

# 啟用 Gzip 壓縮（生產環境）
```

### 2. 載入優化
- ✅ 路由懶加載已設定
- ✅ Element Plus 自動導入已設定
- ✅ Tree-shaking 已啟用

### 3. 快取策略
```typescript
// 在 vite.config.ts 中設定
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['element-plus']
        }
      }
    }
  }
})
```

---

## 🎉 恭喜完成！

設定完成後，你將擁有：

✅ **現代化的 Vue3 應用程式**  
✅ **企業級 Clerk 認證系統**  
✅ **美觀的 Element Plus UI**  
✅ **完整的 n8n 後端整合**  
✅ **響應式設計**  
✅ **深色模式支援**  
✅ **TypeScript 類型安全**  

## 📞 技術支援

如果遇到任何問題：

1. **檢查控制台錯誤** - 開啟瀏覽器開發者工具
2. **查看網路請求** - 確認 API 呼叫狀態
3. **檢查環境變數** - 確認所有設定正確
4. **查看日誌** - 檢查 Zeabur/Vercel 部署日誌

**快樂編程！** 🚀 