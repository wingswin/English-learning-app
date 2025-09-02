import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, BookOpen, TestTube } from "lucide-react";
import aiService from "@/utils/aiService";
import { Difficulty } from "@/utils/aiService";

export const VocabularyTestGenerator = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>('Professional');
  const [count, setCount] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWords, setGeneratedWords] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [rawResponse, setRawResponse] = useState<string>("");

  const handleGenerate = async () => {
    if (!userPrompt.trim()) return;
    
    setIsGenerating(true);
    setError("");
    setGeneratedWords([]);
    setRawResponse("");
    
    try {
      console.log('🧪 Testing vocabulary generation with new prompt...');
      
      // Test the new prompt format
      const testPrompt = `You are an expert English language teacher creating vocabulary lesson.

Generate ${count} English vocabulary words for a ${difficulty.toLowerCase()} level student. Based on a giving content, generate some relevant vocabulary that is useful for my giving input.

Requirements:
- Each word should be appropriate for request difficulty level
- Provide clear, concise definitions
- Create practical, real-world examples
- Include IPA pronunciation
- Categorize each word appropriately
- Include Traditional Chinese meaning

Format your response as a JSON array with this exact structure:
[
  {
    "word": "example",
    "definition": "clear definition",
    "example": "practical sentence using the word",
    "pronunciation": "/ɪɡˈzæmpəl/",
    "category": "category name",
    "difficulty": "${difficulty}",
    "traditionalChinese": "Chinese meaning"
  }
]

User input: "${userPrompt}"`;

      console.log('📤 Test prompt:', testPrompt);
      
      // Call AI service directly to test
      const words = await aiService.generateVocabulary({
        userPrompt,
        difficulty,
        count,
        context: userPrompt
      });
      
      console.log('📥 Generated words:', words);
      setGeneratedWords(words);
      
      // Also test the raw API response
      const systemPrompt = aiService.getSystemPrompt(difficulty);
      console.log('🔧 System prompt:', systemPrompt);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate vocabulary";
      console.error('❌ Error in test:', err);
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          🧪 Vocabulary Generation Test
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Test the new vocabulary generation prompt format with your custom input.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test New Prompt Format
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="count">Number of Words</Label>
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

          <div className="space-y-2">
            <Label htmlFor="userPrompt">Your Input / Topic</Label>
            <Textarea
              id="userPrompt"
              placeholder="e.g., 'I work in marketing and need vocabulary for presentations', 'I love cooking and want to learn food-related words', 'I need business vocabulary for client meetings'..."
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              rows={3}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Describe what you want to learn about or your specific context.
            </p>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!userPrompt.trim() || isGenerating}
            className="w-full h-12 text-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Testing Generation...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                Test Vocabulary Generation
              </>
            )}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {generatedWords.length > 0 && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Generated Vocabulary ({generatedWords.length} words)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {generatedWords.map((word, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">{word.word}</h3>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {word.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{word.pronunciation}</p>
                    <p className="text-sm">{word.definition}</p>
                    <p className="text-sm italic text-gray-700">{word.example}</p>
                    <p className="text-sm font-medium text-green-700">{word.traditionalChinese}</p>
                    <div className="text-xs text-gray-500">
                      Difficulty: {word.difficulty}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
