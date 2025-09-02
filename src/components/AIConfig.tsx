import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Settings, Eye, EyeOff } from "lucide-react";
import { AIService, AIProvider } from "@/utils/aiService";

const AI_PROVIDERS = [
  {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1/chat/completions",
    models: ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"]
  },
  {
    name: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1/messages",
    models: ["claude-3-haiku", "claude-3-sonnet", "claude-3-opus"]
  },
  {
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1/chat/completions",
    models: ["deepseek-chat", "deepseek-coder"]
  },
  {
    name: "Custom",
    baseUrl: "",
    models: ["custom-model"]
  }
];

export const AIConfig = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedProvider, setSelectedProvider] = useState("OpenAI");
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");
  const [apiKey, setApiKey] = useState("");
  const [customBaseUrl, setCustomBaseUrl] = useState("");

  const aiService = AIService.getInstance();

  const currentProvider = AI_PROVIDERS.find(p => p.name === selectedProvider);

  useEffect(() => {
    // 檢查是否已經配置
    if (aiService.isConfigured()) {
      setIsConnected(true);
    }
  }, []);

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setError("請輸入 API 金鑰");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider: AIProvider = {
        name: selectedProvider,
        baseUrl: selectedProvider === "Custom" ? customBaseUrl : currentProvider!.baseUrl,
        apiKey: apiKey.trim(),
        model: selectedModel
      };

      aiService.setProvider(provider);
      const isConnected = await aiService.testConnection();
      setIsConnected(isConnected);
      
      if (isConnected) {
        // 保存配置到 localStorage
        localStorage.setItem('aiConfig', JSON.stringify(provider));
      }
    } catch (err) {
      setError("連接測試失敗。請檢查 API 金鑰和網絡連接。");
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = () => {
    if (!apiKey.trim()) {
      setError("請輸入 API 金鑰");
      return;
    }

    const provider: AIProvider = {
      name: selectedProvider,
      baseUrl: selectedProvider === "Custom" ? customBaseUrl : currentProvider!.baseUrl,
      apiKey: apiKey.trim(),
      model: selectedModel
    };

    aiService.setProvider(provider);
    localStorage.setItem('aiConfig', JSON.stringify(provider));
    setIsConnected(true);
    setError(null);
  };

  const loadSavedConfig = () => {
    const saved = localStorage.getItem('aiConfig');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        setSelectedProvider(config.name);
        setSelectedModel(config.model);
        setApiKey(config.apiKey);
        if (config.name === "Custom") {
          setCustomBaseUrl(config.baseUrl);
        }
        aiService.setProvider(config);
        setIsConnected(true);
      } catch (err) {
        console.error('Failed to load saved config:', err);
      }
    }
  };

  useEffect(() => {
    loadSavedConfig();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          AI 服務配置
          {isConnected ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </CardTitle>
        <CardDescription>
          配置 AI 服務提供商和 API 金鑰以生成詞彙和練習
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="provider">AI 提供商</Label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger>
                <SelectValue placeholder="選擇 AI 提供商" />
              </SelectTrigger>
              <SelectContent>
                {AI_PROVIDERS.map(provider => (
                  <SelectItem key={provider.name} value={provider.name}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">模型</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="選擇模型" />
              </SelectTrigger>
              <SelectContent>
                {currentProvider?.models.map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedProvider === "Custom" && (
          <div className="space-y-2">
            <Label htmlFor="baseUrl">自定義 API 端點</Label>
            <Input
              id="baseUrl"
              type="url"
              placeholder="https://api.example.com/v1/chat/completions"
              value={customBaseUrl}
              onChange={(e) => setCustomBaseUrl(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="apiKey">API 金鑰</Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showApiKey ? "text" : "password"}
              placeholder="輸入您的 API 金鑰"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">連接狀態</p>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "已連接" : "未連接"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {selectedProvider} - {selectedModel}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={isLoading || !apiKey.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "測試連接"
              )}
            </Button>
            
            <Button
              onClick={handleSaveConfig}
              disabled={!apiKey.trim()}
            >
              保存配置
            </Button>
          </div>
        </div>

        {isConnected && (
          <div className="rounded-lg bg-green-50 p-3 border border-green-200">
            <p className="text-sm text-green-800">
              ✓ AI 服務已配置完成，可以開始生成詞彙和練習！
            </p>
          </div>
        )}

        {!isConnected && !isLoading && (
          <div className="rounded-lg bg-yellow-50 p-3 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ 請配置 AI 服務以使用詞彙生成功能。
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
