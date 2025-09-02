import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Wifi, WifiOff } from "lucide-react";
import { AIService } from "@/utils/aiService";

export const APIConnectionTest = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [configInfo, setConfigInfo] = useState<any>(null);

  const aiService = AIService.getInstance();

  const testConnection = async () => {
    setIsTesting(true);
    setError(null);
    setIsConnected(null);

    try {
      // 獲取當前配置信息
      const config = (aiService as any).provider;
      setConfigInfo({
        name: config?.name || 'Unknown',
        baseUrl: config?.baseUrl || 'Not configured',
        model: config?.model || 'Not configured',
        apiKey: config?.apiKey ? `${config.apiKey.substring(0, 8)}...` : 'Not configured'
      });

      // 檢查是否已配置
      if (!aiService.isConfigured()) {
        throw new Error('AI 服務未配置。請檢查 API key 和端點設置。');
      }

      // 測試連接
      const success = await aiService.testConnection();
      setIsConnected(success);
      
      if (success) {
        setError(null);
      }
    } catch (err: any) {
      setIsConnected(false);
      setError(err.message || '連接測試失敗');
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusBadge = () => {
    if (isConnected === null) {
      return <Badge variant="secondary">未測試</Badge>;
    }
    return isConnected ? (
      <Badge variant="default" className="bg-green-500">
        <CheckCircle className="w-3 h-3 mr-1" />
        已連接
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />
        連接失敗
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="w-5 h-5" />
          API 連接測試
        </CardTitle>
        <CardDescription>
          測試當前配置的 AI API 是否正常工作
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 當前配置信息 */}
        {configInfo && (
          <div className="space-y-2">
            <h4 className="font-medium">當前配置：</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium">提供商：</span> {configInfo.name}</div>
              <div><span className="font-medium">模型：</span> {configInfo.model}</div>
              <div><span className="font-medium">API Key：</span> {configInfo.apiKey}</div>
              <div><span className="font-medium">端點：</span> 
                <span className="break-all text-xs">{configInfo.baseUrl}</span>
              </div>
            </div>
          </div>
        )}

        {/* 狀態顯示 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">連接狀態：</span>
          {getStatusBadge()}
        </div>

        {/* 錯誤信息 */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 成功信息 */}
        {isConnected && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              API 連接成功！您可以正常使用詞彙生成功能。
            </AlertDescription>
          </Alert>
        )}

        {/* 測試按鈕 */}
        <Button 
          onClick={testConnection} 
          disabled={isTesting}
          className="w-full"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              測試中...
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 mr-2" />
              測試連接
            </>
          )}
        </Button>

        {/* 使用說明 */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 點擊"測試連接"按鈕來檢查 API 是否正常工作</p>
          <p>• 如果連接失敗，請檢查 API key 和端點設置</p>
          <p>• 確保您的網絡連接正常</p>
        </div>
      </CardContent>
    </Card>
  );
};
