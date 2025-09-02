import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FlashCard } from "./FlashCard";
import { InteractiveExercise } from "./InteractiveExercise";
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Target, 
  Clock,
  CheckCircle,
  RotateCcw,
  Play,
  Pause
} from "lucide-react";
import { DailySession as DailySessionType, EnhancedVocabularyWord } from "@/types/learning";
import { cn } from "@/lib/utils";

interface DailySessionProps {
  session: DailySessionType;
  onComplete: (completedSession: DailySessionType) => void;
  onBack: () => void;
}

type SessionMode = "overview" | "flashcards" | "exercises" | "summary";

export const DailySession = ({ session, onComplete, onBack }: DailySessionProps) => {
  const [mode, setMode] = useState<SessionMode>("overview");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [masteryLevels, setMasteryLevels] = useState<Record<string, number>>(
    session.words.reduce((acc, word) => ({ ...acc, [word.word]: word.masteryLevel }), {})
  );
  const [exerciseResults, setExerciseResults] = useState<Record<string, boolean>>({});
  const [sessionStartTime] = useState(Date.now());

  const currentWord = session.words[currentWordIndex];
  const currentExercise = session.exercises[currentExerciseIndex];
  const totalItems = mode === "flashcards" ? session.words.length : session.exercises.length;
  const currentItemIndex = mode === "flashcards" ? currentWordIndex : currentExerciseIndex;
  const progress = ((currentItemIndex + 1) / totalItems) * 100;

  const handleMasteryUpdate = (wordId: string, level: number) => {
    setMasteryLevels(prev => ({ ...prev, [wordId]: level }));
  };

  const handleFavorite = (wordId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(wordId)) {
      newFavorites.delete(wordId);
    } else {
      newFavorites.add(wordId);
    }
    setFavorites(newFavorites);
  };

  const handleExerciseComplete = (exerciseId: string, correct: boolean) => {
    setExerciseResults(prev => ({ ...prev, [exerciseId]: correct }));
    
    if (currentExerciseIndex < session.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      setMode("summary");
    }
  };

  const handleCompleteSession = () => {
    const completedSession: DailySessionType = {
      ...session,
      completed: true,
      completedAt: new Date(),
      words: session.words.map(word => ({
        ...word,
        masteryLevel: masteryLevels[word.word] || word.masteryLevel
      }))
    };
    onComplete(completedSession);
  };

  const getDifficultyStats = () => {
    const beginner = session.words.filter(w => w.difficulty === "Beginner").length;
    const intermediate = session.words.filter(w => w.difficulty === "Intermediate").length;
    const advanced = session.words.filter(w => w.difficulty === "Advanced").length;
    return { beginner, intermediate, advanced };
  };

  const getSessionStats = () => {
    const masteredWords = Object.values(masteryLevels).filter(level => level >= 3).length;
    const correctExercises = Object.values(exerciseResults).filter(correct => correct).length;
    const sessionDuration = Math.round((Date.now() - sessionStartTime) / 60000); // minutes
    return { masteredWords, correctExercises, sessionDuration };
  };

  if (mode === "overview") {
    const stats = getDifficultyStats();
    
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plan
          </Button>
        </div>

        <Card className="bg-gradient-hero border-0 text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{session.title}</CardTitle>
            <p className="text-center text-primary-foreground/90">{session.theme}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">{session.words.length}</div>
                <div className="text-primary-foreground/80">New Words</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">{session.exercises.length}</div>
                <div className="text-primary-foreground/80">Exercises</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">15-20</div>
                <div className="text-primary-foreground/80">Minutes</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-center">Today's Vocabulary</h3>
              <div className="flex justify-center gap-3">
                <Badge variant="secondary" className="border-secondary-foreground/20">
                  {stats.beginner} Beginner
                </Badge>
                <Badge variant="secondary" className="border-secondary-foreground/20">
                  {stats.intermediate} Intermediate
                </Badge>
                <Badge variant="secondary" className="border-secondary-foreground/20">
                  {stats.advanced} Advanced
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-medium transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Study Flashcards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Learn {session.words.length} new vocabulary words with interactive flashcards, 
                pronunciation guides, and detailed examples.
              </p>
              <Button 
                onClick={() => setMode("flashcards")} 
                className="w-full flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Flashcards
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-medium transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" />
                Practice Exercises
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Reinforce your learning with {session.exercises.length} interactive exercises 
                including fill-in-the-blank, multiple choice, and matching.
              </p>
              <Button 
                onClick={() => setMode("exercises")} 
                variant="outline"
                className="w-full flex items-center gap-2"
                disabled={Object.keys(masteryLevels).length === 0}
              >
                <Target className="h-4 w-4" />
                Start Exercises
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === "flashcards") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setMode("overview")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-bold">Flashcards</h2>
            <p className="text-muted-foreground">
              {currentWordIndex + 1} of {session.words.length}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentWordIndex(Math.max(0, currentWordIndex - 1))}
              disabled={currentWordIndex === 0}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (currentWordIndex < session.words.length - 1) {
                  setCurrentWordIndex(currentWordIndex + 1);
                } else {
                  setMode("exercises");
                  setCurrentExerciseIndex(0);
                }
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex justify-center">
          <FlashCard
            word={{...currentWord, masteryLevel: masteryLevels[currentWord.word] || currentWord.masteryLevel}}
            onMasteryUpdate={handleMasteryUpdate}
            onFavorite={handleFavorite}
            isFavorited={favorites.has(currentWord.word)}
            className="w-full max-w-md"
          />
        </div>

        {currentWordIndex === session.words.length - 1 && (
          <div className="text-center">
            <Button 
              onClick={() => setMode("exercises")} 
              className="bg-gradient-secondary"
            >
              Continue to Exercises
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (mode === "exercises") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setMode("flashcards")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cards
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-bold">Practice Exercises</h2>
            <p className="text-muted-foreground">
              {currentExerciseIndex + 1} of {session.exercises.length}
            </p>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <InteractiveExercise
          exercise={currentExercise}
          onComplete={handleExerciseComplete}
          relatedWords={session.words.filter(w => 
            currentExercise.relatedWords.includes(w.word)
          )}
        />
      </div>
    );
  }

  if (mode === "summary") {
    const stats = getSessionStats();
    const exerciseScore = Math.round((stats.correctExercises / session.exercises.length) * 100);
    
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <Card className="bg-gradient-secondary border-0 text-secondary-foreground text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
            <p className="text-secondary-foreground/90">
              Great work on completing {session.title}
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-2">{stats.masteredWords}</div>
            <div className="text-muted-foreground">Words Mastered</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-secondary mb-2">{exerciseScore}%</div>
            <div className="text-muted-foreground">Exercise Score</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-accent mb-2">{stats.sessionDuration}</div>
            <div className="text-muted-foreground">Minutes Studied</div>
          </Card>
        </div>

        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => {
              setMode("flashcards");
              setCurrentWordIndex(0);
            }}
            variant="outline"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Review Cards
          </Button>
          <Button onClick={handleCompleteSession} className="bg-gradient-primary">
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Session
          </Button>
        </div>
      </div>
    );
  }

  return null;
};