# 🎨 Rive 檔案設定指南

## 📁 檔案位置
請將您的 `.riv` 檔案放置在此資料夾中，並命名為 `character.riv`

## 🔧 Rive 檔案設定要求

### 1. State Machine 設定
- **名稱**: `Main`
- **類型**: State Machine

### 2. 輸入參數設定
需要建立兩個 Number 類型的輸入：

#### X軸輸入
- **名稱**: `xAxis`
- **類型**: Number
- **範圍**: 0 - 100
- **預設值**: 50

#### Y軸輸入
- **名稱**: `yAxis`  
- **類型**: Number
- **範圍**: 0 - 100
- **預設值**: 50

### 3. 動畫設定建議

#### 眼球追蹤
```
眼球物件 → 新增約束 (Constraint)
- 類型: Translation 或 Rotation
- Target: 滑鼠位置對應的座標
- 輸入綁定: xAxis, yAxis
```

#### 頭部轉動
```
頭部物件 → 新增約束 (Constraint)  
- 類型: Rotation
- 軸向: Z軸 (2D旋轉)
- 範圍: -30° 到 +30°
- 輸入綁定: xAxis (水平轉動)
```

#### 平滑效果 (可選)
```
在約束設定中加入:
- Damping: 0.8 - 0.95 (較高值 = 較平滑)
- Strength: 0.5 - 1.0 (影響強度)
```

## 🎯 快速開始

### 方法1: 使用Rive編輯器
1. 前往 [rive.app](https://rive.app) 註冊帳號
2. 建立新專案 → 選擇空白畫布
3. 設計您的2D角色 (可使用基本形狀或匯入SVG)
4. 新增 State Machine: `Main`
5. 新增兩個 Number 輸入: `xAxis`, `yAxis`
6. 設定眼睛/頭部的約束，讓它們響應這些輸入
7. 匯出為 `.riv` 檔案

### 方法2: 使用社群範本
1. 在 Rive 社群中搜尋 "eye tracking" 或 "mouse follow"
2. 複製現有範本
3. 修改 State Machine 和輸入名稱以符合上述要求
4. 自訂角色外觀
5. 匯出檔案

## 🔍 常見問題

### Q: 動畫沒有反應？
A: 檢查以下項目：
- State Machine 名稱是否為 `Main`
- 輸入名稱是否為 `xAxis` 和 `yAxis`
- 約束是否正確綁定到這些輸入
- 檔案是否放在正確位置 (`public/rive/character.riv`)

### Q: 動作太快或太慢？
A: 在 Vue 組件中調整：
- **平滑度滑桿**: 控制動畫平滑程度
- **敏感度滑桿**: 控制反應靈敏度
- 或在 Rive 中調整約束的 Damping 值

### Q: 想要更複雜的動畫？
A: 可以添加：
- 多個 1D Blend 用於不同的動作狀態
- 觸發器 (Trigger) 用於特殊動畫
- 布林輸入 (Boolean) 用於切換模式
- 更多的約束和骨骼系統

## 📚 參考資源

- [Rive 官方文檔](https://help.rive.app/)
- [State Machine 教程](https://help.rive.app/runtimes/state-machines)
- [約束系統指南](https://help.rive.app/editor/constraints)
- [Vue 3 + Rive 整合](https://help.rive.app/runtimes/overview/web-js/vue)

## 🎨 設計靈感

### 簡單角色
- 基本幾何形狀 (圓形頭部 + 橢圓眼睛)
- 線條藝術風格
- 最小化設計

### 進階角色  
- 完整的人物或動物角色
- 表情變化
- 身體部位聯動
- 背景互動

---

**提示**: 如果您是第一次使用 Rive，建議從簡單的幾何形狀開始，逐步增加複雜度！ 