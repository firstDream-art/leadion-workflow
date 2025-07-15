<template>
  <div class="analysis">
    <div class="analysis-header">
      <h1>SEO 分析工具</h1>
      <p>輸入您的網站 URL，開始 SEO 分析</p>
    </div>

    <div class="analysis-container">
      <div class="analysis-form">
        <div class="form-group">
          <label>網站 URL</label>
          <input 
            type="url" 
            v-model="websiteUrl"
            placeholder="https://example.com" 
            class="url-input"
          />
        </div>
        
        <div class="form-group">
          <label>分析類型</label>
          <div class="analysis-options">
            <label class="option">
              <input type="checkbox" v-model="options.seo" />
              <span>SEO 分析</span>
            </label>
            <label class="option">
              <input type="checkbox" v-model="options.performance" />
              <span>效能分析</span>
            </label>
            <label class="option">
              <input type="checkbox" v-model="options.accessibility" />
              <span>無障礙分析</span>
            </label>
            <label class="option">
              <input type="checkbox" v-model="options.bestPractices" />
              <span>最佳實踐</span>
            </label>
          </div>
        </div>

        <button 
          class="analyze-btn" 
          @click="startAnalysis"
          :disabled="!websiteUrl || isAnalyzing"
        >
          {{ isAnalyzing ? '分析中...' : '開始分析' }}
        </button>
      </div>

      <div v-if="analysisResult" class="analysis-result">
        <h3>分析結果</h3>
        <div class="result-content">
          <p>{{ analysisResult }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const websiteUrl = ref('')
const isAnalyzing = ref(false)
const analysisResult = ref('')

const options = reactive({
  seo: true,
  performance: true,
  accessibility: false,
  bestPractices: false
})

const startAnalysis = async () => {
  if (!websiteUrl.value) return
  
  isAnalyzing.value = true
  analysisResult.value = ''
  
  // 模擬分析過程
  setTimeout(() => {
    analysisResult.value = `已完成 ${websiteUrl.value} 的分析！這裡會顯示詳細的 SEO 分析報告。目前正在開發中，稍後會整合真實的分析功能。`
    isAnalyzing.value = false
  }, 3000)
}
</script>

<style scoped>
.analysis {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.analysis-header {
  text-align: center;
  margin-bottom: 3rem;
}

.analysis-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.analysis-header p {
  color: #7f8c8d;
  font-size: 1.2rem;
}

.analysis-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.1rem;
}

.url-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.url-input:focus {
  outline: none;
  border-color: #3498db;
}

.analysis-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.option:hover {
  background: #e9ecef;
}

.option input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.option span {
  font-weight: 500;
  color: #2c3e50;
}

.analyze-btn {
  width: 100%;
  background: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.analyze-btn:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-2px);
}

.analyze-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.analysis-result {
  margin-top: 2rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #27ae60;
}

.analysis-result h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.result-content p {
  color: #34495e;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .analysis {
    padding: 1rem;
  }
  
  .analysis-header h1 {
    font-size: 2rem;
  }
  
  .analysis-options {
    grid-template-columns: 1fr;
  }
}
</style> 