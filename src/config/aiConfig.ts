// AI 服務配置
// 在這裡設置您的 API key 和提供商信息

export const AI_CONFIG = {
  // OpenAI 配置
  openai: {
    name: "Gemini",
    baseUrl: "https://api.openai.com/v1/chat/completions",
    apiKey: "your-openai-api-key-here", // 替換為您的 OpenAI API key
    model: "gpt-3.5-turbo" // 或 "gpt-4", "gpt-4-turbo"
  },

  // Anthropic 配置
  anthropic: {
    name: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1/messages",
    apiKey: "your-anthropic-api-key-here", // 替換為您的 Anthropic API key
    model: "claude-3-haiku" // 或 "claude-3-sonnet", "claude-3-opus"
  },

  // DeepSeek 配置
  deepseek: {
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1/chat/completions",
    apiKey: "your-deepseek-api-key-here", // 替換為您的 DeepSeek API key
    model: "deepseek-chat" // 或 "deepseek-coder"
  },

  // Gemini 配置
  gemini: {
    name: "Gemini",
    baseUrl: "http://54.166.50.219:8000",
    apiKey: "sk-wingswin",
    model: "gemini-2.5-flash"
  },

  // 自定義 API 配置 - 您可以在這裡輸入自己的 API 地址
  custom: {
    name: "Custom",
    baseUrl: " http://54.166.50.219:8000", // 替換為您的 API 地址
    apiKey: "sk-wingswin", // 替換為您的 API key
    model: "gemini-2.5-flash" // 替換為您的模型名稱
  }
};

// 選擇要使用的配置
// 將下面的 'openai' 改為您想要使用的提供商
export const ACTIVE_PROVIDER = 'custom';

// 導出當前活動的配置
export const getActiveConfig = () => {
  return AI_CONFIG[ACTIVE_PROVIDER as keyof typeof AI_CONFIG];
};
