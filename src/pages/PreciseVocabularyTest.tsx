import React from 'react';
import PreciseVocabularyGeneratorComponent from '@/components/PreciseVocabularyGenerator';

export default function PreciseVocabularyTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Precise Vocabulary Generator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate exactly 70 words via API calls with intelligent memory system. 
            The system will make multiple API calls if needed to reach the target word count.
          </p>
        </div>
        
        <PreciseVocabularyGeneratorComponent />
        
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">🔧 How It Works</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h3 className="font-semibold mb-2">📊 Word Counting Rules:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Words are separated by spaces</li>
                <li>Counts words in vocabulary, definition, and example</li>
                <li>Accurate word counting for precise results</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🔄 Memory System:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Saves content between API calls</li>
                <li>References previous words to avoid duplicates</li>
                <li>Continues until target count is reached</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📝 JSON Output:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Strict JSON format only</li>
                <li>No extra text outside JSON</li>
                <li>Structured vocabulary data</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🎯 Precision Features:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Multiple API calls if needed</li>
                <li>Duplicate word filtering</li>
                <li>Progress tracking and statistics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
