import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  BookOpen, 
  Target, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  RotateCcw,
  Trophy
} from "lucide-react";
import { WeeklyPlan, DailySession } from "@/types/learning";
import { cn } from "@/lib/utils";

interface WeeklyPlanViewProps {
  plan: WeeklyPlan;
  onStartDay: (dayNumber: number) => void;
  onReviewMode: () => void;
  onStartOver: () => void;
}

export const WeeklyPlanView = ({ plan, onStartDay, onReviewMode, onStartOver }: WeeklyPlanViewProps) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  const completedDays = plan.days.filter(day => day.completed).length;
  const progressPercentage = (completedDays / 7) * 100;
  const totalMasteredWords = plan.days.reduce((acc, day) => 
    acc + day.words.filter(word => word.masteryLevel >= 3).length, 0
  );

  const getDifficultyDistribution = (day: DailySession) => {
    const beginner = day.words.filter(w => w.difficulty === "Beginner").length;
    const intermediate = day.words.filter(w => w.difficulty === "Intermediate").length;
    const advanced = day.words.filter(w => w.difficulty === "Advanced").length;
    const professional = day.words.filter(w => w.difficulty === "Professional").length;
    return { beginner, intermediate, advanced, professional };
  };

  const getDayStatus = (day: DailySession) => {
    if (day.completed) return "completed";
    //const prevDay = plan.days[day.day - 2];
    //if (day.day === 1 || !prevDay || prevDay.completed) return "available";
    //return "locked";
    return "available";
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium">
          <Calendar className="h-4 w-4" />
          Weekly Learning Plan
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">
          {plan.theme}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your personalized 7-day vocabulary journey with 70 carefully selected words
        </p>
        {plan.habits && (
          <div className="bg-muted/50 p-4 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Based on your input:</span> {plan.habits}
            </p>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-hero border-0 text-primary-foreground">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">{completedDays}/7</div>
              <div className="text-primary-foreground/80">Days Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{totalMasteredWords}</div>
              <div className="text-primary-foreground/80">Words Mastered</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{plan.totalWords}</div>
              <div className="text-primary-foreground/80">Total Words</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{Math.round(progressPercentage)}%</div>
              <div className="text-primary-foreground/80">Progress</div>
            </div>
          </div>
          <div className="mt-6">
            <Progress value={progressPercentage} className="h-3 bg-primary-foreground/20" />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={onReviewMode}
          variant="outline"
          className="flex items-center gap-2"
          disabled={totalMasteredWords === 0}
        >
          <RotateCcw className="h-4 w-4" />
          Review Learned Words
        </Button>
        <Button
          onClick={onStartOver}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Target className="h-4 w-4" />
          Start New Plan
        </Button>
      </div>

      {/* Daily Sessions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">Your Learning Journey</h2>
        <div className="grid gap-4">
          {plan.days.map((day) => {
            const status = getDayStatus(day);
            const distribution = getDifficultyDistribution(day);
            const isSelected = selectedDay === day.day;

            return (
              <Card 
                key={day.day} 
                className={cn(
                  "transition-all duration-300 cursor-pointer hover:shadow-medium",
                  status === "completed" && "bg-secondary/5 border-secondary/30",
                  status === "locked" && "opacity-60",
                  isSelected && "ring-2 ring-primary/30"
                )}
                onClick={() => setSelectedDay(isSelected ? null : day.day)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full font-bold",
                        status === "completed" ? "bg-secondary text-secondary-foreground" :
                        status === "available" ? "bg-primary text-primary-foreground" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {status === "completed" ? <CheckCircle className="h-5 w-5" /> : day.day}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{day.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{day.theme}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {status === "completed" && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          Completed
                        </Badge>
                      )}
                      {status === "locked" && (
                        <Badge variant="outline" className="opacity-60">
                          Locked
                        </Badge>
                      )}
                      {day.completedAt && (
                        <span className="text-sm text-muted-foreground">
                          {day.completedAt.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isSelected && (
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>{day.words.length} words</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-accent" />
                        <span>15-20 min study</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-secondary" />
                        <span>{day.exercises.length} exercises</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Difficulty Distribution:</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="border-secondary text-secondary">
                          {distribution.beginner} Beginner
                        </Badge>
                        <Badge variant="outline" className="border-accent text-accent">
                          {distribution.intermediate} Intermediate
                        </Badge>
                        <Badge variant="outline" className="border-primary text-primary">
                          {distribution.advanced} Advanced
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartDay(day.day);
                        }}
                        disabled={status === "locked"}
                        className="w-full flex items-center gap-2"
                        variant={status === "completed" ? "outline" : "default"}
                      >
                        {status === "completed" ? "Review Day" : "Start Day"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Completion Message */}
      {completedDays === 7 && (
        <Card className="bg-gradient-secondary border-0 text-secondary-foreground text-center p-8">
          <Trophy className="h-16 w-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
          <p className="text-secondary-foreground/90 mb-4">
            You've completed your entire weekly vocabulary plan! You've mastered {totalMasteredWords} new words.
          </p>
          <Button
            onClick={onStartOver}
            variant="outline"
            className="border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10"
          >
            Start a New Learning Plan
          </Button>
        </Card>
      )}
    </div>
  );
};
//about the weekly plan view design