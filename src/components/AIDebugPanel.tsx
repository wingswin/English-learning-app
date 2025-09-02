import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Bug, TestTube, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import aiService from "@/utils/aiService";
import { Difficulty } from "@/utils/aiService";

export const AIDebugPanel = () => {
  const [testType, setTestType] = useState<'connection' | 'vocabulary' | 'raw'>('connection');
  const [difficulty, setDifficulty] = useState<Difficulty>('Professional');
  const [count, setCount] = useState<number>(5);
  const [userPrompt, setUserPrompt] = useState("I work in marketing and need vocabulary for presentations");
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const testConnection = async () => {
    setIsTesting(true);
    setError("");
    setResults(null);
    
    try {
      console.log('🔌 Testing AI service connection...');
      const isConnected = await aiService.testConnection();
      setResults({
        type: 'connection',
        success: isConnected,
        message: isConnected ? 'AI service connection successful!' : 'AI service connection failed'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Connection test failed:', err);
    } finally {
      setIsTesting(false);
    }
  };

  const testVocabularyGeneration = async () => {
    setIsTesting(true);
    setError("");
    setResults(null);
    
    try {
      console.log('🧪 Testing vocabulary generation...');
      console.log('📤 Request:', { userPrompt, difficulty, count });
      
      const words = await aiService.generateVocabulary({
        userPrompt,
        difficulty,
        count,
        context: userPrompt
      });
      
      setResults({
        type: 'vocabulary',
        success: true,
        words,
        count: words.length,
        message: `Successfully generated ${words.length} vocabulary words`
      });
      
      console.log('✅ Vocabulary generation successful:', words);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Vocabulary generation failed:', err);
    } finally {
      setIsTesting(false);
    }
  };

  const testRawAPI = async () => {
    setIsTesting(true);
    setError("");
    setResults(null);
    
    try {
      console.log('🔧 Testing raw API call...');
      
      // 創建一個簡單的測試提示
      const testPrompt = `Generate 3 English vocabulary words for a ${difficulty.toLowerCase()} level student.

Requirements:
- Each word should be appropriate for the difficulty level
- Include IPA pronunciation
- Include Traditional Chinese meaning

Format as JSON array:
[
  {
    "word": "example",
    "definition": "clear definition",
    "example": "practical sentence",
    "pronunciation": "/ɪɡˈzæmpəl/",
    "category": "category name",
    "difficulty": "${difficulty}",
    "traditionalChinese": "Chinese meaning"
  }
]

Context: ${userPrompt}`;

      console.log('📤 Test prompt:', testPrompt);
      
      // 直接調用 makeAPIRequest 方法（如果可能的話）
      const response = await aiService.generateVocabulary({
        userPrompt: testPrompt,
        difficulty,
        count: 3,
        context: 'Test'
      });
      
      setResults({
        type: 'raw',
        success: true,
        response,
        message: 'Raw API test completed'
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Raw API test failed:', err);
    } finally {
      setIsTesting(false);
    }
  };

  const runTest = () => {
    switch (testType) {
      case 'connection':
        return testConnection();
      case 'vocabulary':
        return testVocabularyGeneration();
      case 'raw':
        return testRawAPI();
      default:
        return;
    }
  };

  const getStatusIcon = () => {
    if (isTesting) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (error) return <XCircle className="h-4 w-4 text-red-500" />;
    if (results?.success) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusColor = () => {
    if (isTesting) return 'border-blue-500 bg-blue-50';
    if (error) return 'border-red-500 bg-red-50';
    if (results?.success) return 'border-green-500 bg-green-50';
    return 'border-yellow-500 bg-yellow-50';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          🐛 AI Service Debug Panel
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Diagnose and fix AI service issues with comprehensive testing tools.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            AI Service Diagnostics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testType">Test Type</Label>
              <Select value={testType} onValueChange={(value: any) => setTestType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="connection">Connection Test</SelectItem>
                  <SelectItem value="vocabulary">Vocabulary Generation</SelectItem>
                  <SelectItem value="raw">Raw API Test</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="From Beginner to Professional">From Beginner to Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Word Count</Label>
              <input
                id="count"
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {testType !== 'connection' && (
            <div className="space-y-2">
              <Label htmlFor="userPrompt">Test Prompt</Label>
              <Textarea
                id="userPrompt"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={3}
                className="w-full"
                placeholder="Enter a test prompt for vocabulary generation..."
              />
            </div>
          )}

          <Button
            onClick={runTest}
            disabled={isTesting}
            className="w-full h-12 text-lg"
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Running Test...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                Run {testType === 'connection' ? 'Connection' : testType === 'vocabulary' ? 'Vocabulary' : 'Raw API'} Test
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {(results || error) && (
        <Card className={`max-w-4xl mx-auto border-2 ${getStatusColor()}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h3 className="font-semibold text-red-800 mb-2">❌ Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Troubleshooting Tips</h3>
                  <ul className="text-yellow-700 space-y-1 text-sm">
                    <li>• Check if the AI service is properly configured</li>
                    <li>• Verify API keys and endpoints are correct</li>
                    <li>• Check browser console for detailed error logs</li>
                    <li>• Ensure the AI model is available and responding</li>
                  </ul>
                </div>
              </div>
            )}

            {results && results.success && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Success</h3>
                  <p className="text-green-700">{results.message}</p>
                </div>

                {results.type === 'vocabulary' && results.words && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Generated Words:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {results.words.map((word: any, index: number) => (
                        <Card key={index} className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold">{word.word}</h4>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {word.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{word.pronunciation}</p>
                            <p className="text-sm">{word.definition}</p>
                            <p className="text-sm italic text-gray-700">{word.example}</p>
                            <p className="text-sm font-medium text-green-700">{word.traditionalChinese}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {results.type === 'raw' && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Raw Response:</h3>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      {JSON.stringify(results.response, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Console Logs */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Console Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm">
            <p>Open browser console (F12) to see detailed logs</p>
            <p>Look for emojis: 🔍 📤 📥 ✅ ❌ ⚠️</p>
            <p>These logs will help diagnose AI service issues</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
