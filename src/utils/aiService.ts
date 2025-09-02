import { getActiveConfig } from "@/config/aiConfig";

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional' | 'From Beginner to Professional';

export const DIFFICULTY_OPTIONS: Difficulty[] = [
  'Beginner',
  'Intermediate', 
  'Advanced',
  'Professional',
  'From Beginner to Professional'
];

export interface CustomerInputMode {
  userPrompt: string;
  difficulty: Difficulty;
  count: number;
  context?: string;
}

export interface PersonalCustomMode {
  occupation: string;
  habits: string;
  difficulty: Difficulty;
  count: number;
  theme?: string;
}

export type Input = CustomerInputMode | PersonalCustomMode;

export type GenerationMode = 'customer' | 'personal';

export interface GeneratedVocabularyWord {
  word: string;
  definition: string;
  example: string;
  pronunciation: string;
  category: string;
  difficulty: Difficulty;
  traditionalChinese: string;
}

export interface AIProvider {
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  endpoint?: string;
}

/*done*/
export class AIService {
  private static instance: AIService;
  private provider: AIProvider | null = null;
  private systemPrompt: string = 
      "You are an expert English language teacher specializing in vocabulary lessons. Your role is to generate relevant and useful English vocabulary words or phrases based on the user's input. Always prioritize words that are directly connected to the user's specified theme, topic, or context—such as synonyms, antonyms, related concepts, collocations, or domain-specific terms—to make them practical and applicable";
  private currentMode: GenerationMode = 'personal';

  private constructor() {
    this.initializeDefaultConfig();
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Add method to set system prompt
  public setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
  }

  // Add method to get current system prompt
  public getSystemPrompt(): string {
    return this.systemPrompt;
  }

  // Add method to set mode
  public setMode(mode: GenerationMode): void {
    this.currentMode = mode;
  }

  // Add method to get current mode
  public getCurrentMode(): GenerationMode {
    return this.currentMode;
  }

  // Convenience method to check if current mode is customer input
  public isCustomerMode(): boolean {
    return this.currentMode === 'customer';
  }

  // Convenience method to check if current mode is personal custom
  public isPersonalMode(): boolean {
    return this.currentMode === 'personal';
  }

  private initializeDefaultConfig(): void {
    try {
      const config = getActiveConfig();
      this.setProvider(config);
    } catch (error) {
      console.warn('Failed to load AI config, using fallback configuration');
      const fallbackConfig: AIProvider = {
        name: "Gemini",
        baseUrl: "http://54.166.50.219:8000",
        apiKey: "sk-wingswin",
        model: "gemini-2.5-flash",
      };
      this.setProvider(fallbackConfig);
    }
  }
/* done */
  setProvider(provider: AIProvider): void {
    this.provider = provider;
  }

  isConfigured(): boolean {
    return this.provider !== null && 
           this.provider.apiKey !== '' && 
           this.provider.baseUrl !== '';
  }

