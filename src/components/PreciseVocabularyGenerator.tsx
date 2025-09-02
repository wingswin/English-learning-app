import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { preciseVocabularyGenerator, PreciseVocabularyGenerator } from '@/utils/preciseVocabularyGenerator';
import { GeneratedVocabularyWord } from '@/utils/aiService';

export default function PreciseVocabularyGeneratorComponent() {
  const [userPrompt, setUserPrompt] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Professional'>('Intermediate');
  const [targetCount, setTargetCount] = useState(70);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedVocabularyWord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [generator, setGenerator] = useState<PreciseVocabularyGenerator | null>(null);

  const handleGenerate = async () => {
    if (!userPrompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult([]);
    setStats(null);

    try {
      // 創建新的生成器實例
      const newGenerator = new PreciseVocabularyGenerator(targetCount);
      setGenerator(newGenerator);

      console.log('🚀 Starting precise vocabulary generation...');
      
      const request = {
        userPrompt: userPrompt,
        difficulty: difficulty,
        count: 10, // 初始批次大小
        context: 'Precise Generation',
        mode: 'customized' as const
      };

      const words = await newGenerator.generatePreciseVocabulary(request);
      
      setResult(words);
      setStats(newGenerator.getGenerationStats());
      
      console.log('✅ Generation completed:', words.length, 'vocabulary items');
      
    } catch (err) {
      console.error('❌ Generation failed:', err);
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setResult([]);
    setStats(null);
    setError(null);
    setGenerator(null);
    if (generator) {
      generator.reset(targetCount);
    }
  };

  const exportResults = () => {
    if (result.length === 0) return;
    
    const exportData = {
      targetCount,
      actualCount: result.length,
      wordCount: stats?.totalWords || 0,
      generationStats: stats,
      vocabulary: result,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `precise-vocabulary-${targetCount}-words-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🎯 Precise Vocabulary Generator</CardTitle>
          <CardDescription>
            Generate exactly {targetCount} words via API calls with memory system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">User Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter your prompt for vocabulary generation..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetCount">Target Word Count</Label>
            <Input
              id="targetCount"
              type="number"
              min="10"
              max="200"
              value={targetCount}
              onChange={(e) => setTargetCount(parseInt(e.target.value) || 70)}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !userPrompt.trim()}
              className="flex-1"
            >
              {isGenerating ? '🔄 Generating...' : '🚀 Generate Precise Vocabulary'}
            </Button>
            <Button onClick={handleReset} variant="outline">
              🔄 Reset
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Generation Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalWords}</div>
                <div className="text-sm text-gray-600">Total Words</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.vocabularyItems}</div>
                <div className="text-sm text-gray-600">Vocabulary Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.batchesGenerated}</div>
                <div className="text-sm text-gray-600">API Batches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((stats.totalWords / stats.targetWords) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Completion</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{stats.totalWords}/{stats.targetWords} words</span>
              </div>
              <Progress value={(stats.totalWords / stats.targetWords) * 100} />
            </div>

            <div className="mt-4">
              <Label className="text-sm font-medium">Generation History:</Label>
              <div className="mt-2 space-y-1">
                {stats.generationHistory.map((entry: string, index: number) => (
                  <Badge key={index} variant="secondary" className="mr-2">
                    {entry}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={exportResults} variant="outline" size="sm">
                📥 Export Results
              </Button>
              <Badge variant={stats.isComplete ? "default" : "secondary"}>
                {stats.isComplete ? "✅ Complete" : "⏳ In Progress"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {result.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📚 Generated Vocabulary</CardTitle>
            <CardDescription>
              {result.length} vocabulary items generated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {result.map((word, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{word.word}</h3>
                    <Badge variant="outline">{word.difficulty}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Definition:</span> {word.definition}
                    </div>
                    <div>
                      <span className="font-medium">Example:</span> {word.example}
                    </div>
                    <div>
                      <span className="font-medium">Pronunciation:</span> {word.pronunciation}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {word.category}
                    </div>
                    <div>
                      <span className="font-medium">Traditional Chinese:</span> {word.traditionalChinese}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
