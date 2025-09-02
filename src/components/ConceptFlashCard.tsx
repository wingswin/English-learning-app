import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  BookOpen, 
  CheckCircle,
  XCircle,
  Lightbulb,
  AlertTriangle,
  Star,
  Info,
  Globe
} from "lucide-react";
import { Concept } from "@/types/concepts";
import { cn } from "@/lib/utils";

interface ConceptFlashCardProps {
  concept: Concept;
  showAnswer?: boolean;
  onMasteryUpdate?: (conceptId: string, level: number) => void;
  onFavorite?: (conceptId: string) => void;
  isFavorited?: boolean;
  className?: string;
}

export const ConceptFlashCard = ({ 
  concept, 
  showAnswer = false, 
  onMasteryUpdate, 
  onFavorite,
  isFavorited = false,
  className 
}: ConceptFlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(showAnswer);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500 text-white";
      case "Intermediate": return "bg-blue-500 text-white";
      case "Advanced": return "bg-orange-500 text-white";
      case "Professional": return "bg-purple-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className={cn(
      "group relative h-[500px] cursor-pointer bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-lg transition-all duration-300 perspective-1000 border-2 border-slate-200",
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
              <Badge className={getDifficultyColor(concept.difficulty)}>
                {concept.difficulty}
              </Badge>
              <Badge variant="outline" className="border-blue-500/20 text-blue-600">
                {concept.category}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {concept.title}
              </h2>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-3">
              <p className="text-slate-600 italic text-sm">
                Click to reveal detailed explanation
              </p>
              
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-1">Definition</p>
                <p className="text-base font-medium text-slate-700 leading-relaxed">
                  {concept.definition}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 justify-center">
              {concept.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Mastery Level Indicator */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    i < concept.masteryLevel ? "bg-green-500" : "bg-slate-300"
                  )}
                />
              ))}
            </div>
          </CardContent>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <CardContent className="h-full p-6 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(concept.difficulty)}>
                  {concept.difficulty}
                </Badge>
                <Badge variant="outline" className="border-blue-500/20 text-blue-600">
                  {concept.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                {onFavorite && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavorite(concept.id);
                    }}
                    className={cn(
                      "transition-all duration-200 hover:scale-110",
                      isFavorited ? "text-red-500" : "text-slate-400"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{concept.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{concept.definition}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Detailed Explanation
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-sm">{concept.explanation}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    繁體中文
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-sm font-medium text-lg">{concept.traditionalChinese}</p>
                </div>

                {concept.examples.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Examples
                    </h4>
                    <ul className="space-y-2">
                      {concept.examples.map((example, index) => (
                        <li key={index} className="text-slate-700 text-sm flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Key Points
                  </h4>
                  <ul className="space-y-1">
                    {concept.keyPoints.map((point, index) => (
                      <li key={index} className="text-slate-700 text-sm flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Common Misconceptions
                  </h4>
                  <ul className="space-y-1">
                    {concept.commonMisconceptions.map((misconception, index) => (
                      <li key={index} className="text-slate-700 text-sm flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        {misconception}
                      </li>
                    ))}
                  </ul>
                </div>

                {concept.relatedConcepts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
                      Related Concepts
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {concept.relatedConcepts.map((related, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {related}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mastery Controls */}
            {onMasteryUpdate && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-sm text-slate-600">How well do you know this concept?</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMasteryUpdate(concept.id, Math.max(0, concept.masteryLevel - 1));
                    }}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMasteryUpdate(concept.id, Math.min(5, concept.masteryLevel + 1));
                    }}
                    className="text-green-500 hover:text-green-600 hover:bg-green-50"
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
