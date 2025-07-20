# Vue3 專案性能規範指引

> 為了避免基礎性能錯誤，請在開發過程中嚴格遵循以下規範

## 🚨 **嚴重性能錯誤清單**

### ❌ **絕對禁止的操作**

#### 1. **DOM 操作禁忌**
```javascript
// ❌ 錯誤：每次事件都重複查詢 DOM
const handleMouseMove = (event) => {
  const elements = document.querySelectorAll('.some-class') // 高頻查詢
  const rect = element.getBoundingClientRect() // 強制重新佈局
}

// ✅ 正確：緩存查詢結果，使用防抖
const elements = ref([])
const cachedRect = ref<DOMRect>()

const handleMouseMove = throttle((event) => {
  // 使用緩存的值
}, 16) // 限制為 60fps

onMounted(() => {
  elements.value = document.querySelectorAll('.some-class')
  cachedRect.value = element.getBoundingClientRect()
})
```

#### 2. **Vue 響應式濫用**
```javascript
// ❌ 錯誤：大型靜態數據使用響應式
const largeStaticData = ref([
  { /* 幾百個靜態對象 */ }
])

// ✅ 正確：使用 markRaw 和 Object.freeze
const largeStaticData = markRaw(Object.freeze([
  { /* 幾百個靜態對象 */ }
]))

// 或移到組件外部
const STATIC_DATA = Object.freeze([...])
```

#### 3. **事件監聽器洩漏**
```javascript
// ❌ 錯誤：未清理事件監聽器
onMounted(() => {
  window.addEventListener('resize', handleResize)
  const timer = setInterval(() => {}, 1000)
  const frame = requestAnimationFrame(() => {})
})

// ✅ 正確：必須清理所有副作用
onMounted(() => {
  window.addEventListener('resize', handleResize)
  const timer = setInterval(() => {}, 1000)
  const frame = requestAnimationFrame(() => {})
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    clearInterval(timer)
    cancelAnimationFrame(frame)
  })
})
```

#### 4. **API 請求問題**
```javascript
// ❌ 錯誤：沒有防止重複請求
const submit = async () => {
  await api.submitData(formData) // 用戶連點會重複發送
}

// ✅ 正確：請求去重和狀態管理
const isSubmitting = ref(false)
const submit = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    await api.submitData(formData)
  } finally {
    isSubmitting.value = false
  }
}
```

## ✅ **必須遵循的規範**

### 1. **DOM 操作規範**

#### **高頻事件處理**
```typescript
import { throttle, debounce } from 'lodash-es'

// 滑鼠移動、滾動事件 → 使用 throttle
const handleMouseMove = throttle((event: MouseEvent) => {
  // 限制執行頻率為 60fps
}, 16)

// 輸入框、搜索 → 使用 debounce  
const handleSearch = debounce((keyword: string) => {
  // 等待用戶停止輸入 300ms 後執行
}, 300)
```

#### **DOM 查詢優化**
```typescript
// ✅ 正確的 DOM 查詢模式
export class DOMManager {
  private cache = new Map<string, Element[]>()
  
  query(selector: string): Element[] {
    if (this.cache.has(selector)) {
      return this.cache.get(selector)!
    }
    
    const elements = Array.from(document.querySelectorAll(selector))
    this.cache.set(selector, elements)
    return elements
  }
  
  invalidateCache(): void {
    this.cache.clear()
  }
}
```

### 2. **Vue 響應式優化規範**

#### **數據類型選擇指南**
```typescript
// 大型靜態數據
const STATIC_CONFIG = Object.freeze({
  workflows: [...],
  categories: [...]
})

// 簡單響應式數據
const count = ref(0)
const message = ref('')

// 複雜對象（第一層響應式）
const form = shallowReactive({
  user: { name: '', email: '' },
  settings: { theme: 'dark' }
})

// 嵌套對象（深度響應式）
const form = reactive({
  user: { name: '', email: '' },
  nested: { deep: { value: '' } }
})
```

#### **計算屬性緩存**
```typescript
// ✅ 正確：緩存複雜計算結果
const expensiveValue = computed(() => {
  // 複雜計算邏輯
  return heavyCalculation(data.value)
})

// ✅ 正確：使用 Map 緩存函數結果
const cache = new Map()
const getCachedResult = (input: string) => {
  if (cache.has(input)) {
    return cache.get(input)
  }
  
  const result = expensiveFunction(input)
  cache.set(input, result)
  return result
}
```

### 3. **組件設計規範**

#### **列表渲染優化**
```vue
<!-- ✅ 正確：限制渲染數量 -->
<template>
  <div class="list-container">
    <!-- 虛擬滾動或分頁 -->
    <div 
      v-for="item in limitedItems" 
      :key="item.id"
      class="list-item"
    >
      {{ item.name }}
    </div>
    
    <!-- 載入更多按鈕 -->
    <button v-if="hasMore" @click="loadMore">
      載入更多
    </button>
  </div>
</template>

<script setup>
const pageSize = 50
const currentPage = ref(1)

const limitedItems = computed(() => 
  allItems.value.slice(0, pageSize * currentPage.value)
)

const hasMore = computed(() => 
  limitedItems.value.length < allItems.value.length
)
</script>
```

