import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VocabularyCard, VocabularyWord } from "./VocabularyCard";
import { RefreshCw, Download, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VocabularyResultsProps {
  words: VocabularyWord[];
  onGenerateMore: () => void;
  isLoading: boolean;
  occupation: string;
  habits: string;
}

export const VocabularyResults = ({ 
  words, 
  onGenerateMore, 
  isLoading, 
  occupation, 
  habits 
}: VocabularyResultsProps) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const handleFavorite = (word: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(word)) {
      newFavorites.delete(word);
    } else {
      newFavorites.add(word);
    }
    setFavorites(newFavorites);
  };

  const handleExport = () => {
    const text = words
      .map(word => `${word.word}\nDefinition: ${word.definition}\nExample: ${word.example}\n`)
      .join('\n---\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vocabulary-words.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const displayedWords = showFavoritesOnly 
    ? words.filter(word => favorites.has(word.word))
    : words;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-hero border-0 text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Your Personalized Vocabulary
          </CardTitle>
          <div className="text-center space-y-2">
            <p className="text-primary-foreground/90">
              Generated for: <span className="font-semibold">{occupation}</span>
            </p>
            <p className="text-sm text-primary-foreground/80 max-w-2xl mx-auto">
              Based on your habits: {habits.length > 100 ? habits.substring(0, 100) + "..." : habits}
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary text-primary">
            {words.length} words generated
          </Badge>
          {favorites.size > 0 && (
            <Badge variant="outline" className="border-secondary text-secondary">
              {favorites.size} favorited
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {favorites.size > 0 && (
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="transition-smooth"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              {showFavoritesOnly ? "Show All" : "Favorites Only"}
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={handleExport}
            className="transition-smooth hover:bg-accent/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button
            onClick={onGenerateMore}
            disabled={isLoading}
            className="bg-gradient-secondary hover:shadow-medium transition-spring"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin" />
                Generating...
              </div>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate More
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results Grid */}
      {displayedWords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedWords.map((word, index) => (
            <VocabularyCard
              key={`${word.word}-${index}`}
              vocabulary={word}
              isFavorited={favorites.has(word.word)}
              onFavorite={handleFavorite}
              className="animate-in slide-in-from-bottom-4 duration-500"
            />
          ))}
        </div>
      ) : showFavoritesOnly ? (
        <Card className="p-8 text-center">
          <CardContent>
            <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No favorite words yet. Heart some words to see them here!</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};