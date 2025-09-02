# AI API 配置說明

## 快速設置

1. 打開 `src/config/aiConfig.ts` 文件
2. 在您想要使用的提供商配置中，將 `your-api-key-here` 替換為您的實際 API key
3. 修改 `ACTIVE_PROVIDER` 變量來選擇您想要使用的提供商

## 支持的 AI 提供商

### OpenAI
```typescript
openai: {
  name: "OpenAI",
  baseUrl: "https://api.openai.com/v1/chat/completions",
  apiKey: "sk-your-openai-api-key", // 替換為您的 OpenAI API key
  model: "gpt-3.5-turbo" // 或 "gpt-4", "gpt-4-turbo"
}
```

### Anthropic (Claude)
```typescript
anthropic: {
  name: "Anthropic",
  baseUrl: "https://api.anthropic.com/v1/messages",
  apiKey: "sk-ant-your-anthropic-api-key", // 替換為您的 Anthropic API key
  model: "claude-3-haiku" // 或 "claude-3-sonnet", "claude-3-opus"
}
```

### DeepSeek
```typescript
deepseek: {
  name: "DeepSeek",
  baseUrl: "https://api.deepseek.com/v1/chat/completions",
  apiKey: "your-deepseek-api-key", // 替換為您的 DeepSeek API key
  model: "deepseek-chat" // 或 "deepseek-coder"
}
```

### Gemini (Google)
```typescript
gemini: {
  name: "Gemini",
  baseUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
  apiKey: "your-gemini-api-key", // 替換為您的 Gemini API key
  model: "gemini-1.5-pro" // 或 "gemini-1.5-flash"
}
```

### 自定義 API
```typescript
custom: {
  name: "Custom",
  baseUrl: "https://your-custom-api-endpoint.com/v1/chat/completions",
  apiKey: "your-custom-api-key",
  model: "your-custom-model"
}
```

## 切換提供商

要切換到不同的 AI 提供商，只需修改 `ACTIVE_PROVIDER` 變量：

```typescript
// 使用 OpenAI
export const ACTIVE_PROVIDER = 'openai';

// 使用 Anthropic
export const ACTIVE_PROVIDER = 'anthropic';

// 使用 DeepSeek
export const ACTIVE_PROVIDER = 'deepseek';

// 使用 Gemini
export const ACTIVE_PROVIDER = 'gemini';

// 使用自定義 API
export const ACTIVE_PROVIDER = 'custom';
```

## 獲取 API Key

### OpenAI
1. 訪問 [OpenAI API](https://platform.openai.com/api-keys)
2. 登錄您的帳戶
3. 點擊 "Create new secret key"
4. 複製生成的 API key

### Anthropic
1. 訪問 [Anthropic Console](https://console.anthropic.com/)
2. 登錄您的帳戶
3. 點擊 "Create Key"
4. 複製生成的 API key

### DeepSeek
1. 訪問 [DeepSeek API](https://platform.deepseek.com/)
2. 註冊/登錄帳戶
3. 在控制台中創建 API key
4. 複製生成的 API key

### Gemini (Google)
1. 訪問 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登錄您的 Google 帳戶
3. 點擊 "Create API Key"
4. 複製生成的 API key

## 安全注意事項

⚠️ **重要**: 請確保不要將包含真實 API key 的代碼提交到公共版本控制系統中。

建議的做法：
1. 將 `aiConfig.ts` 添加到 `.gitignore` 文件中
2. 或者使用環境變量來存儲 API key
3. 在生產環境中使用安全的密鑰管理系統

## 測試配置

配置完成後，您可以運行應用程序並嘗試生成詞彙來測試 API 連接是否正常。

如果遇到問題，請檢查：
1. API key 是否正確
2. 網絡連接是否正常
3. API 端點是否可訪問
4. 模型名稱是否正確
