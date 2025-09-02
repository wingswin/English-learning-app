import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Volume2, 
  RotateCcw, 
  Heart, 
  BookOpen, 
  Globe,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { EnhancedVocabularyWord } from "@/types/learning";
import { cn } from "@/lib/utils";

interface FlashCardProps {
  word: EnhancedVocabularyWord;
  showAnswer?: boolean;
  onMasteryUpdate?: (wordId: string, level: number) => void;
  onFavorite?: (wordId: string) => void;
  isFavorited?: boolean;
  className?: string;
}

export const FlashCard = ({ 
  word, 
  showAnswer = false, 
  onMasteryUpdate, 
  onFavorite,
  isFavorited = false,
  className 
}: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(showAnswer);
  const [showPronunciation, setShowPronunciation] = useState(false);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-secondary text-secondary-foreground";
      case "Intermediate": return "bg-accent text-accent-foreground";
      case "Advanced": return "bg-primary text-primary-foreground";
      case "Professional": return "bg-purple-500 text-white";
      case "From Beginner to Professional": return "bg-gradient-to-r from-secondary to-purple-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getMasteryColor = (level: number) => {
    if (level >= 4) return "text-secondary";
    if (level >= 2) return "text-accent";
    return "text-muted-foreground";
  };

  return (
    <Card className={cn(
      "group relative h-[400px] cursor-pointer bg-gradient-card hover:shadow-medium transition-spring perspective-1000",
      className
    )}>
      <div 
        className={cn(
          "relative w-full h-full transition-transform duration-700 preserve-3d",
          isFlipped && "rotate-y-180"
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of Card */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getDifficultyColor(word.difficulty)}>
                {word.difficulty}
              </Badge>
              <Badge variant="outline" className="border-primary/20 text-primary">
                {word.category}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-foreground group-hover:text-primary transition-smooth">
                {word.word}
              </h2>
              
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPronunciation(!showPronunciation);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-smooth"
                >
                  {showPronunciation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak();
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-smooth hover:bg-primary/10"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>

              {showPronunciation && (
                <p className="text-lg text-muted-foreground font-mono animate-in slide-in-from-top-2 duration-300">
                  {word.pronunciation}
                </p>
              )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-2">
              <p className="text-muted-foreground italic">
                Click to reveal definition & example
              </p>
            </div>

            {/* Mastery Level Indicator */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    i < word.masteryLevel ? "bg-secondary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </CardContent>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <CardContent className="h-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(word.difficulty)}>
                  {word.difficulty}
                </Badge>
                <Badge variant="outline" className="border-primary/20 text-primary">
                  {word.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                {onFavorite && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavorite(word.word);
                    }}
                    className={cn(
                      "transition-spring hover:scale-110",
                      isFavorited ? "text-red-500" : "text-muted-foreground"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak();
                  }}
                  className="hover:bg-primary/10"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{word.word}</h3>
                <p className="text-sm text-muted-foreground font-mono">{word.pronunciation}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    Definition
                  </h4>
                  <p className="text-foreground leading-relaxed">{word.definition}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    繁體中文
                  </h4>
                  <p className="text-foreground leading-relaxed font-medium text-lg">{word.traditionalChinese}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Example Usage
                  </h4>
                  <p className="text-foreground leading-relaxed italic bg-muted/30 p-3 rounded-md border-l-4 border-primary">
                    "{word.example}"
                  </p>
                </div>
              </div>
            </div>

            {/* Mastery Controls */}
            {onMasteryUpdate && (
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-muted-foreground">How well do you know this word?</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMasteryUpdate(word.word, Math.max(0, word.masteryLevel - 1));
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMasteryUpdate(word.word, Math.min(5, word.masteryLevel + 1));
                    }}
                    className="text-secondary hover:text-secondary/80"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

// Add custom CSS for 3D flip effect
const styles = `
  .perspective-1000 {
    perspective: 1000px;
  }
  .preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}