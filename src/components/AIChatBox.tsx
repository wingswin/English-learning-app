import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Send, 
  Loader2, 
  MessageSquare, 
  Sparkles,
  Volume2,
  Heart,
  Copy,
  Check
} from "lucide-react";
import { EnhancedVocabularyWord } from "@/types/learning";

interface AIChatBoxProps {
  className?: string;
}

export const AIChatBox = ({ className }: AIChatBoxProps) => {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWord, setGeneratedWord] = useState<EnhancedVocabularyWord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedWord(null);
    
    try {
      const words = await aiService.generateVocabulary({
        occupation: "General",
        habits: input,
        difficulty: "Intermediate",
        count: 1,
        theme: "User Request"
      });
      
      if (words && words.length > 0) {
        setGeneratedWord(words[0]);
      } else {
        setError("No vocabulary word was generated. Please try again.");
      }
    } catch (err) {
      console.error('Error generating vocabulary:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate vocabulary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSpeak = () => {
    if (generatedWord && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(generatedWord.word);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleFavorite = () => {
    if (!generatedWord) return;
    
    const newFavorites = new Set(favorites);
    if (newFavorites.has(generatedWord.word)) {
      newFavorites.delete(generatedWord.word);
    } else {
      newFavorites.add(generatedWord.word);
    }
    setFavorites(newFavorites);
  };

  const handleCopy = async () => {
    if (!generatedWord) return;
    
    const text = `${generatedWord.word}\nDefinition: ${generatedWord.definition}\nExample: ${generatedWord.example}\nPronunciation: ${generatedWord.pronunciation}\nCategory: ${generatedWord.category}`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          AI Vocabulary Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-2">
          <Textarea
            placeholder="Describe what you want to learn about, your interests, or ask for specific vocabulary..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isGenerating}
          />
          <Button
            onClick={handleGenerate}
            disabled={!input.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Vocabulary
              </>
            )}
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-500 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Generated Word Display */}
        {generatedWord && (
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Word Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-foreground">
                        {generatedWord.word}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSpeak}
                        className="hover:bg-primary/10"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(generatedWord.difficulty)}>
                        {generatedWord.difficulty}
                      </Badge>
                      <Badge variant="outline" className="border-primary/20 text-primary">
                        {generatedWord.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFavorite}
                      className={`transition-spring hover:scale-110 ${
                        favorites.has(generatedWord.word) 
                          ? "text-red-500" 
                          : "text-muted-foreground"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${
                        favorites.has(generatedWord.word) && "fill-current"
                      }`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="transition-spring hover:scale-110"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Pronunciation */}
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Pronunciation:</span> {generatedWord.pronunciation}
                </div>

                {/* Definition */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Definition</h4>
                  <p className="text-foreground/90">{generatedWord.definition}</p>
                </div>

                {/* Example */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Example</h4>
                  <p className="text-foreground/90 italic">"{generatedWord.example}"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Tips:</p>
          <ul className="space-y-1 text-xs">
            <li>• Ask for vocabulary related to specific topics or interests</li>
            <li>• Request words for different difficulty levels</li>
            <li>• Describe your learning goals or context</li>
            <li>• Favorite words to save them for later review</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
