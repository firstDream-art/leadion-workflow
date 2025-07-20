/**
 * DOM 操作優化工具
 * 減少重複查詢和事件綁定，提升性能
 */

interface StyleRule {
  selector: string
  styles: Record<string, string>
  events?: {
    type: string
    handler: (element: HTMLElement) => void
  }[]
}

class DOMOptimizer {
  private appliedStyles = new Set<string>()
  private eventHandlers = new Map<string, EventListener[]>()
  private observer: MutationObserver | null = null

  /**
   * 批量應用樣式規則
   */
  applyStyleRules(rules: StyleRule[]): void {
    // 使用 DocumentFragment 批量操作
    const fragment = document.createDocumentFragment()
    
    rules.forEach(rule => {
      const ruleId = this.generateRuleId(rule)
      
      // 避免重複應用相同的樣式
      if (this.appliedStyles.has(ruleId)) {
        return
      }

      const elements = document.querySelectorAll(rule.selector)
      
      if (elements.length > 0) {
        this.applyStyleToElements(elements, rule.styles)
        
        // 綁定事件（如果有）
        if (rule.events) {
          this.bindEventsToElements(elements, rule.events, ruleId)
        }
        
        this.appliedStyles.add(ruleId)
        console.log(`✅ 應用樣式規則: ${rule.selector} (${elements.length} 個元素)`)
      }
    })
  }

  /**
   * 使用 CSS 注入代替 JavaScript 樣式操作
   */
  injectCSS(cssRules: string, id: string): void {
    // 避免重複注入
    if (document.getElementById(id)) {
      return
    }

    const style = document.createElement('style')
    style.id = id
    style.textContent = cssRules
    document.head.appendChild(style)
    
    console.log(`✅ 注入 CSS 規則: ${id}`)
  }

  /**
   * 使用 MutationObserver 監控 DOM 變化
   */
  observeChanges(callback: () => void, debounceMs = 500): void {
    if (this.observer) {
      this.observer.disconnect()
    }

    let timeoutId: number | null = null

    this.observer = new MutationObserver(() => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      // 防抖處理，避免過頻繁的回調
      timeoutId = setTimeout(callback, debounceMs)
    })

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    })
  }

  /**
   * 清理所有事件監聽器
   */
  cleanup(): void {
    this.eventHandlers.forEach((handlers, selector) => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(element => {
        handlers.forEach(handler => {
          element.removeEventListener('focus', handler)
          element.removeEventListener('blur', handler)
          element.removeEventListener('mouseenter', handler)
          element.removeEventListener('mouseleave', handler)
        })
      })
    })
    
    this.eventHandlers.clear()
    this.appliedStyles.clear()
    
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }

  private applyStyleToElements(elements: NodeListOf<Element>, styles: Record<string, string>): void {
    elements.forEach(element => {
      const htmlElement = element as HTMLElement
      Object.entries(styles).forEach(([property, value]) => {
        htmlElement.style.setProperty(property, value, 'important')
      })
    })
  }

  private bindEventsToElements(
    elements: NodeListOf<Element>, 
    events: { type: string; handler: (element: HTMLElement) => void }[], 
    ruleId: string
  ): void {
    const handlers: EventListener[] = []
    
    elements.forEach(element => {
      events.forEach(event => {
        const handler = () => event.handler(element as HTMLElement)
        element.addEventListener(event.type, handler)
        handlers.push(handler)
      })
    })
    
    this.eventHandlers.set(ruleId, handlers)
  }

  private generateRuleId(rule: StyleRule): string {
    return `${rule.selector}-${Object.keys(rule.styles).join('-')}`
  }
}

// 創建全域實例
export const domOptimizer = new DOMOptimizer()

/**
 * Clerk 樣式優化配置
 */
