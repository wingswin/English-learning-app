import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/testAPI.ts' // 導入 API 測試工具
import './utils/testGeminiAPI.ts' // 導入 Gemini API 測試工具

// Import test utilities for debugging (only in development)
if (import.meta.env.DEV) {
  import('./utils/testGeminiAPI.ts').then(() => {
    console.log('🔧 Gemini test utilities loaded. Use testGemini() or checkGeminiHealth() in console.');
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
