import { AIService } from "./aiService";

/**
 * 測試 API 連接的工具函數
 * 您可以在瀏覽器控制台中運行這個函數
 */
export const testAPIConnection = async () => {
  console.log('🔍 開始測試 API 連接...');
  
  const aiService = AIService.getInstance();
  
  try {
    // 檢查配置
    console.log('📋 檢查配置...');
    const isConfigured = aiService.isConfigured();
    console.log('配置狀態:', isConfigured ? '✅ 已配置' : '❌ 未配置');
    
    if (!isConfigured) {
      console.error('❌ AI 服務未正確配置');
      console.log('請檢查 src/config/aiConfig.ts 文件中的設置');
      return false;
    }
    
    // 獲取配置信息
    const config = (aiService as any).provider;
    console.log('📊 當前配置:');
    console.log('- 提供商:', config?.name);
    console.log('- 模型:', config?.model);
    console.log('- 端點:', config?.baseUrl);
    console.log('- API Key:', config?.apiKey ? `${config.apiKey.substring(0, 8)}...` : '未設置');
    
    // 測試連接
    console.log('🌐 測試 API 連接...');
    const success = await aiService.testConnection();
    
    if (success) {
      console.log('✅ API 連接成功！');
      console.log('🎉 您可以正常使用詞彙生成功能');
      return true;
    } else {
      console.log('❌ API 連接失敗');
      return false;
    }
    
  } catch (error: any) {
    console.error('❌ 測試過程中發生錯誤:', error.message);
    console.log('🔧 請檢查以下項目:');
    console.log('1. API key 是否正確');
    console.log('2. 端點 URL 是否可訪問');
    console.log('3. 網絡連接是否正常');
    console.log('4. API 服務是否可用');
    return false;
  }
};

/**
 * 測試詞彙生成功能
 */
export const testVocabularyGeneration = async () => {
  console.log('📚 開始測試詞彙生成...');
  
  const aiService = AIService.getInstance();
  
  try {
    const testRequest = {
      occupation: "Software Developer",
      habits: "Reading tech blogs, coding",
      difficulty: 'Intermediate' as const,
      count: 3,
      theme: 'Technology'
    };
    
    console.log('📝 測試請求:', testRequest);
    
    const vocabulary = await aiService.generateVocabulary(testRequest);
    
    console.log('✅ 詞彙生成成功！');
    console.log('📖 生成的詞彙:', vocabulary);
    
    return vocabulary;
    
  } catch (error: any) {
    console.error('❌ 詞彙生成失敗:', error.message);
    return null;
  }
};

/**
 * 在瀏覽器控制台中可用的全局函數
 */
if (typeof window !== 'undefined') {
  (window as any).testAPI = {
    testConnection: testAPIConnection,
    testVocabulary: testVocabularyGeneration
  };
  
  console.log('🔧 API 測試工具已加載到全局對象中');
  console.log('使用方法:');
  console.log('- testAPI.testConnection() - 測試 API 連接');
  console.log('- testAPI.testVocabulary() - 測試詞彙生成');
}
