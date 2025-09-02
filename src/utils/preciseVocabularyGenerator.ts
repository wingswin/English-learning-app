import aiService, { GeneratedVocabularyWord, Input } from './aiService';

/**
 * 精確詞彙生成器 - 確保生成恰好70個詞彙
 * 支持多次API調用累積內容直到達到目標數量
 */

interface GenerationMemory {
  accumulatedWords: GeneratedVocabularyWord[];
  totalWordCount: number;
  targetCount: number;
  generationHistory: string[];
}

export class PreciseVocabularyGenerator {
  private memory: GenerationMemory;
  private maxRetries: number = 5;
  private batchSize: number = 10; // 每次API調用生成的詞彙數量

  constructor(targetCount: number = 70) {
    this.memory = {
      accumulatedWords: [],
      totalWordCount: 0,
      targetCount,
      generationHistory: []
    };
  }

  /**
   * 精確計算詞彙數量（按空格分隔）
   */
  private countWords(text: string): number {
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).length;
  }

  /**
   * 計算詞彙對象中的總詞數
   */
  private countWordsInVocabulary(words: GeneratedVocabularyWord[]): number {
    return words.reduce((total, word) => {
      const wordCount = this.countWords(word.word);
      const definitionCount = this.countWords(word.definition);
      const exampleCount = this.countWords(word.example);
      return total + wordCount + definitionCount + exampleCount;
    }, 0);
  }

  /**
   * 生成單個批次的詞彙
   */
  private async generateBatch(
    request: Input, 
    batchNumber: number,
    remainingCount: number
  ): Promise<GeneratedVocabularyWord[]> {
    try {
      console.log(`🔄 Generating batch ${batchNumber}, remaining words needed: ${remainingCount}`);
      
      // 調整請求以包含記憶信息
      const enhancedRequest = this.enhanceRequestWithMemory(request, batchNumber, remainingCount);
      
      const words = await aiService.generateVocabulary(enhancedRequest);
      
      // 記錄生成歷史
      this.memory.generationHistory.push(`Batch ${batchNumber}: Generated ${words.length} vocabulary items`);
      
      console.log(`✅ Batch ${batchNumber} completed: ${words.length} vocabulary items generated`);
      return words;
      
    } catch (error) {
      console.error(`❌ Batch ${batchNumber} failed:`, error);
      throw error;
    }
  }

  /**
   * 增強請求以包含記憶信息
   */
  private enhanceRequestWithMemory(
    originalRequest: Input, 
    batchNumber: number, 
    remainingCount: number
  ): Input {
    if ('userPrompt' in originalRequest) {
      // Customer mode
      const existingWords = this.memory.accumulatedWords.map(w => w.word).join(', ');
      const memoryContext = existingWords ? 
        `\n\nIMPORTANT: Previously generated words (DO NOT REPEAT): ${existingWords}` : '';
      
      return {
        ...originalRequest,
        userPrompt: `${originalRequest.userPrompt}${memoryContext}\n\nBatch ${batchNumber}: Generate ${Math.min(this.batchSize, remainingCount)} unique vocabulary words. Avoid all previously mentioned words.`,
        count: Math.min(this.batchSize, remainingCount)
      };
    } else {
      // Personal mode
      const existingWords = this.memory.accumulatedWords.map(w => w.word).join(', ');
      const memoryContext = existingWords ? 
        `\n\nIMPORTANT: Previously generated words (DO NOT REPEAT): ${existingWords}` : '';
      
      return {
        ...originalRequest,
        theme: `${originalRequest.theme || 'General'}${memoryContext}\n\nBatch ${batchNumber}: Generate ${Math.min(this.batchSize, remainingCount)} unique words.`,
        count: Math.min(this.batchSize, remainingCount)
      };
    }
  }

  /**
   * 主生成方法 - 確保生成恰好70個詞彙
   */
  async generatePreciseVocabulary(request: Input): Promise<GeneratedVocabularyWord[]> {
    console.log(`🎯 Starting precise vocabulary generation for ${this.memory.targetCount} words`);
    
    let batchNumber = 1;
    let retryCount = 0;
    
    while (this.memory.totalWordCount < this.memory.targetCount && retryCount < this.maxRetries) {
      try {
        const remainingCount = this.memory.targetCount - this.memory.totalWordCount;
        
        if (remainingCount <= 0) {
          console.log('✅ Target word count reached!');
          break;
        }
        
        console.log(`📊 Current progress: ${this.memory.totalWordCount}/${this.memory.targetCount} words`);
        
        // 生成新批次
        const newWords = await this.generateBatch(request, batchNumber, remainingCount);
        
        // 過濾重複詞彙
        const uniqueNewWords = newWords.filter(newWord => 
          !this.memory.accumulatedWords.some(existingWord => 
            existingWord.word.toLowerCase() === newWord.word.toLowerCase()
          )
        );
        
        if (uniqueNewWords.length === 0) {
          console.warn(`⚠️ Batch ${batchNumber}: All words were duplicates, retrying...`);
          retryCount++;
          continue;
        }
        
        // 添加到記憶中
        this.memory.accumulatedWords.push(...uniqueNewWords);
        
        // 重新計算總詞數
        this.memory.totalWordCount = this.countWordsInVocabulary(this.memory.accumulatedWords);
        
        console.log(`📈 After batch ${batchNumber}: ${this.memory.totalWordCount}/${this.memory.targetCount} words`);
        console.log(`📝 New unique words added: ${uniqueNewWords.length}`);
        
        batchNumber++;
        retryCount = 0; // 重置重試計數
        
        // 如果達到目標，停止生成
        if (this.memory.totalWordCount >= this.memory.targetCount) {
          console.log('🎉 Target word count achieved!');
          break;
        }
        
      } catch (error) {
        console.error(`❌ Error in batch ${batchNumber}:`, error);
        retryCount++;
        
        if (retryCount >= this.maxRetries) {
          console.error('❌ Max retries reached, stopping generation');
          break;
        }
        
        // 等待一段時間後重試
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // 如果仍然沒有達到目標，記錄警告
    if (this.memory.totalWordCount < this.memory.targetCount) {
      console.warn(`⚠️ Could not reach target of ${this.memory.targetCount} words. Generated ${this.memory.totalWordCount} words.`);
    }
    
    // 返回結果
    const result = this.memory.accumulatedWords.slice(0, this.memory.targetCount);
    
    console.log(`✅ Final result: ${result.length} vocabulary items, ${this.memory.totalWordCount} total words`);
    console.log(`📋 Generation history:`, this.memory.generationHistory);
    
    return result;
  }

  /**
   * 獲取生成統計信息
   */
  getGenerationStats() {
    return {
      totalWords: this.memory.totalWordCount,
      targetWords: this.memory.targetCount,
      vocabularyItems: this.memory.accumulatedWords.length,
      batchesGenerated: this.memory.generationHistory.length,
      isComplete: this.memory.totalWordCount >= this.memory.targetCount,
      generationHistory: this.memory.generationHistory
    };
  }

  /**
   * 重置生成器狀態
   */
  reset(targetCount: number = 70) {
    this.memory = {
      accumulatedWords: [],
      totalWordCount: 0,
      targetCount,
      generationHistory: []
    };
    console.log(`🔄 Generator reset for ${targetCount} words`);
  }

  /**
   * 導出當前記憶狀態（用於調試）
   */
  exportMemory() {
    return {
      ...this.memory,
      wordList: this.memory.accumulatedWords.map(w => w.word)
    };
  }
}

// 導出單例實例
export const preciseVocabularyGenerator = new PreciseVocabularyGenerator(70);

// 便捷方法
export const generatePreciseVocabulary = async (request: Input, targetCount: number = 70): Promise<GeneratedVocabularyWord[]> => {
  const generator = new PreciseVocabularyGenerator(targetCount);
  return await generator.generatePreciseVocabulary(request);
};
