import { EnhancedVocabularyWord, WeeklyPlan, DailySession, InteractiveExercise } from "@/types/learning";
import aiService, { GeneratedVocabularyWord } from "./aiService";

/**
 * Convert GeneratedVocabularyWord to EnhancedVocabularyWord
 */
const convertToEnhancedVocabulary = (word: GeneratedVocabularyWord, dayNumber: number): EnhancedVocabularyWord => {
  return {
    ...word,
    dayNumber,
    reviewDates: [],
    masteryLevel: 0
  };
};

/**
 * Generate vocabulary using AI only - no fallback
 */
const generateVocabularyForDay = async (
  chatInput: string, 
  day: number, 
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional' | 'From Beginner to Professional',
  count: number = 10,  // 默認每天 10 個單詞
  theme?: string,
  mode: 'customized' | 'custom-made' = 'customized'
): Promise<GeneratedVocabularyWord[]> => {
  try {
    console.log(`🤖 Attempting AI vocabulary generation for Day ${day}...`);
    
    // 根據模式決定傳遞給 AI 的內容
    let request: any;
    
    if (mode === 'custom-made') {
      // 在 custom-made 模式下，chatInput 實際上是 JSON 格式的 formData
      try {
        const parsedFormData = JSON.parse(chatInput);
        request = {
          occupation: parsedFormData.occupation,
          habits: parsedFormData.habits,
          difficulty: parsedFormData.difficulty,
          count: 10,  // 每天固定 10 個單詞
          theme,
          mode: 'custom-made'  // 明確指定模式
        };
        console.log(` Custom-made mode - Day ${day} request:`, request);
      } catch (parseError) {
        console.error('❌ Failed to parse formData JSON:', parseError);
        throw new Error('Invalid form data format');
      }
    } else {
      // 在 customized 模式下，chatInput 是用戶的自由文本
      request = {
        userPrompt: `${chatInput}\n\nIMPORTANT: Generate unique vocabulary words for Day ${day}. Avoid repeating words from previous days. Focus on ${theme || 'general vocabulary'}.`,
        difficulty,
        count: 10,  // 每天固定 10 個單詞
        context: `${theme} - Day ${day}`,
        mode: 'customized'  // 明確指定模式
      };
      console.log(`📤 Customized mode - Day ${day} request:`, request);
    }
    
    console.log(`📤 Final request to AI service for Day ${day}:`, request);
    
    const aiWords = await aiService.generateVocabulary(request);
    
    if (aiWords && aiWords.length > 0) {
      console.log(`✅ Day ${day} AI generation successful: ${aiWords.length} words`);
      return aiWords;
    } else {
      console.error(`❌ Day ${day} AI returned empty result`);
      throw new Error('AI vocabulary generation failed: No words generated');
    }
  } catch (error) {
    console.error(`❌ Day ${day} AI vocabulary generation failed:`, error);
    
    // 創建 404 錯誤
    const notFoundError = new Error('Vocabulary not found');
    (notFoundError as any).status = 404;
    (notFoundError as any).message = 'AI vocabulary generation failed. Please try again later.';
    
    throw notFoundError;
  }
};

/**
 * Generate exercises using AI only - no fallback
 */
const generateExercisesForDay = async (words: GeneratedVocabularyWord[]): Promise<InteractiveExercise[]> => {
  try {
    // 🔧 暫時跳過練習生成，返回空數組
    console.log('⚠️ Exercise generation temporarily disabled');
    return [];
  } catch (error) {
    console.error('❌ Exercise generation failed:', error);
    
    // 創建 404 錯誤
    const notFoundError = new Error('Exercises not found');
    (notFoundError as any).status = 404;
    (notFoundError as any).message = 'Exercise generation failed. Please try again later.';
    
    throw notFoundError;
  }
};

/**
 * Main function to generate weekly plan using AI only
 */
