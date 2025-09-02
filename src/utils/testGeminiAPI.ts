import { AIService } from "./aiService";

/**
 * 測試 Gemini API 連接和功能
 */
export const testGeminiAPI = async () => {
  console.log('🔍 開始測試 Gemini API...');
  
  const aiService = AIService.getInstance();
  
  try {
    // 檢查配置
    console.log('📋 檢查 Gemini 配置...');
    const isConfigured = aiService.isConfigured();
    console.log('配置狀態:', isConfigured ? '✅ 已配置' : '❌ 未配置');
    
    if (!isConfigured) {
      console.error('❌ Gemini API 未正確配置');
      return false;
    }
    
    // 獲取配置信息
    const config = (aiService as any).provider;
    console.log('📊 當前 Gemini 配置:');
    console.log('- 提供商:', config?.name);
    console.log('- 模型:', config?.model);
    console.log('- 端點:', config?.baseUrl);
    console.log('- API Key:', config?.apiKey ? `${config.apiKey.substring(0, 8)}...` : '未設置');
    
    // 測試模型列表端點
    console.log('📋 測試模型列表端點...');
    try {
      const modelsUrl = `${config.baseUrl}/models`;
      const modelsResponse = await fetch(modelsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json();
        console.log('✅ 模型列表端點正常');
        console.log('📋 可用模型:', modelsData);
      } else {
        console.log('⚠️ 模型列表端點不可用，但繼續測試生成端點');
      }
    } catch (error) {
      console.log('⚠️ 模型列表端點測試失敗，但繼續測試生成端點');
    }
    
    // 測試生成內容端點
    console.log('🌐 測試生成內容端點...');
    const success = await aiService.testConnection();
    
    if (success) {
      console.log('✅ Gemini API 連接成功！');
      
      // 測試詞彙生成
      console.log('📚 測試詞彙生成功能...');
      const testRequest = {
        occupation: "Software Developer",
        habits: "Reading tech blogs, coding",
        difficulty: 'Intermediate' as const,
        count: 2,
        theme: 'Technology'
      };
      
      console.log('📝 測試請求:', testRequest);
      
      const vocabulary = await aiService.generateVocabulary(testRequest);
      
      console.log('✅ 詞彙生成成功！');
      console.log('📖 生成的詞彙:', vocabulary);
      
      return true;
    } else {
      console.log('❌ Gemini API 連接失敗');
      return false;
    }
    
  } catch (error: any) {
    console.error('❌ Gemini API 測試過程中發生錯誤:', error.message);
    console.log('🔧 請檢查以下項目:');
    console.log('1. API key 是否正確');
    console.log('2. 端點 URL 是否可訪問');
    console.log('3. 模型名稱是否正確');
    console.log('4. 網絡連接是否正常');
    console.log('5. API 服務是否可用');
    return false;
  }
};

/**
 * 測試特定的 Gemini 端點
 */
export const testGeminiEndpoint = async (endpoint: string) => {
  console.log(`🔍 測試 Gemini 端點: ${endpoint}`);
  
  const aiService = AIService.getInstance();
  const config = (aiService as any).provider;
  
  try {
    const url = `${config.baseUrl}${endpoint}`;
    console.log('🌐 完整 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 響應狀態:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 端點測試成功');
      console.log('📋 響應數據:', data);
      return data;
    } else {
      const errorText = await response.text();
      console.log('❌ 端點測試失敗');
      console.log('📋 錯誤響應:', errorText);
      return null;
    }
    
  } catch (error: any) {
    console.error('❌ 端點測試錯誤:', error.message);
    return null;
  }
};

/**
 * 在瀏覽器控制台中可用的全局函數
 */
if (typeof window !== 'undefined') {
  (window as any).testGemini = {
    testAPI: testGeminiAPI,
    testEndpoint: testGeminiEndpoint
  };
  
  console.log('🔧 Gemini API 測試工具已加載到全局對象中');
  console.log('使用方法:');
  console.log('- testGemini.testAPI() - 測試完整的 Gemini API');
  console.log('- testGemini.testEndpoint("/models") - 測試特定端點');
}
