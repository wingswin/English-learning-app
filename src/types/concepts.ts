export type ConceptDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';

export const CONCEPT_DIFFICULTY_OPTIONS: ConceptDifficulty[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Professional'
];

export interface Concept {
  id: string;
  title: string;
  definition: string;
  explanation: string;
  examples: string[];
  difficulty: ConceptDifficulty;
  category: string;
  tags: string[];
  relatedConcepts: string[];
  keyPoints: string[];
  commonMisconceptions: string[];
  traditionalChinese: string; // Traditional Chinese meaning
  masteryLevel: number; // 0-5
  lastReviewed?: Date;
}

export interface ConceptCategory {
  name: string;
  description: string;
  concepts: Concept[];
}

export interface ConceptSession {
  id: string;
  difficulty: ConceptDifficulty;
  category: string;
  concepts: Concept[];
  completed: boolean;
  completedAt?: Date;
  score?: number;
}

export interface ConceptProgress {
  totalConcepts: number;
  masteredConcepts: number;
  currentStreak: number;
  lastStudyDate: Date;
  difficultyBreakdown: Record<ConceptDifficulty, number>;
}
//Create data type of concept.