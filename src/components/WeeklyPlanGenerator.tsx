import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Calendar, Target, Sparkles, AlertCircle, CheckCircle, MessageSquare, Settings, Bot } from "lucide-react";
import { generateWeeklyPlan } from "@/utils/vocabularyGenerator";
import { WeeklyPlan } from "@/types/learning";
import { DIFFICULTY_OPTIONS, Difficulty } from "@/utils/aiService";
import { VocabularyNotFound } from "./VocabularyNotFound";

interface WeeklyPlanGeneratorProps {
  onPlanGenerated: (plan: WeeklyPlan) => void;
  isLoading: boolean;
}

type GenerationMode = 'customized' | 'custom-made';

export const WeeklyPlanGenerator = ({ onPlanGenerated, isLoading }: WeeklyPlanGeneratorProps) => {
  const [mode, setMode] = useState<GenerationMode>('customized');
  const [chatInput, setChatInput] = useState("");
  const [occupation, setOccupation] = useState("");
  const [habits, setHabits] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [error, setError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');

  const handleGenerate = async () => {
    if (mode === 'customized' && !chatInput.trim()) return;
    if (mode === 'custom-made' && (!occupation.trim() || !habits.trim())) return;
    
    setError(null);
    setAiStatus('checking');
    
    try {
      // Show AI status
      setAiStatus('available');
      
      let plan: WeeklyPlan;
      //modify the mode of INPUT
      if (mode === 'customized') {
        // Use the chat input for personalized plan generation
        plan = await generateWeeklyPlan(chatInput, 'customized');
      } else {
        // Use the form data for personalized plan generation
        // 創建一個結構化的對象，包含所有必要的字段
        const formData = {
          occupation: occupation,
          habits: habits,
          difficulty: difficulty,
          count: 10, // 每天10個單詞
          theme: 'Professional and Personal Development'
        };
        plan = await generateWeeklyPlan(JSON.stringify(formData), 'custom-made');
      }
      
      onPlanGenerated(plan);
    } catch (err) {
      console.error('Error generating plan:', err);
      
      // 檢查是否是 404 錯誤
      if (err instanceof Error && (err as any).status === 404) {
        setError('404: Vocabulary not found. AI service is currently unavailable. Please try again later.');
        setAiStatus('unavailable');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate plan. Please try again.');
        setAiStatus('unavailable');
      }
    }
  };

  const getStatusMessage = () => {
    switch (aiStatus) {
      case 'checking':
        return 'Checking AI model availability...';
      case 'available':
        return 'AI model ready - generating personalized content';
      case 'unavailable':
        return 'AI model unavailable - no fallback content';
      default:
        return '';
    }
  };

  const getStatusIcon = () => {
    switch (aiStatus) {
      case 'checking':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'unavailable':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const isFormValid = () => {
    if (mode === 'customized') {
      return chatInput.trim().length > 0;
    } else {
      return occupation.trim().length > 0 && habits.trim().length > 0;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium">
          <Sparkles className="h-4 w-4" />
          AI-Powered English Learning
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Your Personalized Weekly Study Plan
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Tell us about your interests, goals, or what you want to learn, and we'll create a 
          structured 7-day vocabulary learning plan with 70 carefully selected words tailored just for you.
        </p>
      </div>

      {/* Mode Selection */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Choose Your Generation Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-4">
            <Button
              variant={mode === 'customized' ? 'default' : 'outline'}
              onClick={() => setMode('customized')}
              className="flex items-center gap-2 px-6 py-3"
            >
              <Bot className="h-5 w-5" />
              Customized Mode
            </Button>
            <Button
              variant={mode === 'custom-made' ? 'default' : 'outline'}
              onClick={() => setMode('custom-made')}
              className="flex items-center gap-2 px-6 py-3"
            >
              <Settings className="h-5 w-5" />
              Custom-Made Mode
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Status Alert */}
      {aiStatus !== 'idle' && (
        <Alert className={`border-l-4 ${
          aiStatus === 'available' ? 'border-green-500 bg-green-50' :
          aiStatus === 'unavailable' ? 'border-yellow-500 bg-yellow-50' :
          'border-blue-500 bg-blue-50'
        }`}>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <AlertDescription className="font-medium">
              {getStatusMessage()}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        error.includes('404') ? (
          <VocabularyNotFound 
            error={error}
            onRetry={handleGenerate}
            onGoHome={() => {
              setError(null);
              setAiStatus('idle');
            }}
          />
        ) : (
          <Alert className="border-red-500 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )
      )}

      {/* Customized Mode - Chat Input */}
      {mode === 'customized' && (
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              Chat with AI - Tell Us About Your Learning Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Describe what you want to learn about, your interests, goals, or context. For example: 'I want to learn business vocabulary for meetings', 'I'm interested in cooking and want to learn food-related words', 'I need vocabulary for traveling abroad', 'I want to improve my academic writing skills'..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="min-h-[120px] resize-none"
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  Be as specific as you'd like - the more details you provide, the more personalized your plan will be!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom-Made Mode - Form Input */}
      {mode === 'custom-made' && (
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              Fill Out Your Profile - Custom-Made Learning Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation / Job</Label>
                <Input
                  id="occupation"
                  placeholder="e.g., Software Engineer, Teacher, Student, Marketing Manager..."
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  What do you do for work or study?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="habits">Interests & Habits</Label>
                <Input
                  id="habits"
                  placeholder="e.g., Reading tech blogs, Cooking, Traveling, Gaming..."
                  value={habits}
                  onChange={(e) => setHabits(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  What are your hobbies and interests?
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose your current English proficiency level
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="pt-6">
          <Button
            onClick={handleGenerate}
            disabled={!isFormValid() || isLoading}
            className="w-full h-14 text-lg bg-gradient-primary hover:shadow-medium transition-spring"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                {aiStatus === 'available' ? 'AI is generating your personalized plan...' : 'Generating your plan...'}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5" />
                Generate My 7-Day Learning Plan
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Features Preview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center p-6 hover:shadow-soft transition-smooth">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">70 Curated Words</h3>
          <p className="text-sm text-muted-foreground">
            10 words per day, carefully selected based on your input with progressive difficulty
          </p>
        </Card>

        <Card className="text-center p-6 hover:shadow-soft transition-smooth">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mb-4">
            <Target className="h-6 w-6 text-secondary" />
          </div>
          <h3 className="font-semibold mb-2">Interactive Learning</h3>
          <p className="text-sm text-muted-foreground">
            Flashcards, exercises, and spaced repetition to maximize retention
          </p>
        </Card>

        <Card className="text-center p-6 hover:shadow-soft transition-smooth">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-semibold mb-2">AI-Powered Content</h3>
          <p className="text-sm text-muted-foreground">
            Vocabulary and examples tailored to your interests using DeepSeek AI
          </p>
        </Card>
      </div>

      {/* Example Prompts */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 text-center">💡 Example Prompts</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium text-primary">Professional Context:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• "I work in marketing and need vocabulary for presentations"</li>
                <li>• "I'm a software developer who wants to improve technical communication"</li>
                <li>• "I need business vocabulary for client meetings"</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-primary">Personal Interests:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• "I love cooking and want to learn food-related vocabulary"</li>
                <li>• "I'm planning a trip to Europe and need travel vocabulary"</li>
                <li>• "I enjoy reading science fiction and want academic words"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};