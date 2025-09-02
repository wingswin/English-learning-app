import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, BookOpen, Settings, Lightbulb } from "lucide-react";
import { ConceptAIService, ConceptRequest } from "@/utils/conceptAIService";
import { Concept } from "@/types/concepts";
import { ConceptFlashCard } from "./ConceptFlashCard";
import { APILogViewer } from "./APILogViewer";

const CONCEPT_CATEGORIES = [
  "Science",
  "Mathematics",
  "History",
  "Literature",
  "Philosophy",
  "Psychology",
  "Economics",
  "Business",
  "Medicine",
  "Technology",
  "Art",
  "Music",
  "Geography",
  "Politics",
  "Sociology",
  "Biology",
  "Chemistry",
  "Physics",
  "Engineering",
  "Education"
];

const SUBJECT_AREAS = [
  "General",
  "Academic",
  "Professional",
  "Personal Development",
  "Creative Arts",
  "Social Sciences",
  "Natural Sciences",
  "Applied Sciences",
  "Humanities",
  "Interdisciplinary"
];

export const ConceptGenerator = () => {
  const [difficulty, setDifficulty] = useState<string>("Beginner");
  const [category, setCategory] = useState<string>("Science");
  const [subject, setSubject] = useState<string>("General");
  const [count, setCount] = useState<number>(5);
  const [specificTopic, setSpecificTopic] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [error, setError] = useState<string>("");
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [apiLogs, setApiLogs] = useState<Array<{
    timestamp: string;
    type: 'request' | 'response' | 'error' | 'info';
    message: string;
    data?: any;
  }>>([]);

  const aiService = ConceptAIService.getInstance();

  const addLog = (type: 'request' | 'response' | 'error' | 'info', message: string, data?: any) => {
    const log = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      data
    };
    setApiLogs(prev => [...prev, log]);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    
    try {
      const request: ConceptRequest = {
        difficulty: difficulty as any,
        category,
        count,
        specificTopic: specificTopic || undefined,
        subject: subject === "General" ? undefined : subject
      };

      addLog('request', 'Generating concepts', request);
      console.log('🚀 Generating concepts with request:', request);

      const generatedConcepts = await aiService.generateConcepts(request);
      addLog('response', 'Concepts generated successfully', generatedConcepts);
      console.log('📚 Generated concepts from AI service:', generatedConcepts);
      
      // Convert to Concept format with IDs and mastery levels
      const formattedConcepts: Concept[] = generatedConcepts.map((concept, index) => {
        const formatted = {
          ...concept,
          id: `concept-${Date.now()}-${index}`,
          masteryLevel: 0,
          lastReviewed: new Date()
        };
        console.log(`📝 Formatted concept ${index + 1}:`, formatted);
        return formatted;
      });

      console.log('🎯 Final concepts to display:', formattedConcepts);
      setConcepts(formattedConcepts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate concepts";
      addLog('error', errorMessage, err);
      console.error('❌ Error in handleGenerate:', err);
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMasteryUpdate = (conceptId: string, level: number) => {
    setConcepts(prev => 
      prev.map(concept => 
        concept.id === conceptId 
          ? { ...concept, masteryLevel: level }
          : concept
      )
    );
  };

  const handleFavorite = (conceptId: string) => {
    // Implement favorite functionality
    console.log("Favorited concept:", conceptId);
  };

  const getSystemPrompt = () => {
    return aiService.getSystemPrompt(difficulty as any);
  };

  const isFormValid = () => {
    return difficulty && category && count > 0 && count <= 20;
  };

  const clearLogs = () => {
    setApiLogs([]);
  };

  const exportLogs = () => {
    const logData = {
      timestamp: new Date().toISOString(),
      logs: apiLogs
    };
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Concept Learning Generator
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Generate personalized learning concepts based on your skill level and interests. 
          Each concept includes detailed explanations, examples, and key points to remember.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Generate New Concepts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CONCEPT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject Area</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject area" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECT_AREAS.map((subj) => (
                    <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Number of Concepts</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specificTopic">Specific Topic (Optional)</Label>
            <Textarea
              id="specificTopic"
              placeholder="e.g., Quantum Physics, Renaissance Art, Behavioral Economics..."
              value={specificTopic}
              onChange={(e) => setSpecificTopic(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowSystemPrompt(!showSystemPrompt)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {showSystemPrompt ? "Hide" : "Show"} System Prompt
            </Button>

            <Button
              onClick={handleGenerate}
              disabled={!isFormValid() || isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4" />
                  Generate Concepts
                </>
              )}
            </Button>
          </div>

          {showSystemPrompt && (
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="pt-4">
                <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Current System Prompt for {difficulty} Level:
                </Label>
                <div className="bg-white p-3 rounded-md border text-sm text-slate-600 whitespace-pre-wrap">
                  {getSystemPrompt()}
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Logs Viewer */}
      <APILogViewer
        logs={apiLogs}
        onClearLogs={clearLogs}
        onExportLogs={exportLogs}
      />

      {concepts.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Generated Concepts
            </h2>
            <p className="text-slate-600">
              {concepts.length} concepts generated for {category} at {difficulty} level
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {concepts.map((concept) => (
              <ConceptFlashCard
                key={concept.id}
                concept={concept}
                onMasteryUpdate={handleMasteryUpdate}
                onFavorite={handleFavorite}
                isFavorited={false}
              />
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">
                  {concepts.filter(c => c.masteryLevel >= 4).length}
                </div>
                <div className="text-sm text-slate-600">Mastered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">
                  {concepts.filter(c => c.masteryLevel >= 2 && c.masteryLevel < 4).length}
                </div>
                <div className="text-sm text-slate-600">Learning</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">
                  {concepts.filter(c => c.masteryLevel < 2).length}
                </div>
                <div className="text-sm text-slate-600">New</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
//Input the concept form to the AI and generate the concept.