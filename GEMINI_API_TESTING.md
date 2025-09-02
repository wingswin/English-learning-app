# Gemini API 測試指南

## 您的 Gemini API 配置

根據您的配置，系統使用以下設置：

```typescript
gemini: {
  name: "Gemini",
  baseUrl: "http://3.86.95.162:8000",
  apiKey: "sk-wingswin",
  model: "gemini-2.5-flash"
}
```

## API 端點格式

您的 API 支持以下端點格式：

- `GET /models` - 列出可用的 Gemini 模型
- `POST /models/{model_name}:generateContent` - 生成內容
- `POST /models/{model_name}:streamGenerateContent` - 流式生成內容

## 測試方法

### 方法 1：使用 UI 測試組件

1. 啟動應用：`npm run dev`
2. 打開瀏覽器訪問應用
3. 在開發模式下，您會看到 "API 連接測試" 卡片
4. 點擊 "測試連接" 按鈕
5. 查看測試結果

### 方法 2：使用瀏覽器控制台

打開瀏覽器開發者工具（F12），在 Console 中運行：

```javascript
// 測試完整的 Gemini API
testGemini.testAPI()

// 測試模型列表端點
testGemini.testEndpoint("/models")

// 測試通用 API 連接
testAPI.testConnection()

// 測試詞彙生成
testAPI.testVocabulary()
```

## 預期的請求格式

### 生成內容請求

系統會發送以下格式的請求到您的 API：

**URL**: `http://3.86.95.162:8000/models/gemini-2.5-flash:generateContent`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer sk-wingswin
```

**Body**:
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "用戶的提示內容"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 2000,
    "topP": 0.9,
    "topK": 40
  }
}
```

### 模型列表請求

**URL**: `http://3.86.95.162:8000/models`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer sk-wingswin
```

## 預期的響應格式

### 生成內容響應

您的 API 應該返回以下格式：

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "AI 生成的回應內容"
          }
        ]
      }
    }
  ]
}
```

### 模型列表響應

```json
{
  "models": [
    {
      "name": "gemini-2.5-flash",
      "version": "1.0",
      "displayName": "Gemini 2.5 Flash"
    }
  ]
}
```

## 測試步驟

### 1. 測試模型列表

```javascript
// 在瀏覽器控制台中運行
testGemini.testEndpoint("/models")
```

預期輸出：
```
🔍 測試 Gemini 端點: /models
🌐 完整 URL: http://3.86.95.162:8000/models
📊 響應狀態: 200 OK
✅ 端點測試成功
📋 響應數據: { models: [...] }
```

### 2. 測試生成內容

```javascript
// 在瀏覽器控制台中運行
testGemini.testAPI()
```

預期輸出：
```
🔍 開始測試 Gemini API...
📋 檢查 Gemini 配置...
配置狀態: ✅ 已配置
📊 當前 Gemini 配置:
- 提供商: Gemini
- 模型: gemini-2.5-flash
- 端點: http://3.86.95.162:8000
- API Key: sk-wings...
📋 測試模型列表端點...
✅ 模型列表端點正常
🌐 測試生成內容端點...
✅ Gemini API 連接成功！
📚 測試詞彙生成功能...
✅ 詞彙生成成功！
```

## 故障排除

### 1. 連接錯誤

**症狀**: `Network Error` 或 `無法連接到服務器`

**解決方案**:
- 檢查 `http://3.86.95.162:8000` 是否可訪問
- 確認服務器是否正在運行
- 檢查防火牆設置

### 2. 認證錯誤

**症狀**: `401 Unauthorized` 或 `認證失敗`

**解決方案**:
- 檢查 API key `sk-wingswin` 是否正確
- 確認 API key 是否有足夠權限

### 3. 模型錯誤

**症狀**: `404 Not Found` 或 `模型不存在`

**解決方案**:
- 檢查模型名稱 `gemini-2.5-flash` 是否正確
- 使用 `/models` 端點查看可用模型

### 4. 格式錯誤

**症狀**: `400 Bad Request` 或 `請求格式錯誤`

**解決方案**:
- 確認請求體格式是否正確
- 檢查 Content-Type 頭部

## 調試技巧

### 1. 查看詳細請求

在瀏覽器開發者工具的 Network 標籤中查看：
- 請求 URL 是否正確
- 請求頭是否包含正確的認證信息
- 請求體格式是否正確

### 2. 測試單個端點

```javascript
// 測試模型列表
testGemini.testEndpoint("/models")

// 測試特定模型
testGemini.testEndpoint("/models/gemini-2.5-flash")
```

### 3. 檢查響應

```javascript
// 查看完整的響應內容
fetch("http://3.86.95.162:8000/models", {
  headers: {
    'Authorization': 'Bearer sk-wingswin',
    'Content-Type': 'application/json'
  }
}).then(r => r.json()).then(console.log)
```

## 成功標誌

當您看到以下信息時，表示 Gemini API 配置成功：

```
✅ Gemini API 連接成功！
✅ 詞彙生成成功！
```

此時您可以：
1. 正常使用詞彙生成功能
2. 創建每週學習計劃
3. 進行每日學習會話