#### **表單驗證優化**
```typescript
// ✅ 正確：緩存驗證結果
const validationCache = new Map<string, boolean>()

const isEmailValid = computed(() => {
  const email = formData.email
  
  if (validationCache.has(email)) {
    return validationCache.get(email)
  }
  
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  validationCache.set(email, isValid)
  return isValid
})

// 清理緩存
watch(() => formData.email, () => {
  validationCache.clear()
})
```

### 4. **API 請求規範**

#### **請求去重和狀態管理**
```typescript
export class ApiRequestManager {
  private pendingRequests = new Map<string, Promise<any>>()
  private cache = new Map<string, { data: any, timestamp: number }>()
  
  async request<T>(
    key: string, 
    requestFn: () => Promise<T>,
    options: { cache?: boolean, cacheTTL?: number } = {}
  ): Promise<T> {
    // 檢查緩存
    if (options.cache) {
      const cached = this.getFromCache(key, options.cacheTTL)
      if (cached) return cached
    }
    
    // 檢查是否有相同的待處理請求
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)
    }

    const promise = requestFn()
    this.pendingRequests.set(key, promise)
    
    try {
      const result = await promise
      
      if (options.cache) {
        this.setCache(key, result)
      }
      
      return result
    } finally {
      this.pendingRequests.delete(key)
    }
  }
  
  private getFromCache(key: string, ttl = 300000): any {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    const isExpired = Date.now() - cached.timestamp > ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }
  
  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }
}
```

### 5. **內存管理規範**

#### **組件清理檢查表**
```typescript
// ✅ 每個組件都必須檢查的清理項目
export const useCleanup = () => {
  const timers: number[] = []
  const animationFrames: number[] = []
  const eventListeners: Array<{
    element: EventTarget
    event: string
    handler: EventListener
  }> = []
  
  const addTimer = (timer: number) => {
    timers.push(timer)
  }
  
  const addAnimationFrame = (frame: number) => {
    animationFrames.push(frame)
  }
  
  const addEventListener = (
    element: EventTarget, 
    event: string, 
    handler: EventListener
  ) => {
    element.addEventListener(event, handler)
    eventListeners.push({ element, event, handler })
  }
  
  onUnmounted(() => {
    // 清理所有計時器
    timers.forEach(timer => clearTimeout(timer))
    timers.forEach(timer => clearInterval(timer))
    
    // 清理所有動畫幀
    animationFrames.forEach(frame => cancelAnimationFrame(frame))
    
    // 清理所有事件監聽器
    eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler)
    })
  })
  
  return {
    addTimer,
    addAnimationFrame,
    addEventListener
  }
}
```

## 🔍 **代碼審查檢查點**

### **提交前必檢項目**

1. **[ ]** 所有高頻事件都使用了 `throttle` 或 `debounce`
2. **[ ]** 大型靜態數據使用了 `markRaw` 或 `Object.freeze`
3. **[ ]** 組件中的定時器在 `onUnmounted` 中被清理
4. **[ ]** 事件監聽器在組件卸載時被移除
5. **[ ]** API 請求有防重複機制
6. **[ ]** 長列表有虛擬滾動或分頁
7. **[ ]** 表單驗證結果有緩存
8. **[ ]** 複雜計算使用了 `computed` 緩存

### **性能測試指標**

```typescript
// 添加到開發工具中的性能監控
export const performanceMonitor = {
  measureDOMQuery: (name: string, fn: () => any) => {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    if (end - start > 1) { // 超過 1ms 的 DOM 查詢
      console.warn(`🐌 DOM 查詢過慢: ${name} 耗時 ${end - start}ms`)
    }
    
    return result
  },
  
  measureRerender: (componentName: string) => {
    console.log(`🔄 組件重新渲染: ${componentName}`)
  }
}
```

## 🛡️ **ESLint 規則配置**

```javascript
// .eslintrc.js 中添加性能相關規則
module.exports = {
  rules: {
    // 禁止在循環中使用 querySelector
    'no-loop-dom-query': 'error',
    
    // 警告 reactive 包裹大型對象
    'vue/prefer-shallow-reactive': 'warn',
    
    // 要求清理副作用
    'vue/require-cleanup': 'error',
    
    // 限制 computed 複雜度
    'vue/max-computed-complexity': ['warn', 10]
  }
}
```

## 📚 **學習資源**

- [Vue.js 性能優化指南](https://vuejs.org/guide/best-practices/performance.html)
- [Web Performance APIs](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API)
- [JavaScript 內存管理](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)

---

**記住：性能優化不是一次性的工作，而是需要在開發過程中持續關注的事項。每次提交代碼前，都要檢查是否遵循了這些規範！**