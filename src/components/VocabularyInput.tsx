import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit, Briefcase, Heart } from "lucide-react";

interface VocabularyInputProps {
  onGenerate: (occupation: string, habits: string) => void;
  isLoading: boolean;
}

export const VocabularyInput = ({ onGenerate, isLoading }: VocabularyInputProps) => {
  const [occupation, setOccupation] = useState("");
  const [habits, setHabits] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (occupation.trim() && habits.trim()) {
      onGenerate(occupation, habits);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-card border-0 shadow-soft">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto p-3 bg-gradient-primary rounded-full w-fit">
          <BrainCircuit className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Vocabulary Generator
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Tell us about your work and habits, and we'll generate 5 relevant vocabulary words to expand your English skills
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="occupation" className="text-sm font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Your Occupation / Job Title
            </Label>
            <Input
              id="occupation"
              placeholder="e.g., Software Developer, Teacher, Marketing Manager"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="border-2 focus:ring-2 focus:ring-primary/20 transition-smooth"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="habits" className="text-sm font-semibold flex items-center gap-2">
              <Heart className="h-4 w-4 text-secondary" />
              Daily Habits & Interests
            </Label>
            <Textarea
              id="habits"
              placeholder="Describe your daily activities, hobbies, and interests. For example: I enjoy reading technical blogs, cooking Mediterranean food, practicing yoga, and playing chess on weekends."
              value={habits}
              onChange={(e) => setHabits(e.target.value)}
              className="min-h-[120px] border-2 focus:ring-2 focus:ring-primary/20 transition-smooth resize-none"
              required
            />
          </div>

          <Button 
            type="submit" 
            size="lg" 
            disabled={isLoading || !occupation.trim() || !habits.trim()}
            className="w-full bg-gradient-primary hover:shadow-medium transition-spring disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Generating Words...
              </div>
            ) : (
              "Generate My Vocabulary Words"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};