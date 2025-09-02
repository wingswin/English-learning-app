# 自定義 API 設置說明

## 如何設置自定義 API

### 1. 修改配置文件

打開 `src/config/aiConfig.ts` 文件，找到 `custom` 配置部分：

```typescript
custom: {
  name: "Custom",
  baseUrl: "https://your-custom-api-endpoint.com/v1/chat/completions", // 替換為您的 API 地址
  apiKey: "your-custom-api-key", // 替換為您的 API key
  model: "your-custom-model" // 替換為您的模型名稱
}
```

### 2. 設置您的 API 信息

將上面的配置替換為您的實際 API 信息：

```typescript
custom: {
  name: "Custom",
  baseUrl: "https://api.yourcompany.com/v1/chat/completions", // 您的 API 端點
  apiKey: "sk-your-actual-api-key", // 您的 API key
  model: "your-model-name" // 您的模型名稱
}
```

### 3. 切換到自定義 API

將 `ACTIVE_PROVIDER` 設置為 `'custom'`：

```typescript
export const ACTIVE_PROVIDER = 'custom';
```

## 支持的 API 格式

系統會自動檢測您的 API 格式並相應調整：

### OpenAI 兼容格式
- 端點包含 `openai`、`anthropic`、`deepseek` 等關鍵字
- 使用 `Authorization: Bearer` 頭部
- 響應格式：`choices[0].message.content`

### Google/Gemini 格式
- 端點包含 `googleapis`、`gemini` 等關鍵字
- API key 作為 URL 參數
- 響應格式：`candidates[0].content.parts[0].text`

### 通用格式
- 其他所有格式
- 使用標準的 Bearer token 認證
- 嘗試多種響應格式

## 示例配置

### 示例 1：本地 API
```typescript
custom: {
  name: "Custom",
  baseUrl: "http://localhost:8000/v1/chat/completions",
  apiKey: "your-local-api-key",
  model: "local-model"
}
```

### 示例 2：第三方 API
```typescript
custom: {
  name: "Custom",
  baseUrl: "https://api.thirdparty.com/v1/generate",
  apiKey: "sk-thirdparty-key",
  model: "thirdparty-model"
}
```

### 示例 3：自託管模型
```typescript
custom: {
  name: "Custom",
  baseUrl: "https://your-server.com/api/chat",
  apiKey: "your-server-key",
  model: "llama-3.1"
}
```

## 測試您的配置

1. 設置完成後，運行應用程序
2. 嘗試生成詞彙來測試連接
3. 檢查瀏覽器控制台是否有錯誤信息

## 故障排除

如果遇到問題，請檢查：

1. **API 端點是否正確**：確保 URL 可以訪問
2. **API key 是否有效**：確保 key 有正確的權限
3. **模型名稱是否正確**：確保模型存在且可用
4. **網絡連接**：確保可以訪問您的 API 服務器
5. **CORS 設置**：如果 API 在本地，確保允許跨域請求

## 響應格式要求

您的 API 應該返回以下格式之一：

### 格式 1：OpenAI 風格
```json
{
  "choices": [
    {
      "message": {
        "content": "AI 回應內容"
      }
    }
  ]
}
```

### 格式 2：Google 風格
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "AI 回應內容"
          }
        ]
      }
    }
  ]
}
```

### 格式 3：簡單格式
```json
{
  "response": "AI 回應內容"
}
```

或

```json
{
  "content": "AI 回應內容"
}
```

## 請求格式

系統會發送以下格式的請求：

```json
{
  "model": "your-model-name",
  "messages": [
    {
      "role": "user",
      "content": "用戶輸入的內容"
    }
  ],
  "max_tokens": 2000,
  "temperature": 0.7
}
```

確保您的 API 能夠處理這種格式的請求。
