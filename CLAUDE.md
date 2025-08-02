# 🤖 Claude AI 助手工作指南

## 專案資訊
- **專案名稱**: Leadion AI
- **專案類型**: AI 驅動的 SEO 分析平台
- **主要技術**: Vue 3 + TypeScript / Node.js + Express / PostgreSQL

## 重要文件位置
- **設計規格**: `PROJECT_DESIGN_SPEC.md`
- **部署指南**: `ZEABUR_DEPLOYMENT.md`
- **域名設定**: `LEADION_AI_DOMAIN_SETUP.md`

## 工作前檢查清單

### 1. 程式碼修改前
- [ ] 閱讀 `PROJECT_DESIGN_SPEC.md` 了解專案規範
- [ ] 確認修改符合現有架構設計
- [ ] 檢查是否有相關的測試需要更新

### 2. 認證系統相關
- 使用 JWT token 進行認證
- Access Token 有效期: 24小時
- Refresh Token 有效期: 7天
- Token 儲存於 localStorage

### 3. 點數系統相關
- 新用戶贈送: 300點
- 每次分析扣除: 10點
- 管理員 Email: jianjingkuan@gmail.com, riverchang@adbest.com.tw

### 4. UI/UX 規範
- 主色調: #00d4ff
- 暗色模式: 深色背景 + 白色文字
- 使用 Element Plus 元件庫
- 響應式設計優先

### 5. API 開發規範
```javascript
// 統一回應格式
{
  success: boolean,
  data?: any,
  error?: string,
  message?: string
}
```

### 6. 環境配置
- 本地開發: `npm run dev` (前端) / `npm run dev` (後端)
- 測試環境: `npm run dev:test` (使用 .env.test)
- 生產環境: 使用 .env.production

## 常用指令

### 前端開發
```bash
cd leadio-vue3
npm run dev          # 本地開發
npm run dev:test     # 測試環境
npm run build        # 構建生產版本
npm run preview      # 預覽構建結果
```

### 後端開發
```bash
cd leadio-api/backend
npm run dev          # 本地開發
npm start            # 生產環境
```

### Git 操作
```bash
# 提交前先檢查敏感資訊
git status
git add .
git commit -m "feat: 功能描述"
git push origin main
```

## 注意事項

### ⚠️ 安全規範
1. **絕不**將真實的 API 密鑰提交到 Git
2. 使用 `your-xxx-here` 作為範例值
3. 敏感資訊只存在 .env 文件中
4. CORS 設定要限制信任的域名

### 🚫 禁止事項
1. 不要使用 `any` 類型，使用 `unknown` 或具體類型
2. 不要直接操作 DOM，使用 Vue 的響應式系統
3. 不要在前端儲存敏感資訊
4. 不要忽略錯誤處理

### ✅ 最佳實踐
1. 每個功能都要有適當的錯誤處理
2. 使用 TypeScript 的類型系統
3. 遵循 RESTful API 設計原則
4. 保持程式碼簡潔可讀

## 問題排查

### 常見問題
1. **CORS 錯誤**: 檢查後端 CORS 配置
2. **認證失敗**: 檢查 JWT token 是否過期
3. **點數扣除失敗**: 確認用戶餘額充足
4. **Email 發送失敗**: 檢查 Gmail App Password

### 調試工具
- Vue DevTools: 檢查元件狀態
- Network 面板: 監控 API 請求
- Console: 查看錯誤訊息

## 聯絡資訊
- **管理員**: jianjingkuan@gmail.com
- **專案倉庫**: leadion-workflow
- **部署平台**: Zeabur

---

**記住**: 在進行任何修改前，請先閱讀 `PROJECT_DESIGN_SPEC.md` 確保符合專案規範！