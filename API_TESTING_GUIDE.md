# API 連接測試指南

## 方法 1：使用 UI 測試組件（推薦）

### 步驟：
1. 啟動應用程序：`npm run dev`
2. 打開瀏覽器訪問應用
3. 在開發模式下，您會看到 "API 連接測試" 卡片
4. 點擊 "測試連接" 按鈕
5. 查看測試結果

### 測試結果說明：
- ✅ **已連接**：API 正常工作，可以生成詞彙
- ❌ **連接失敗**：檢查配置和網絡連接
- ⚠️ **未測試**：尚未進行測試

## 方法 2：使用瀏覽器控制台

### 步驟：
1. 打開瀏覽器開發者工具（F12）
2. 切換到 Console 標籤
3. 運行以下命令：

```javascript
// 測試通用 API 連接
testAPI.testConnection()

// 測試詞彙生成
testAPI.testVocabulary()

// 專門測試 Gemini API
testGemini.testAPI()

// 測試特定 Gemini 端點
testGemini.testEndpoint("/models")
```

### 控制台輸出示例：
```
🔍 開始測試 API 連接...
📋 檢查配置...
配置狀態: ✅ 已配置
📊 當前配置:
- 提供商: Gemini
- 模型: gemini-1.5-pro
- 端點: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent
- API Key: AIzaSyC...
🌐 測試 API 連接...
✅ API 連接成功！
🎉 您可以正常使用詞彙生成功能
```

## 方法 3：檢查配置文件

### 檢查 `src/config/aiConfig.ts`：

```typescript
// 確保以下設置正確
export const AI_CONFIG = {
  gemini: {
    name: "Gemini",
    baseUrl: "http://3.86.95.162:8000", // 您的自定義端點
    apiKey: "sk-wingswin", // 您的 API key
    model: "gemini-2.5-flash" // 您的模型名稱
  }
};

export const ACTIVE_PROVIDER = 'gemini'; // 確保選擇正確的提供商
```

### Gemini API 格式說明：

您的 API 支持以下端點：
- `GET /models` - 列出可用的 Gemini 模型
- `POST /models/{model_name}:generateContent` - 生成內容
- `POST /models/{model_name}:streamGenerateContent` - 流式生成內容

系統會自動構建正確的 URL 格式：`{baseUrl}/models/{model_name}:generateContent`

## 常見問題排查

### 1. API Key 錯誤
**症狀**：`401 Unauthorized` 或 `API key 無效`
**解決方案**：
- 檢查 API key 是否正確
- 確保 API key 有足夠的權限
- 對於 Gemini，確保使用 `AIza...` 格式的 key

### 2. 端點錯誤
**症狀**：`404 Not Found` 或 `端點不存在`
**解決方案**：
- 檢查 baseUrl 是否正確
- 確保模型名稱正確
- 驗證 API 端點是否可訪問

### 3. 網絡連接問題
**症狀**：`Network Error` 或 `無法連接到服務器`
**解決方案**：
- 檢查網絡連接
- 確認防火牆設置
- 嘗試訪問 API 端點

### 4. CORS 錯誤
**症狀**：`CORS policy` 錯誤
**解決方案**：
- 如果是本地 API，確保允許跨域請求
- 檢查 API 服務器的 CORS 設置

### 5. 模型不可用
**症狀**：`Model not found` 或 `模型不存在`
**解決方案**：
- 檢查模型名稱是否正確
- 確認模型是否在您的 API 計劃中可用

## 測試不同提供商

### 切換到自定義 API：
```typescript
// 在 src/config/aiConfig.ts 中
export const ACTIVE_PROVIDER = 'custom';

// 設置自定義配置
custom: {
  name: "Custom",
  baseUrl: "https://your-api-endpoint.com/v1/chat/completions",
  apiKey: "your-api-key",
  model: "your-model"
}
```

### 切換到 OpenAI：
```typescript
export const ACTIVE_PROVIDER = 'openai';
```

### 切換到 Anthropic：
```typescript
export const ACTIVE_PROVIDER = 'anthropic';
```

## 調試技巧

### 1. 查看詳細錯誤信息
在瀏覽器控制台中運行：
```javascript
// 查看當前配置
console.log((window as any).aiService?.provider)

// 查看詳細錯誤
testAPI.testConnection().catch(console.error)
```

### 2. 測試不同的請求
```javascript
// 測試簡單請求
testAPI.testConnection()

// 測試完整功能
testAPI.testVocabulary()
```

### 3. 檢查網絡請求
在瀏覽器開發者工具的 Network 標籤中查看：
- 請求 URL 是否正確
- 請求頭是否包含正確的認證信息
- 響應狀態碼和內容

## 成功標誌

當您看到以下信息時，表示 API 配置成功：

```
✅ API 連接成功！
🎉 您可以正常使用詞彙生成功能
```

此時您可以：
1. 正常使用詞彙生成功能
2. 創建每週學習計劃
3. 進行每日學習會話