export const clerkStyleRules: StyleRule[] = [
  // 社交按鈕樣式
  {
    selector: '.cl-socialButtonsBlockButton, .cl-socialButtons button',
    styles: {
      'width': '44px',
      'height': '44px',
      'min-width': '44px',
      'max-width': '44px',
      'min-height': '44px',
      'max-height': '44px',
      'padding': '6px',
      'border-radius': '8px',
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'margin-right': '8px',
      'box-sizing': 'border-box'
    }
  },
  
  // 社交按鈕圖標
  {
    selector: '.cl-socialButtonsBlockButton *, .cl-socialButtons button *',
    styles: {
      'width': '18px',
      'height': '18px',
      'max-width': '18px',
      'max-height': '18px',
      'font-size': '18px',
      'object-fit': 'contain',
      'margin': '0',
      'padding': '0'
    }
  },
  
  // 表單欄位
  {
    selector: '.cl-formField',
    styles: {
      'margin-top': '1.5rem',
      'margin-bottom': '1.5rem',
      'border': 'none',
      'border-top': 'none'
    }
  },
  
  // 表單標籤
  {
    selector: '.cl-formFieldLabel',
    styles: {
      'margin-bottom': '0.5rem',
      'margin-top': '0',
      'border': 'none'
    }
  },
  
  // 輸入框基礎樣式
  {
    selector: '.cl-formFieldInput',
    styles: {
      'border': '2px solid #d1d5db',
      'border-radius': '8px',
      'padding': '12px 16px',
      'background': '#ffffff',
      'transition': 'border-color 0.2s ease',
      'box-shadow': '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    events: [
      {
        type: 'focus',
        handler: (element) => {
          element.style.setProperty('border', '2px solid #3b82f6', 'important')
          element.style.setProperty('box-shadow', '0 0 0 3px rgba(59, 130, 246, 0.1)', 'important')
        }
      },
      {
        type: 'blur',
        handler: (element) => {
          element.style.setProperty('border', '2px solid #d1d5db', 'important')
          element.style.setProperty('box-shadow', '0 1px 3px rgba(0, 0, 0, 0.1)', 'important')
        }
      },
      {
        type: 'mouseenter',
        handler: (element) => {
          if (document.activeElement !== element) {
            element.style.setProperty('border', '2px solid #9ca3af', 'important')
          }
        }
      },
      {
        type: 'mouseleave',
        handler: (element) => {
          if (document.activeElement !== element) {
            element.style.setProperty('border', '2px solid #d1d5db', 'important')
          }
        }
      }
    ]
  },
  
  // 移除邊框和分隔線
  {
    selector: '.cl-form, .cl-divider, .cl-dividerLine, [class*="cl-internal"]',
    styles: {
      'border': 'none',
      'border-top': 'none',
      'border-bottom': 'none',
      'box-shadow': 'none',
      'outline': 'none'
    }
  },
  
  // 隱藏分隔線
  {
    selector: '.cl-dividerLine',
    styles: {
      'display': 'none',
      'height': '0',
      'background': 'none'
    }
  }
]

/**
 * 使用 CSS 注入的樣式（更高效）
 */
export const clerkCSSRules = `
  /* Clerk 組件優化樣式 */
  .cl-socialButtonsBlockButton,
  .cl-socialButtons button {
    width: 44px !important;
    height: 44px !important;
    min-width: 44px !important;
    max-width: 44px !important;
    padding: 6px !important;
    border-radius: 8px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin-right: 8px !important;
  }
  
  .cl-socialButtonsBlockButton *,
  .cl-socialButtons button * {
    width: 18px !important;
    height: 18px !important;
    max-width: 18px !important;
    max-height: 18px !important;
    font-size: 18px !important;
  }
  
  .cl-formField {
    margin-top: 1.5rem !important;
    margin-bottom: 1.5rem !important;
    border: none !important;
    border-top: none !important;
  }
  
  .cl-formFieldInput {
    border: 2px solid #d1d5db !important;
    border-radius: 8px !important;
    padding: 12px 16px !important;
    background: #ffffff !important;
    transition: border-color 0.2s ease !important;
  }
  
  .cl-formFieldInput:focus {
    border: 2px solid #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  }
  
  .cl-formFieldInput:hover:not(:focus) {
    border: 2px solid #9ca3af !important;
  }
  
  .cl-dividerLine {
    display: none !important;
    height: 0 !important;
    background: none !important;
  }
  
  .cl-form,
  .cl-divider,
  [class*="cl-internal"] {
    border: none !important;
    border-top: none !important;
    border-bottom: none !important;
    box-shadow: none !important;
    outline: none !important;
  }
`