import { useState } from "react";
import { WeeklyPlanGenerator } from "@/components/WeeklyPlanGenerator";
import { WeeklyPlanView } from "@/components/WeeklyPlanView";
import { DailySession } from "@/components/DailySession";
import { APIConnectionTest } from "@/components/APIConnectionTest";

import { WeeklyPlan, DailySession as DailySessionType } from "@/types/learning";

type AppMode = "generator" | "plan-view" | "daily-session";

const Index = () => {
  const [mode, setMode] = useState<AppMode>("generator");
  const [isLoading, setIsLoading] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [currentSession, setCurrentSession] = useState<DailySessionType | null>(null);

  const handlePlanGenerated = async (plan: WeeklyPlan) => {
    setWeeklyPlan(plan);
    setMode("plan-view");
    setIsLoading(false);
  };

  const handleStartDay = (dayNumber: number) => {
    if (!weeklyPlan) return;
    const session = weeklyPlan.days.find(day => day.day === dayNumber);
    if (session) {
      setCurrentSession(session);
      setMode("daily-session");
    }
  };

  const handleSessionComplete = (completedSession: DailySessionType) => {
    if (!weeklyPlan) return;
    
    const updatedPlan = {
      ...weeklyPlan,
      days: weeklyPlan.days.map(day => 
        day.day === completedSession.day ? completedSession : day
      ),
      completedDays: weeklyPlan.days.filter(day => 
        day.day === completedSession.day ? true : day.completed
      ).length
    };
    
    setWeeklyPlan(updatedPlan);
    setCurrentSession(null);
    setMode("plan-view");
  };

  const handleStartOver = () => {
    setMode("generator");
    setWeeklyPlan(null);
    setCurrentSession(null);
    setIsLoading(false);
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setMode("generator")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "generator"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Weekly Plan
            </button>
          </div>
        </div>

        {mode === "generator" && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
            <WeeklyPlanGenerator 
              onPlanGenerated={handlePlanGenerated} 
              isLoading={isLoading} 
            />
            
            {/* 開發模式下的 API 連接測試 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="w-full max-w-2xl">
                <APIConnectionTest />
              </div>
            )}
          </div>
        )}

        {mode === "plan-view" && weeklyPlan && (
          <WeeklyPlanView
            plan={weeklyPlan}
            onStartDay={handleStartDay}
            onReviewMode={() => {}} // TODO: Implement review mode
            onStartOver={handleStartOver}
          />
        )}

        {mode === "daily-session" && currentSession && (
          <DailySession
            session={currentSession}
            onComplete={handleSessionComplete}
            onBack={() => setMode("plan-view")}
          />
        )}
      </div>
    </div>
  );
};

export default Index;