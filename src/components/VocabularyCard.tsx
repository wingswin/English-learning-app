import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Volume2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VocabularyWord {
  word: string;
  definition: string;
  example: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
}

interface VocabularyCardProps {
  vocabulary: VocabularyWord;
  isFavorited: boolean;
  onFavorite: (word: string) => void;
  className?: string;
}

export const VocabularyCard = ({ vocabulary, isFavorited, onFavorite, className }: VocabularyCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(vocabulary.word);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-secondary text-secondary-foreground";
      case "Medium": return "bg-accent text-accent-foreground";
      case "Hard": return "bg-primary text-primary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className={cn(
      "group cursor-pointer bg-gradient-card border-2 hover:border-primary/30 hover:shadow-medium transition-spring",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-smooth">
                {vocabulary.word}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSpeak}
                className="opacity-0 group-hover:opacity-100 transition-smooth hover:bg-primary/10"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Badge className={getDifficultyColor(vocabulary.difficulty)}>
                {vocabulary.difficulty}
              </Badge>
              <Badge variant="outline" className="border-primary/20 text-primary">
                {vocabulary.category}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFavorite(vocabulary.word)}
            className={cn(
              "transition-spring hover:scale-110",
              isFavorited ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Definition
            </h4>
            <p className="text-foreground leading-relaxed">
              {vocabulary.definition}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Example Usage
            </h4>
            <p className="text-foreground leading-relaxed italic bg-muted/30 p-3 rounded-md border-l-4 border-primary">
              "{vocabulary.example}"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};