export interface EnhancedVocabularyWord {
  word: string;
  definition: string;
  example: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Professional" | "From Beginner to Professional";
  category: string;
  pronunciation: string; // IPA or phonetic spelling
  traditionalChinese: string; // Traditional Chinese meaning
  dayNumber: number; // Which day of the week this word belongs to
  reviewDates: Date[]; // For spaced repetition
  masteryLevel: number; // 0-5, how well the user knows this word
}

export interface DailySession {
  day: number;
  title: string;
  theme: string;
  words: EnhancedVocabularyWord[];
  exercises: InteractiveExercise[];
  completed: boolean;
  completedAt?: Date;
}

export interface WeeklyPlan {
  id: string;
  theme: string;
  occupation: string;
  habits: string;
  createdAt: Date;
  days: DailySession[];
  totalWords: number;
  completedDays: number;
}

export interface InteractiveExercise {
  id: string;
  type: "fill-in-blank" | "matching" | "multiple-choice" | "pronunciation";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  relatedWords: string[];
}

export interface ReviewSession {
  words: EnhancedVocabularyWord[];
  dueDate: Date;
  sessionType: "daily-review" | "weekly-review" | "spaced-repetition";
}

export interface LearningProgress {
  weeklyPlanId: string;
  completedDays: number;
  masteredWords: number;
  reviewWords: number;
  streakDays: number;
  lastStudyDate: Date;
}