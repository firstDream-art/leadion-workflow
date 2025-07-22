# 🚀 LeadIO 後端快速開始

根據你的HTML報告格式，我為你準備了兩種存儲方案：

## 方案一：立即開始（推薦新手）

### ✅ 使用本地存儲 - 無需註冊任何服務！

```bash
# 1. 安裝依賴
cd leadio-api
npm install

# 2. 複製環境變數
cp .env.example .env

# 3. 編輯 .env 文件，設置以下基本配置：
DATABASE_URL=你的PostgreSQL連接字符串
STORAGE_TYPE=local
API_SECRET_KEY=請生成一個隨機密鑰
CLERK_SECRET_KEY=從你的Vue前端複製

# 4. 運行數據庫遷移
npm run migrate

# 5. 啟動服務器
npm run dev
```

**特色**：
- ✅ HTML報告直接存在服務器上 (`uploads/reports/`)
- ✅ 通過URL直接訪問：`http://localhost:3001/reports/user123/EXAMPLE-2025-01-21-1320.html`
- ✅ 與你現有的 `SIRO-20250721-1319.html` 格式完全兼容
- ✅ 零成本，無需註冊外部服務

## 方案二：專業部署（正式上線推薦）

### 🌥️ 升級到 Cloudinary 雲端存儲

當你準備正式上線時：

```bash
# 1. 註冊 Cloudinary
# 前往 https://cloudinary.com 免費註冊

# 2. 獲取配置信息
# 在Dashboard複製：Cloud name, API Key, API Secret

# 3. 修改 .env 文件：
STORAGE_TYPE=cloudinary
CLOUDINARY_CLOUD_NAME=你的cloud_name
CLOUDINARY_API_KEY=你的api_key
CLOUDINARY_API_SECRET=你的api_secret

# 4. 重啟服務器
npm run dev
```

**優勢**：
- ✅ CDN 加速，全球快速訪問
- ✅ 自動備份和容災
- ✅ 無限存儲空間（付費後）
- ✅ 專業的文件管理功能

## 🔗 整合 n8n

在你的 n8n 工作流程最後添加 HTTP Request 節點：

```json
{
  "method": "POST",
  "url": "http://localhost:3001/api/reports",
  "headers": {
    "x-api-key": "你的API_SECRET_KEY",
    "Content-Type": "application/json"
  },
  "body": {
    "userId": "{{ $('用戶認證節點').item.json.userId }}",
    "htmlContent": "{{ $('讀取HTML文件').item.json.html }}",
    "websiteUrl": "{{ $('輸入表單').item.json.website }}",
    "reportTitle": "SEO Analysis - {{ $('輸入表單').item.json.website }}",
    "userEmail": "{{ $('用戶信息').item.json.email }}"
  }
}
```

## 📂 HTML 報告格式支持

你的報告格式完全兼容：
- ✅ 完整的CSS樣式（內嵌和外部）
- ✅ 字體資源（Google Fonts等）
- ✅ 自定義變數和動畫
- ✅ 響應式設計
- ✅ 可以直接在瀏覽器中打開

## 🧪 測試 API

```bash
# 健康檢查
curl http://localhost:3001/health

# 測試報告上傳（需要你的實際HTML內容）
curl -X POST http://localhost:3001/api/reports \
  -H "x-api-key: 你的API密鑰" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "htmlContent": "<!DOCTYPE html><html>...</html>",
    "websiteUrl": "https://example.com",
    "reportTitle": "Test Report"
  }'
```

## 🔄 從本地存儲遷移到Cloudinary

如果你先用本地存儲開始，後來想升級：

```bash
# 1. 修改環境變數為 cloudinary
# 2. 重啟服務器
# 3. 舊報告仍然可訪問
# 4. 新報告會自動存到Cloudinary
```

## 📊 文件管理

### 本地存儲結構：
```
leadio-api/
├── uploads/
│   └── reports/
│       ├── user-123/
│       │   ├── EXAMPLE-2025-01-21-1320.html
│       │   └── SIRO-2025-01-21-1321.html
│       └── user-456/
│           └── DEMO-2025-01-21-1322.html
```

### 訪問URL格式：
- 本地：`http://localhost:3001/reports/user-123/EXAMPLE-2025-01-21-1320.html`
- Cloudinary：`https://res.cloudinary.com/your-name/raw/upload/.../report.html`

## ⚡ 性能優化

### 本地存儲：
- 適合：測試、小型部署
- 限制：服務器存儲空間
- 優化：定期清理過期文件

### Cloudinary：
- 適合：生產環境
- 優勢：無限空間、全球CDN
- 成本：免費25GB/月，超出後付費

## 🛠️ 故障排除

**Q: 報告文件訪問不了？**
A: 檢查 `uploads/reports/` 目錄權限，確保服務器有寫入權限

**Q: HTML樣式顯示不正確？**
A: 檢查你的HTML中的外部資源連結（CSS、字體等）

**Q: n8n無法調用API？**
A: 檢查API_SECRET_KEY配置，確保n8n和服務器使用相同的密鑰

---

**推薦路線**：
1. 🟢 先用**本地存儲**快速測試整個流程
2. 🟡 確認功能正常後升級到**Cloudinary**
3. 🔴 部署到**Zeabur**享受專業服務

立即開始！不需要註冊任何外部服務 🚀