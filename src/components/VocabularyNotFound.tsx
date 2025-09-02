import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, HelpCircle } from "lucide-react";

interface VocabularyNotFoundProps {
  error?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export const VocabularyNotFound = ({ error, onRetry, onGoHome }: VocabularyNotFoundProps) => {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Error Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Vocabulary Not Found</h2>
        </div>

        {/* Error Message */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              AI Service Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              {error || 'The AI service is currently unavailable or failed to generate vocabulary. Please try again later.'}
            </p>
          </CardContent>
        </Card>

        {/* Possible Causes */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Possible Causes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-yellow-700 text-left space-y-2">
              <li>• AI model is temporarily unavailable</li>
              <li>• Network connection issues</li>
              <li>• API rate limits exceeded</li>
              <li>• Server maintenance in progress</li>
              <li>• Invalid or unsupported request format</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onRetry && (
            <Button 
              onClick={onRetry} 
              className="flex items-center gap-2 px-6 py-3"
              variant="default"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          
          {onGoHome && (
            <Button 
              onClick={onGoHome} 
              className="flex items-center gap-2 px-6 py-3"
              variant="outline"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          )}
        </div>

        {/* Additional Help */}
        <div className="text-sm text-gray-500 space-y-2">
          <p>If the problem persists, please:</p>
          <ul className="space-y-1">
            <li>• Check your internet connection</li>
            <li>• Wait a few minutes and try again</li>
            <li>• Contact support if the issue continues</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