export const generateWeeklyPlan = async (
  chatInput: string, 
  mode: 'customized' | 'custom-made' = 'customized'
): Promise<WeeklyPlan> => {
  try {
    console.log('🚀 Starting weekly plan generation...');
    console.log(`🎯 Generation mode: ${mode}`);
    
    // Create 7 days of content with 10 words each day
    const days: DailySession[] = [];
    
    const dailyThemes = [
      "Foundation Building",
      "Core Concepts", 
      "Practical Application",
      "Advanced Techniques",
      "Professional Mastery",
      "Expert Integration",
      "Comprehensive Review"
    ];

    // 用於追蹤已使用的單詞，避免重複
    const usedWords = new Set<string>();

    for (let day = 1; day <= 7; day++) {
      console.log(`📅 Generating content for Day ${day}...`);
      
      // Progressive difficulty distribution per day
      let beginnerCount, intermediateCount, advancedCount, professionalCount;
      
      if (mode === 'custom-made') {
        // Custom-Made 模式：根據用戶選擇的難度，所有天數使用相同的分配
        const parsedFormData = JSON.parse(chatInput);
        const userDifficulty = parsedFormData.difficulty;
        
        console.log(`🎯 Custom-Made mode: User selected difficulty: ${userDifficulty}`);
        
        // 根據用戶選擇的難度設置所有天數的分配
        switch (userDifficulty) {
          case 'Beginner':
            beginnerCount = 10; intermediateCount = 0; advancedCount = 0; professionalCount = 0;
            break;
          case 'Intermediate':
            beginnerCount = 0; intermediateCount = 10; advancedCount = 0; professionalCount = 0;
            break;
          case 'Advanced':
            beginnerCount = 0; intermediateCount = 0; advancedCount = 10; professionalCount = 0;
            break;
          case 'Professional':
            beginnerCount = 0; intermediateCount = 0; advancedCount = 0; professionalCount = 10;
            break;
          case 'From Beginner to Professional':
            // 漸進式難度（與 Customer 模式相同）
            if (day <= 2) {
              beginnerCount = 7; intermediateCount = 3; advancedCount = 0; professionalCount = 0;
            } else if (day <= 4) {
              beginnerCount = 2; intermediateCount = 5; advancedCount = 3; professionalCount = 0;
            } else if (day <= 6) {
              beginnerCount = 0; intermediateCount = 3; advancedCount = 5; professionalCount = 2;
            } else {
              beginnerCount = 0; intermediateCount = 0; advancedCount = 3; professionalCount = 7;
            }
            break;
          default:
            // 默認使用 Intermediate
            beginnerCount = 0; intermediateCount = 10; advancedCount = 0; professionalCount = 0;
        }
        
        console.log(`📊 Day ${day} difficulty distribution: Beginner=${beginnerCount}, Intermediate=${intermediateCount}, Advanced=${advancedCount}, Professional=${professionalCount}`);
        
      } else {
        // Customer 模式：使用漸進式難度分配
        if (day <= 2) {
          beginnerCount = 7; intermediateCount = 3; advancedCount = 0; professionalCount = 0;
        } else if (day <= 4) {
          beginnerCount = 2; intermediateCount = 5; advancedCount = 3; professionalCount = 0;
        } else if (day <= 6) {
          beginnerCount = 0; intermediateCount = 3; advancedCount = 5; professionalCount = 2;
        } else {
          beginnerCount = 0; intermediateCount = 0; advancedCount = 3; professionalCount = 7;
        }
        
        console.log(`📊 Day ${day} progressive difficulty: Beginner=${beginnerCount}, Intermediate=${intermediateCount}, Advanced=${advancedCount}, Professional=${professionalCount}`);
      }

      // 🔧 修復：生成不同難度級別的詞彙，添加唯一性檢查
      const beginnerWords = await generateVocabularyForDay(chatInput, day, 'Beginner', beginnerCount, `${dailyThemes[day - 1]} - Day ${day}`, mode);
      const intermediateWords = await generateVocabularyForDay(chatInput, day, 'Intermediate', intermediateCount, `${dailyThemes[day - 1]} - Day ${day}`, mode);
      const advancedWords = await generateVocabularyForDay(chatInput, day, 'Advanced', advancedCount, `${dailyThemes[day - 1]} - Day ${day}`, mode);
      const professionalWords = await generateVocabularyForDay(chatInput, day, 'Professional', professionalCount, `${dailyThemes[day - 1]} - Day ${day}`, mode);  
      
      // Combine all words for the day
      const allWords = [...beginnerWords, ...intermediateWords, ...advancedWords, ...professionalWords];
      
      // 檢查並過濾重複單詞
      const uniqueWords = allWords.filter(word => {
        if (usedWords.has(word.word.toLowerCase())) {
          console.log(`⚠️ Day ${day}: Skipping duplicate word: ${word.word}`);
          return false;
        }
        usedWords.add(word.word.toLowerCase());
        return true;
      });
      
      // 如果過濾後單詞不足，記錄警告
      if (uniqueWords.length < allWords.length) {
        console.warn(`⚠️ Day ${day}: Filtered out ${allWords.length - uniqueWords.length} duplicate words`);
      }
      
      console.log(`✅ Day ${day}: Generated ${uniqueWords.length} unique words`);
      
      const enhancedWords = uniqueWords.map(word => convertToEnhancedVocabulary(word, day));

      // Generate exercises for the day
      const exercises = await generateExercisesForDay(uniqueWords);

      days.push({
        day,
        title: `Day ${day}: ${dailyThemes[day - 1]}`,
        theme: dailyThemes[day - 1],
        words: enhancedWords,
        exercises,
        completed: false
      });
      
      console.log(`✅ Day ${day} completed with ${uniqueWords.length} words and ${exercises.length} exercises`);
    }

    console.log('🎉 Weekly plan generation completed successfully!');
    console.log(`📊 Total unique words generated: ${usedWords.size}`);
    
    return {
      id: `plan-${Date.now()}`,
      theme: `AI-Generated Plan: ${chatInput.substring(0, 50)}${chatInput.length > 50 ? '...' : ''}`,
      occupation: "AI Generated",
      habits: chatInput,
      createdAt: new Date(),
      days,
      totalWords: 70,
      completedDays: 0
    };
    
  } catch (error) {
    console.error('❌ Weekly plan generation failed:', error);
    
    // 重新拋出錯誤，讓上層組件處理
    throw error;
  }
};