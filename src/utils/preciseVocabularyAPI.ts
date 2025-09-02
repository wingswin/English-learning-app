import { preciseVocabularyGenerator, PreciseVocabularyGenerator } from './preciseVocabularyGenerator';
import { GeneratedVocabularyWord } from './aiService';

/**
 * API 接口 - 精確詞彙生成
 * 提供 RESTful 風格的 API 調用接口
 */

export interface PreciseVocabularyRequest {
  prompt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  targetCount?: number;
  mode?: 'customized' | 'custom-made';
  occupation?: string;
  habits?: string;
  theme?: string;
}

export interface PreciseVocabularyResponse {
  success: boolean;
  data?: {
    vocabulary: GeneratedVocabularyWord[];
    stats: {
      totalWords: number;
      targetWords: number;
      vocabularyItems: number;
      batchesGenerated: number;
      isComplete: boolean;
      generationHistory: string[];
    };
    metadata: {
      timestamp: string;
      requestId: string;
      processingTime: number;
    };
  };
  error?: string;
}

/**
 * 精確詞彙生成 API
 */
export class PreciseVocabularyAPI {
  private static generators: Map<string, PreciseVocabularyGenerator> = new Map();

  /**
   * 生成精確數量的詞彙
   */
  static async generateVocabulary(request: PreciseVocabularyRequest): Promise<PreciseVocabularyResponse> {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      console.log(`🚀 API Request ${requestId}:`, request);
      
      // 創建或獲取生成器實例
      const generator = new PreciseVocabularyGenerator(request.targetCount || 70);
      this.generators.set(requestId, generator);
      
      // 構建請求對象
      const aiRequest = this.buildAIRequest(request);
      
      // 生成詞彙
      const vocabulary = await generator.generatePreciseVocabulary(aiRequest);
      const stats = generator.getGenerationStats();
      
      const processingTime = Date.now() - startTime;
      
      console.log(`✅ API Request ${requestId} completed in ${processingTime}ms`);
      
      return {
        success: true,
        data: {
          vocabulary,
          stats,
          metadata: {
            timestamp: new Date().toISOString(),
            requestId,
            processingTime
          }
        }
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`❌ API Request ${requestId} failed:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: {
          vocabulary: [],
          stats: {
            totalWords: 0,
            targetWords: request.targetCount || 70,
            vocabularyItems: 0,
            batchesGenerated: 0,
            isComplete: false,
            generationHistory: []
          },
          metadata: {
            timestamp: new Date().toISOString(),
            requestId,
            processingTime
          }
        }
      };
    } finally {
      // 清理生成器實例
      this.generators.delete(requestId);
    }
  }

  /**
   * 構建 AI 服務請求對象
   */
  private static buildAIRequest(request: PreciseVocabularyRequest) {
    if (request.mode === 'custom-made' && request.occupation && request.habits) {
      return {
        occupation: request.occupation,
        habits: request.habits,
        difficulty: request.difficulty,
        count: 10,
        theme: request.theme || 'Professional Development',
        mode: 'custom-made' as const
      };
    } else {
      return {
        userPrompt: request.prompt,
        difficulty: request.difficulty,
        count: 10,
        context: request.theme || 'General Vocabulary',
        mode: 'customized' as const
      };
    }
  }

  /**
   * 獲取生成器狀態
   */
  static getGeneratorStatus(requestId: string) {
    const generator = this.generators.get(requestId);
    if (!generator) {
      return null;
    }
    
    return generator.getGenerationStats();
  }

  /**
   * 清理所有生成器實例
   */
  static cleanup() {
    this.generators.clear();
    console.log('🧹 All generator instances cleaned up');
  }

  /**
   * 批量生成詞彙
   */
  static async batchGenerate(requests: PreciseVocabularyRequest[]): Promise<PreciseVocabularyResponse[]> {
    console.log(`🔄 Starting batch generation for ${requests.length} requests`);
    
    const results = await Promise.allSettled(
      requests.map(request => this.generateVocabulary(request))
    );
    
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          error: result.reason?.message || 'Batch generation failed',
          data: {
            vocabulary: [],
            stats: {
              totalWords: 0,
              targetWords: requests[index].targetCount || 70,
              vocabularyItems: 0,
              batchesGenerated: 0,
              isComplete: false,
              generationHistory: []
            },
            metadata: {
              timestamp: new Date().toISOString(),
              requestId: `batch_${index}`,
              processingTime: 0
            }
          }
        };
      }
    });
  }
}

// 導出便捷方法
export const generatePreciseVocabularyAPI = PreciseVocabularyAPI.generateVocabulary;
export const batchGenerateVocabulary = PreciseVocabularyAPI.batchGenerate;

// 示例使用
export const exampleUsage = {
  // 基本使用
  basic: async () => {
    const response = await PreciseVocabularyAPI.generateVocabulary({
      prompt: "Generate vocabulary for cooking and food preparation",
      difficulty: "Intermediate",
      targetCount: 70
    });
    
    console.log('Basic generation result:', response);
    return response;
  },

  // 自定義模式
  customMade: async () => {
    const response = await PreciseVocabularyAPI.generateVocabulary({
      prompt: "Professional vocabulary",
      difficulty: "Advanced",
      targetCount: 50,
      mode: "custom-made",
      occupation: "Software Engineer",
      habits: "Reading technical documentation, coding",
      theme: "Technology and Programming"
    });
    
    console.log('Custom-made generation result:', response);
    return response;
  },

  // 批量生成
  batch: async () => {
    const requests = [
      {
        prompt: "Business vocabulary",
        difficulty: "Professional" as const,
        targetCount: 30
      },
      {
        prompt: "Academic vocabulary",
        difficulty: "Advanced" as const,
        targetCount: 40
      }
    ];
    
    const responses = await PreciseVocabularyAPI.batchGenerate(requests);
    console.log('Batch generation results:', responses);
    return responses;
  }
};