  async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      throw new Error('AI 服務未配置。請在 aiService.ts 中設置 API 金鑰。');
    }

    try {
      console.log('🧪 ===== TESTING API CONNECTION =====');
      console.log('🔧 Current provider:', this.provider);
      console.log('🔑 API Key set:', !!this.provider?.apiKey);
      console.log('🌐 Base URL:', this.provider?.baseUrl);
      console.log('🤖 Model:', this.provider?.model);
      
      const response = await this.makeAPIRequest({
        messages: [{ role: 'user', content: 'Hello, please respond with "Connection successful"' }],
        max_output_tokens: 8000
      });
      
      console.log('✅ API connection test successful');
      console.log('📝 Response:', response);
      console.log('=====================================');
      return true;
    } catch (error) {
      console.error('❌ ===== API CONNECTION TEST FAILED =====');
      console.error('Error details:', error);
      console.error('=====================================');
      return false;
    }
  }

  // 🔧 添加簡單的連接測試方法
  async simpleTest(): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('AI 服務未配置');
    }

    try {
      console.log('🧪 ===== SIMPLE API TEST =====');
      
      const endpoint = `/gemini/v1beta/models/${this.provider.model}:generateContent`;
      const finalUrl = `${this.provider.baseUrl}${endpoint}?key=${this.provider.apiKey}`;
      
      console.log('🌐 Testing URL:', finalUrl);
      
      const body = {
        contents: [
          {
            role: "user",
            parts: [{ text: "Say 'Hello World'" }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          topP: 0.9,
          topK: 40
        }
      };

      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.provider.apiKey}`
        },
        body: JSON.stringify(body)
      });

      console.log('📊 Response status:', response.status);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('📄 Raw response:', JSON.stringify(result, null, 2));
      
      // 嘗試提取文本
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || 
                  result.text || 
                  result.content ||
                  JSON.stringify(result);
      
      console.log('✅ Test successful, extracted text:', text);
      console.log('=====================================');
      
      return text;
    } catch (error) {
      console.error('❌ Simple test failed:', error);
      throw error;
    }
  }

  // 🔧 新增：JSON 格式測試方法
  async testJSONFormat(): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('AI 服務未配置');
    }

    try {
      console.log('🧪 ===== TESTING JSON FORMAT =====');
      
      const testPrompt = `You are an expert English language teacher creating vocabulary lesson.

IMPORTANT: Respond with ONLY a valid JSON array.

Format:
[
  {
    "word": "example",
    "definition": "clear definition",
    "example": "practical sentence", 
    "pronunciation": "/ɪɡˈzæmpəl/",
    "category": "category name",
    "difficulty": "Beginner",
    "traditionalChinese": "Chinese meaning"
  }
]

CRITICAL REQUIREMENTS:
1. Start your response with [ and end with ]
2. Each object must have ALL 7 fields: word, definition, example, pronunciation, category, difficulty, traditionalChinese
3. All string values must be properly quoted
4. No trailing commas
5. No extra text or explanations
6. Generate exactly 2 words
7. Ensure the JSON is valid and properly formatted

Your response should be ONLY the JSON array, nothing else.`;

      const response = await this.makeAPIRequest({
        messages: [{ role: 'user', content: testPrompt }],
        max_output_tokens: 8000, // 增加 token 限制
        temperature: 0.7
      });

      console.log('📥 Raw API response:', response);
      console.log('🔍 Testing JSON parsing...');

      // 測試解析
      const parsedWords = this.parseVocabularyResponse(response);
      console.log('✅ JSON parsing successful:', parsedWords);

      // 驗證格式
      if (parsedWords.length > 0) {
        const firstWord = parsedWords[0];
        const requiredFields = ['word', 'definition', 'example', 'pronunciation', 'category', 'difficulty', 'traditionalChinese'];
        
        console.log('🔍 Validating required fields...');
        for (const field of requiredFields) {
          if (firstWord[field]) {
            console.log(`✅ ${field}: ${firstWord[field]}`);
          } else {
            console.log(`❌ Missing field: ${field}`);
          }
        }
      }

      console.log('=====================================');
    } catch (error) {
      console.error('❌ JSON format test failed:', error);
      throw error;
    }
  }

  async generateVocabulary(request: Input): Promise<GeneratedVocabularyWord[]> {
    if (!this.isConfigured()) {
      throw new Error('AI 服務未配置。請在 aiService.ts 中設置 API 金鑰。');
    }

    try {
      // 🔧 完整的模式檢測邏輯
      if ('mode' in request && request.mode === 'custom-made') {
        this.setMode('personal');
        console.log(' Mode detected from request.mode: custom-made → personal');
      } else if ('mode' in request && request.mode === 'customized') {
        this.setMode('customer');
        console.log(' Mode detected from request.mode: customized → customer');
      }
      
      console.log('🔧 Final AI mode set to:', this.currentMode);
      console.log('📝 Request type:', 'occupation' in request ? 'PersonalCustomMode' : 'CustomerInputMode');
      console.log('🔍 Request mode property:', (request as any).mode);
      
      const prompt = this.buildVocabularyPrompt(request);
      console.log('📤 Generated prompt:', prompt);
      
      const response = await this.makeAPIRequest({
        messages: [{ role: 'user', content: prompt }],
        max_output_tokens: 8000, // 增加 token 限制
        temperature: 0.7
      });
      
      console.log('📥 AI response received, length:', response.length);
      return this.parseVocabularyResponse(response);
    } catch (error) {
      console.error('生成詞彙時發生錯誤:', error);
      throw new Error('生成詞彙失敗。請檢查 API 配置和網絡連接。');
    }
  }

  // 客戶輸入模式生成詞彙
  async generateVocabularyFromCustomerInput(request: CustomerInputMode): Promise<GeneratedVocabularyWord[]> {
    this.setMode('customer');
    return this.generateVocabulary(request);
  }

  // 個人客製化模式生成詞彙
  async generateVocabularyFromPersonalCustom(request: PersonalCustomMode): Promise<GeneratedVocabularyWord[]> {
    this.setMode('personal');
    return this.generateVocabulary(request);
  }

  // 練習生成功能 - 暫時隱藏
  /*
  async generateExercises(words: GeneratedVocabularyWord[]): Promise<any[]> {
    if (!this.isConfigured()) {
      throw new Error('AI 服務未配置。請在 aiService.ts 中設置 API 金鑰。');
    }

    try {
      const prompt = this.buildExercisePrompt(words);
      const response = await this.makeAPIRequest({
        messages: [{ role: 'user', content: prompt }],
        max_output_tokens: 1500,
        temperature: 0.8
      });
      return this.parseExerciseResponse(response);
    } catch (error) {
      console.error('生成練習時發生錯誤:', error);
      throw new Error('生成練習失敗。請檢查 API 配置和網絡連接。');
    }
  }
  */

  private async makeAPIRequest(data: any): Promise<string> {
    if (!this.provider) {
      throw new Error('AI 提供商未配置');
    }

    const endpoint = `/gemini/v1beta/models/${this.provider.model}:generateContent`
    const content = data.messages?.[0]?.content || data.messages?.[0]?.text || '';
    // 將參數編碼為 URL 查詢參數
    const finalUrl = `${this.provider.baseUrl}${endpoint}?key=${this.provider.apiKey}`

    const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: data.messages?.[0]?.content || "" }]
      }
    ],
     generationConfig: {
        temperature: data.temperature || 0.7,
        maxOutputTokens: data.max_output_tokens || 2000, // 注意這裡的參數名
        topP: data.top_p || 0.9,
        topK: data.top_k || 40
      }
  };

    const params = new URLSearchParams({
      key: this.provider.apiKey,
      prompt: content,
      model: this.provider.model,
      temperature: (data.temperature || 0.7).toString(),
      max_output_tokens: (data.max_output_tokens || 2000).toString(),
      top_p: '0.9',
      top_k: '40'
    });
    
    // 🔍 詳細的請求日誌
    console.log('🚀 ===== API REQUEST DETAILS =====');
    console.log('📡 Endpoint:', endpoint);
    console.log('🌐 Full URL:', finalUrl);
    console.log('🔑 API Key:', this.provider.apiKey ? '***' + this.provider.apiKey.slice(-4) : 'NOT SET');
    console.log('🤖 Model:', this.provider.model);
    console.log('📝 Request Content:', content);
    console.log('📊 Request Body:', JSON.stringify(body, null, 2));
    console.log('⚙️ Generation Config:', {
      temperature: data.temperature || 0.7,
      maxOutputTokens: data.max_output_tokens || 2000,
      topP: data.top_p || 0.9,
      topK: data.top_k || 40
    });
    console.log('🔍 Request Headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.provider.apiKey}`
    });
    console.log('=====================================');

    try {
      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.provider.apiKey}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API 請求失敗: ${response.status} - ${errorText}`);
        throw new Error(`API 請求失敗: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      // 🔍 詳細的 API 回應日誌
      console.log('📥 ===== API RESPONSE DETAILS =====');
      console.log('📊 Response Status:', response.status);
      console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
      console.log('📄 Raw Response:', JSON.stringify(result, null, 2));
      console.log('🔍 Response Keys:', Object.keys(result));
      
      // 檢查不同的回應結構
      if (result.candidates) {
        console.log('🎯 Found candidates structure:', result.candidates.length, 'candidates');
        if (result.candidates.length > 0) {
          console.log('📝 First candidate:', JSON.stringify(result.candidates[0], null, 2));
        }
      }
      
      if (result.content) {
        console.log('📝 Found content structure:', JSON.stringify(result.content, null, 2));
      }
      
      if (result.text) {
        console.log('📄 Found text field:', result.text);
      }
      
      // 🔧 修復：增強文本提取邏輯
      let extractedText = '';
      
      // 首先嘗試標準路徑
      if (result.candidates && result.candidates.length > 0) {
        const candidate = result.candidates[0];
        console.log('🔍 Examining first candidate:', JSON.stringify(candidate, null, 2));
        
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          const part = candidate.content.parts[0];
          console.log('🔍 Examining first part:', JSON.stringify(part, null, 2));
          
          if (part.text) {
            extractedText = part.text;
            console.log('✅ Found text in candidate.content.parts[0].text');
          }
        }
        
        // 嘗試其他可能的字段
        if (!extractedText && candidate.text) {
          extractedText = candidate.text;
          console.log('✅ Found text in candidate.text');
        }
      }
      
      // 如果標準路徑失敗，嘗試其他路徑
      if (!extractedText) {
        extractedText = result.text || result.content || '';
        if (extractedText) {
          console.log('✅ Found text in alternative field');
        }
      }
      
      console.log('📝 Extracted Text Content:', extractedText);
      console.log('📏 Content Length:', extractedText.length);
      console.log('=====================================');
      
      if (!extractedText || extractedText.trim() === '') {
        console.warn('⚠️ ===== NO TEXT CONTENT EXTRACTED =====');
        console.log('🔍 Available fields:', Object.keys(result));
        
        // 檢查是否是 token 限制問題
        if (result.candidates && result.candidates.length > 0) {
          const candidate = result.candidates[0];
          if (candidate.finishReason === 'MAX_TOKENS') {
            console.error('🚨 Token limit reached! Increase maxOutputTokens');
            throw new Error('AI response was truncated due to token limit. Please increase maxOutputTokens or reduce prompt length.');
          }
        }
        
        // 🔧 增強的回應解析邏輯
        let alternativeText = '';
        
        // 嘗試多種可能的字段路徑
        const possiblePaths = [
          result.candidates?.[0]?.content?.parts?.[0]?.text,
          result.candidates?.[0]?.text,
          result.content?.parts?.[0]?.text,
          result.content?.text,
          result.response?.text,
          result.message?.content,
          result.message?.text,
          result.data?.text,
          result.text,
          result.content,
          result.response,
          result.message,
          result.data
        ];
        
        console.log('🔍 Trying alternative text extraction paths...');
        for (let i = 0; i < possiblePaths.length; i++) {
          const path = possiblePaths[i];
          if (path && typeof path === 'string' && path.trim().length > 0) {
            console.log(`✅ Found text at path ${i}:`, path.substring(0, 100) + '...');
            alternativeText = path;
            break;
          }
        }
        
        // 如果仍然沒有找到，嘗試解析整個回應
        if (!alternativeText) {
          console.log('🔍 Attempting to parse entire response as text...');
          const responseString = JSON.stringify(result);
          if (responseString.includes('"text"') || responseString.includes('"content"')) {
            console.log('📄 Response contains text/content fields, attempting manual extraction...');
            
            // 嘗試從 JSON 字符串中提取文本
            const textMatch = responseString.match(/"text"\s*:\s*"([^"]+)"/);
            const contentMatch = responseString.match(/"content"\s*:\s*"([^"]+)"/);
            
            if (textMatch) {
              alternativeText = textMatch[1];
              console.log('✅ Extracted text from JSON string:', alternativeText.substring(0, 100) + '...');
            } else if (contentMatch) {
              alternativeText = contentMatch[1];
              console.log('✅ Extracted content from JSON string:', alternativeText.substring(0, 100) + '...');
            }
          }
        }
        
        if (alternativeText) {
          console.log('✅ Found alternative text field:', alternativeText.substring(0, 200) + '...');
          console.log('=====================================');
          return alternativeText;
        }
        
        // 如果仍然沒有找到，記錄完整的回應以便調試
        console.error('❌ No text content found in any field');
        console.log('🔍 Full API response structure:', JSON.stringify(result, null, 2));
        console.log('🔍 Response type:', typeof result);
        console.log('🔍 Response keys:', Object.keys(result));
        
        // 檢查是否是錯誤回應
        if (result.error || result.message || result.status) {
          console.error('🚨 API returned error response:', result);
          throw new Error(`API Error: ${result.error || result.message || 'Unknown error'}`);
        }
        
        console.log('=====================================');
        throw new Error('AI service returned no text content');
      }
      
      console.log('✅ Successfully extracted text content');
      return extractedText;
    } catch (error) {
      console.error('API 請求錯誤:', error);
      throw error;
    }
  }

  private buildVocabularyPrompt(request: Input): string {
    if (this.currentMode === 'personal') {
      const personalRequest = request as PersonalCustomMode;
      return `You are an expert English language teacher creating vocabulary lesson.

Generate ${personalRequest.count} English vocabulary words for a ${personalRequest.difficulty.toLowerCase()} level student. Based on a giving content, generate some relevant vocabulary that is useful for my giving input.

Context:
- Occupation: ${personalRequest.occupation}
- Interests/Habits: ${personalRequest.habits}
- Theme: ${personalRequest.theme || 'Professional and Personal Development'}

Requirements:
- Each word should be appropriate for ${personalRequest.difficulty} level
- Include words relevant to their ${personalRequest.occupation}
- Provide clear, concise definitions
- Create practical, real-world examples
- Include IPA pronunciation
- Categorize each word appropriately
- Include Traditional Chinese meaning

IMPORTANT: Respond with ONLY a valid JSON array.

Format:
[
  {
    "word": "example",
    "definition": "clear definition", 
    "example": "practical sentence",
    "pronunciation": "/ɪɡˈzæmpəl/",
    "category": "category name",
    "difficulty": "${personalRequest.difficulty}",
    "traditionalChinese": "Chinese meaning"
  }
]

Generate exactly ${personalRequest.count} words. JSON only, no extra text.`;
    } else {
      const customerRequest = request as CustomerInputMode;
      return `You are an expert English language teacher creating vocabulary lesson.

Generate ${customerRequest.count} English vocabulary words for a ${customerRequest.difficulty.toLowerCase()} level student. Based on a giving content, generate some relevant vocabulary that is useful for my giving input.

Requirements:
- Each word should be appropriate for ${customerRequest.difficulty} level
- Include words directly related to the user prompt content
- Provide clear, concise definitions
- Create practical, real-world examples
- Include IPA pronunciation
- Categorize each word appropriately
- Include Traditional Chinese meaning

IMPORTANT: Respond with ONLY a valid JSON array.

Format:
[
  {
    "word": "example",
    "definition": "clear definition",
    "example": "practical sentence", 
    "pronunciation": "/ɪɡˈzæmpəl/",
    "category": "category name",
    "difficulty": "${customerRequest.difficulty}",
    "traditionalChinese": "Chinese meaning"
  }
]

CRITICAL REQUIREMENTS:
1. Start your response with [ and end with ]
2. Each object must have ALL 7 fields: word, definition, example, pronunciation, category, difficulty, traditionalChinese
3. All string values must be properly quoted
4. No trailing commas
5. No extra text or explanations
6. Generate exactly ${customerRequest.count} words
7. Ensure the JSON is valid and properly formatted

Your response should be ONLY the JSON array, nothing else.`;
    }
  }

  // 練習提示詞建構 - 暫時隱藏
  /*
  private buildExercisePrompt(words: GeneratedVocabularyWord[]): string {
    const wordList = words.map(w => w.word).join(', ');
    return `Create interactive exercises for these vocabulary words: ${wordList}

Generate 3 different types of exercises:
1. Fill-in-the-blank exercise
2. Multiple choice question
3. Matching exercise

Format your response as a JSON array with this structure:
[
  {
    "type": "fill-in-blank",
    "question": "Complete the sentence: [sentence with blank]",
    "correctAnswer": "correct word",
    "explanation": "explanation of the answer",
    "relatedWords": ["word1"]
  },
  {
    "type": "multiple-choice",
    "question": "What does [word] mean?",
    "options": ["correct definition", "wrong option 1", "wrong option 2", "wrong option 3"],
    "correctAnswer": "correct definition",
    "explanation": "explanation",
    "relatedWords": ["word"]
  },
  {
    "type": "matching",
    "question": "Match the words with their definitions:",
    "options": ["word1|definition1", "word2|definition2", "word3|definition3", "word4|definition4"],
    "correctAnswer": "match-all",
    "explanation": "explanation",
    "relatedWords": ["word1", "word2", "word3", "word4"]
  }
]

Use the provided words and their definitions. Ensure the JSON is valid.`;
  }
  */

  private parseVocabularyResponse(response: string): GeneratedVocabularyWord[] {
    try {
      console.log('🔍 Parsing AI response...');
      console.log('📄 Raw response text:', response);
      
      // 🔧 清理回應文本，移除可能的額外內容
      let cleanedResponse = response.trim();
      
      // 🔧 新增：驗證和修復 JSON 格式
      const validatedResponse = this.validateAndRepairJSON(cleanedResponse);
      if (validatedResponse) {
        console.log('✅ JSON validation and repair successful');
        return validatedResponse;
      }
      
      // 嘗試找到 JSON 數組的開始和結束位置
      const arrayStart = cleanedResponse.indexOf('[');
      const arrayEnd = cleanedResponse.lastIndexOf(']');
      
      if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
        // 提取 JSON 數組部分
        const jsonArray = cleanedResponse.substring(arrayStart, arrayEnd + 1);
        console.log('🔧 Extracted JSON array:', jsonArray);
        
        try {
          const parsed = JSON.parse(jsonArray);
          if (Array.isArray(parsed)) {
            console.log('✅ Successfully parsed JSON array, length:', parsed.length);
            
            // 🔧 新增：驗證每個對象的格式
            const validatedWords = this.validateVocabularyObjects(parsed);
            if (validatedWords.length > 0) {
              console.log('✅ Vocabulary objects validation successful');
              return validatedWords;
            }
            
            const formattedWords = parsed.map((item, index) => {
              console.log(`📝 Processing item ${index + 1}:`, item);
              return this.formatVocabularyItem(item);
            });
            
            console.log('🎉 Final formatted words:', formattedWords);
            return formattedWords;
          }
        } catch (parseError) {
          console.warn('⚠️ Failed to parse extracted JSON array:', parseError);
          console.log('🔧 Attempting to clean and reparse...');
          
          // 嘗試清理 JSON 格式問題
          const cleanedJson = this.cleanJsonString(jsonArray);
          try {
            const parsed = JSON.parse(cleanedJson);
            if (Array.isArray(parsed)) {
              console.log('✅ Successfully parsed cleaned JSON array');
              const validatedWords = this.validateVocabularyObjects(parsed);
              if (validatedWords.length > 0) {
                return validatedWords;
              }
              return parsed.map(item => this.formatVocabularyItem(item));
            }
          } catch (cleanError) {
            console.warn('⚠️ Failed to parse cleaned JSON:', cleanError);
          }
        }
      }
      
      // 如果數組解析失敗，嘗試找到單個對象
      const objectStart = cleanedResponse.indexOf('{');
      const objectEnd = cleanedResponse.lastIndexOf('}');
      
      if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
        const jsonObject = cleanedResponse.substring(objectStart, objectEnd + 1);
        console.log('🔧 Extracted JSON object:', jsonObject);
        
        try {
          const singleObject = JSON.parse(jsonObject);
          if (singleObject.word) {
            console.log('✅ Found single object, wrapping in array');
            const validatedWord = this.validateVocabularyObject(singleObject);
            return validatedWord ? [validatedWord] : [this.formatVocabularyItem(singleObject)];
          }
        } catch (parseError) {
          console.warn('⚠️ Failed to parse extracted JSON object:', parseError);
        }
      }
      
      // 嘗試更寬鬆的匹配
      console.log('🔄 Attempting regex-based extraction...');
      const wordMatches = this.extractWordsWithRegex(cleanedResponse);
      if (wordMatches.length > 0) {
        console.log('✅ Successfully extracted words using regex');
        return wordMatches;
      }
      
      // 最後的嘗試：使用 fallback 解析
      console.log('🔄 Attempting fallback parsing...');
      const fallbackResult = this.tryFallbackParsing(cleanedResponse);
      if (fallbackResult.length > 0) {
        console.log('✅ Successfully parsed using fallback method');
        return fallbackResult;
      }
      
      console.error('❌ All parsing methods failed');
      console.log('🔍 Response analysis:');
      console.log('- Contains "word":', cleanedResponse.includes('"word"'));
      console.log('- Contains "definition":', cleanedResponse.includes('"definition"'));
      console.log('- Contains "example":', cleanedResponse.includes('"example"'));
      console.log('- Contains "pronunciation":', cleanedResponse.includes('"pronunciation"'));
      console.log('- Contains "category":', cleanedResponse.includes('"category"'));
      console.log('- Contains "traditionalChinese":', cleanedResponse.includes('traditionalChinese'));
      
      throw new Error('No valid JSON structure found in response');
      
    } catch (error) {
      console.error('❌ Error parsing vocabulary response:', error);
      console.log('Raw response:', response);
      throw new Error('Failed to parse vocabulary response from AI model');
    }
  }

  // 🔧 新增：JSON 格式驗證和修復方法
  private validateAndRepairJSON(response: string): GeneratedVocabularyWord[] | null {
    try {
      console.log('🔍 Validating and repairing JSON format...');
      
      // 移除可能的 markdown 格式
      let cleaned = response.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      cleaned = cleaned.replace(/```\s*/g, '');
      
      // 移除前後的額外文本
      const arrayStart = cleaned.indexOf('[');
      const arrayEnd = cleaned.lastIndexOf(']');
      
      if (arrayStart === -1 || arrayEnd === -1) {
        console.log('❌ No JSON array found');
        return null;
      }
      
      cleaned = cleaned.substring(arrayStart, arrayEnd + 1);
      
      // 修復常見的 JSON 問題
      cleaned = this.repairCommonJSONIssues(cleaned);
      
      try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) {
          console.log('✅ JSON repair successful, validating objects...');
          return this.validateVocabularyObjects(parsed);
        }
      } catch (parseError) {
        console.log('⚠️ JSON repair failed:', parseError);
      }
      
      return null;
    } catch (error) {
      console.error('❌ JSON validation and repair failed:', error);
      return null;
    }
  }

  // 🔧 新增：修復常見的 JSON 問題
  private repairCommonJSONIssues(jsonString: string): string {
    console.log('🔧 Repairing common JSON issues...');
    
    let repaired = jsonString;
    
    // 修復尾隨逗號
    repaired = repaired.replace(/,(\s*[}\]])/g, '$1');
    
    // 修復缺少的引號
    repaired = repaired.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
    
    // 修復未轉義的引號
    repaired = repaired.replace(/"([^"]*)"([^"]*)"([^"]*)"/g, (match, p1, p2, p3) => {
      return `"${p1}${p2.replace(/"/g, '\\"')}${p3}"`;
    });
    
    // 修復換行符
    repaired = repaired.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    
    // 修復製表符
    repaired = repaired.replace(/\t/g, '\\t');
    
    console.log('🔧 Repaired JSON:', repaired.substring(0, 200) + '...');
    return repaired;
  }

  // 🔧 新增：驗證詞彙對象格式
  private validateVocabularyObjects(objects: any[]): GeneratedVocabularyWord[] {
    console.log('🔍 Validating vocabulary objects...');
    
    const requiredFields = ['word', 'definition', 'example', 'pronunciation', 'category', 'difficulty', 'traditionalChinese'];
    const validObjects: GeneratedVocabularyWord[] = [];
    
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      console.log(`📝 Validating object ${i + 1}:`, obj);
      
      const validatedObject = this.validateVocabularyObject(obj);
      if (validatedObject) {
        validObjects.push(validatedObject);
      } else {
        console.warn(`⚠️ Object ${i + 1} validation failed, skipping`);
      }
    }
    
    console.log(`✅ Validation complete: ${validObjects.length}/${objects.length} objects valid`);
    return validObjects;
  }

  // 🔧 新增：驗證單個詞彙對象
  private validateVocabularyObject(obj: any): GeneratedVocabularyWord | null {
    const requiredFields = ['word', 'definition', 'example', 'pronunciation', 'category', 'difficulty', 'traditionalChinese'];
    
    // 檢查所有必需字段
    for (const field of requiredFields) {
      if (!obj[field] || typeof obj[field] !== 'string' || obj[field].trim() === '') {
        console.warn(`⚠️ Missing or invalid field: ${field}`);
        return null;
      }
    }
    
    // 檢查難度值是否有效
    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
    if (!validDifficulties.includes(obj.difficulty)) {
      console.warn(`⚠️ Invalid difficulty: ${obj.difficulty}`);
      return null;
    }
    
    return this.formatVocabularyItem(obj);
  }

  private formatVocabularyItem(item: any): GeneratedVocabularyWord {
    return {
      word: item.word || item.Word || item.WORD || '',
      definition: item.definition || item.Definition || item.DEFINITION || '',
      example: item.example || item.Example || item.EXAMPLE || '',
      pronunciation: item.pronunciation || item.Pronunciation || item.PRONUNCIATION || '',
      category: item.category || item.Category || item.CATEGORY || '',
      difficulty: (item.difficulty || item.Difficulty || item.DIFFICULTY || 'Beginner') as Difficulty,
      traditionalChinese: item.traditionalChinese || item.TraditionalChinese || item.TRADITIONALCHINESE || ''
    };
  }

  private cleanJsonString(jsonString: string): string {
    try {
      console.log('🧹 Cleaning JSON string...');
      
      // 移除尾隨的逗號
      let cleaned = jsonString.replace(/,(\s*[}\]])/g, '$1');
      
      // 移除可能的註釋或額外文本
      cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, ''); // 移除 /* */ 註釋
      cleaned = cleaned.replace(/\/\/.*$/gm, ''); // 移除 // 註釋
      
      // 移除可能的 markdown 格式
      cleaned = cleaned.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      
      // 移除可能的 "Here's the vocabulary:" 等前綴文本
      cleaned = cleaned.replace(/^[^{]*/, '');
      
      console.log('🧹 Cleaned JSON:', cleaned);
      return cleaned;
    } catch (error) {
      console.warn('⚠️ Failed to clean JSON string:', error);
      return jsonString;
    }
  }

  private extractWordsWithRegex(response: string): GeneratedVocabularyWord[] {
    try {
      console.log('🔍 Extracting words using regex patterns...');
      
      // 嘗試找到包含 "word" 字段的任何 JSON 結構
      const wordMatch = response.match(/\{[^}]*"word"[^}]*\}/g);
      if (wordMatch && wordMatch.length > 0) {
        console.log('✅ Found word objects using regex:', wordMatch);
        try {
          const parsedObjects = wordMatch.map(match => {
            // 清理可能的格式問題
            const cleaned = match.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
            return JSON.parse(cleaned);
          });
          return parsedObjects.map(item => this.formatVocabularyItem(item));
        } catch (parseError) {
          console.warn('Failed to parse regex matches:', parseError);
        }
      }
      
      return [];
    } catch (error) {
      console.error('❌ Regex extraction failed:', error);
      return [];
    }
  }

  private tryFallbackParsing(response: string): GeneratedVocabularyWord[] {
    try {
      console.log('🔄 Attempting fallback parsing...');
      
      // 嘗試找到所有可能的單詞定義對
      const wordPattern = /"word"\s*:\s*"([^"]+)"/gi;
      const definitionPattern = /"definition"\s*:\s*"([^"]+)"/gi;
      const examplePattern = /"example"\s*:\s*"([^"]+)"/gi;
      const pronunciationPattern = /"pronunciation"\s*:\s*"([^"]+)"/gi;
      const categoryPattern = /"category"\s*:\s*"([^"]+)"/gi;
      const difficultyPattern = /"difficulty"\s*:\s*"([^"]+)"/gi;
      const traditionalChinesePattern = /"traditionalChinese"\s*:\s*"([^"]+)"/gi;
      
      const words = [...response.matchAll(wordPattern)].map(match => match[1]);
      const definitions = [...response.matchAll(definitionPattern)].map(match => match[1]);
      const examples = [...response.matchAll(examplePattern)].map(match => match[1]);
      const pronunciations = [...response.matchAll(pronunciationPattern)].map(match => match[1]);
      const categories = [...response.matchAll(categoryPattern)].map(match => match[1]);
      const difficulties = [...response.matchAll(difficultyPattern)].map(match => match[1]);
      const traditionalChineses = [...response.matchAll(traditionalChinesePattern)].map(match => match[1]);
      
      if (words.length === 0) {
        console.log('❌ No words found in fallback parsing');
        return [];
      }
      
      const result: GeneratedVocabularyWord[] = [];
      const maxLength = Math.max(words.length, definitions.length, examples.length, pronunciations.length, categories.length, difficulties.length, traditionalChineses.length);
      
      for (let i = 0; i < maxLength; i++) {
        result.push({
          word: words[i] || `Word ${i + 1}`,
          definition: definitions[i] || `Definition for ${words[i] || `word ${i + 1}`}`,
          example: examples[i] || `Example sentence for ${words[i] || `word ${i + 1}`}`,
          pronunciation: pronunciations[i] || '/prəˌnʌnsiˈeɪʃən/',
          category: categories[i] || 'General',
          difficulty: (difficulties[i] || 'Beginner') as Difficulty,
          traditionalChinese: traditionalChineses[i] || '繁體中文翻譯未提供'
        });
      }
      
      console.log(`✅ Fallback parsing successful: ${result.length} words extracted`);
      return result;
      
    } catch (error) {
      console.error('❌ Fallback parsing failed:', error);
      return [];
    }
  }

  // 練習回應解析 - 暫時隱藏
  /*
  private parseExerciseResponse(response: string): any[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in exercise response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(parsed)) {
        throw new Error('Exercise response is not an array');
      }

      return parsed.map((exercise, index) => ({
        id: `${exercise.type}-${index}`,
        type: exercise.type,
        question: exercise.question,
        options: exercise.options,
        correctAnswer: exercise.correctAnswer,
        explanation: exercise.explanation,
        relatedWords: exercise.relatedWords || []
      }));
    } catch (error) {
      console.error('Error parsing exercise response:', error);
      console.log('Raw response:', response);
      throw new Error('Failed to parse exercise response from AI model');
    }
  }
  */
}

export default AIService.getInstance();