import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { InteractiveExercise as ExerciseType, EnhancedVocabularyWord } from "@/types/learning";
import { cn } from "@/lib/utils";

interface InteractiveExerciseProps {
  exercise: ExerciseType;
  onComplete: (exerciseId: string, correct: boolean) => void;
  relatedWords?: EnhancedVocabularyWord[];
}

export const InteractiveExercise = ({ exercise, onComplete, relatedWords }: InteractiveExerciseProps) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    let correct = false;
    const answer = exercise.type === "multiple-choice" ? selectedOption : userAnswer.trim();
    
    if (exercise.type === "fill-in-blank") {
      correct = answer.toLowerCase() === exercise.correctAnswer.toLowerCase();
    } else if (exercise.type === "multiple-choice") {
      correct = answer === exercise.correctAnswer;
    } else if (exercise.type === "matching") {
      correct = true; // Simplified for demo
    }

    setIsCorrect(correct);
    setShowResult(true);
    
    setTimeout(() => {
      onComplete(exercise.id, correct);
    }, 2000);
  };

  const canSubmit = () => {
    if (exercise.type === "multiple-choice") return selectedOption !== null;
    if (exercise.type === "fill-in-blank") return userAnswer.trim().length > 0;
    return true;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Exercise
          </CardTitle>
          <Badge variant="outline" className="capitalize">
            {exercise.type.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-lg font-medium">{exercise.question}</div>

        {exercise.type === "fill-in-blank" && (
          <div className="space-y-4">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={showResult}
              className="text-lg"
            />
          </div>
        )}

        {exercise.type === "multiple-choice" && exercise.options && (
          <div className="space-y-3">
            {exercise.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedOption === option ? "default" : "outline"}
                onClick={() => !showResult && setSelectedOption(option)}
                className="w-full text-left justify-start h-auto p-4"
                disabled={showResult}
              >
                <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>
        )}

        {showResult && (
          <div className={cn(
            "p-4 rounded-lg border-l-4",
            isCorrect ? "bg-secondary/10 border-secondary" : "bg-destructive/10 border-destructive"
          )}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-secondary" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span className="font-medium">
                {isCorrect ? "Correct!" : "Not quite right"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{exercise.explanation}</p>
            {!isCorrect && (
              <p className="text-sm font-medium mt-2">
                Correct answer: {exercise.correctAnswer}
              </p>
            )}
          </div>
        )}

        {!showResult && (
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit()}
            className="w-full"
          >
            Submit Answer
          </Button>
        )}
      </CardContent>
    </Card>
  );
};