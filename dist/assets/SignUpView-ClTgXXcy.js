import{d as x,o as g,a as v,c as h,f as l,b as n,s as p,u as y,y as w,v as r,w as k,x as _,h as B,_ as C}from"./index-Vb9Qnebq.js";const S={class:"auth-container"},I={class:"auth-card glass-effect"},E={class:"auth-form"},z={class:"auth-footer"},F={class:"footer-text"},L=x({__name:"SignUpView",setup(N){g(()=>{console.log("📝 註冊頁面：使用優化的樣式注入方式"),m(),c()}),v(()=>{b()});function m(){const o="clerk-signup-optimized-styles";if(document.getElementById(o))return;const t=`
    /* 🎨 Clerk 註冊頁面優化樣式 */
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
      box-sizing: border-box !important;
    }
    
    .cl-socialButtonsBlockButton *,
    .cl-socialButtons button * {
      width: 18px !important;
      height: 18px !important;
      max-width: 18px !important;
      max-height: 18px !important;
      font-size: 18px !important;
      object-fit: contain !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .cl-formField {
      margin: 1.5rem auto !important;
      border: none !important;
      border-top: none !important;
      max-width: 350px !important;
      width: 100% !important;
    }
    
    .cl-formFieldLabel {
      margin-bottom: 0.5rem !important;
      margin-top: 0 !important;
      border: none !important;
      color: #374151 !important;
      font-weight: 500 !important;
      font-size: 14px !important;
      text-align: left !important;
    }
    
    .cl-formFieldInput {
      width: 100% !important;
      height: 48px !important;
      padding: 12px 16px !important;
      border: 2px solid #d1d5db !important;
      border-radius: 8px !important;
      background: #ffffff !important;
      transition: border-color 0.2s ease !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
      box-sizing: border-box !important;
    }
    
    .cl-formFieldInput:focus {
      border: 2px solid #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
      outline: none !important;
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
    
    /* 🎯 自定義按鈕樣式 */
    .custom-continue-btn {
      width: 100% !important;
      height: 44px !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      border: none !important;
      border-radius: 8px !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-family: inherit !important;
      margin: 1rem auto !important;
      padding: 0 !important;
      max-width: 350px !important;
    }
    
    .custom-continue-btn:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
    }
    
    /* 隱藏原始 Clerk 按鈕 */
    .cl-formButtonPrimary {
      display: none !important;
    }
  `,e=document.createElement("style");e.id=o,e.textContent=t,document.head.appendChild(e),console.log("✅ CSS 樣式注入完成，大幅減少 DOM 查詢")}let a=null,i=!1;function c(){let o=null;a=new MutationObserver(()=>{i||(o&&clearTimeout(o),o=setTimeout(()=>{u()},800))}),a.observe(document.body,{childList:!0,subtree:!0,attributes:!1})}function u(){if(!i){i=!0;try{const o=document.querySelectorAll(".cl-formButtonPrimary:not(.processed)");o.length>0&&(console.log(`🎯 發現 ${o.length} 個需要處理的按鈕`),o.forEach(t=>{f(t),t.classList.add("processed")}))}catch(o){console.error("處理 Clerk 元素時出錯:",o)}finally{i=!1}}}function f(o){var e,s;if((e=o.parentNode)!=null&&e.querySelector(".custom-continue-btn"))return;o.style.display="none";const t=document.createElement("button");t.textContent="註冊",t.className="custom-continue-btn",t.addEventListener("click",d=>{d.preventDefault(),d.stopPropagation(),console.log("🚀 觸發 Clerk 註冊"),o.click()},{passive:!1}),(s=o.parentNode)==null||s.insertBefore(t,o)}function b(){a&&(a.disconnect(),a=null);const o=document.getElementById("clerk-signup-optimized-styles");o&&o.remove(),console.log("🧹 清理註冊頁面優化資源")}return(o,t)=>{const e=_("router-link");return B(),h("div",S,[t[6]||(t[6]=l('<div class="auth-background" data-v-2917a11f><div class="tech-pattern" data-v-2917a11f></div><div class="floating-orbs" data-v-2917a11f><div class="orb orb-1" data-v-2917a11f></div><div class="orb orb-2" data-v-2917a11f></div><div class="orb orb-3" data-v-2917a11f></div></div></div>',1)),n("div",I,[t[5]||(t[5]=l('<div class="auth-header" data-v-2917a11f><div class="brand-logo" data-v-2917a11f><div class="logo-wrapper" data-v-2917a11f><div class="logo-circle" data-v-2917a11f><span class="logo-text" data-v-2917a11f>L</span></div></div><h1 class="auth-title" data-v-2917a11f>加入 LeadIO AI</h1></div><p class="auth-subtitle" data-v-2917a11f>建立您的帳戶，開始 AI 驅動的 SEO 分析之旅</p></div>',1)),n("div",E,[p(y(w),{"redirect-url":"/dashboard",routing:"hash","fallback-redirect-url":"/dashboard","sign-in-url":"/sign-in"})]),n("div",z,[t[2]||(t[2]=n("div",{class:"divider"},[n("span",{class:"divider-text"},"或")],-1)),t[3]||(t[3]=n("div",{class:"existing-user-notice"},[n("p",{class:"notice-text"},[n("strong",null,"已有帳戶？"),r("請直接使用您的帳戶登入。 ")])],-1)),n("p",F,[t[1]||(t[1]=r(" 已經有帳戶了？ ")),p(e,{to:"/sign-in",class:"auth-link"},{default:k(()=>t[0]||(t[0]=[r(" 立即登入 ")])),_:1,__:[0]})]),t[4]||(t[4]=n("div",{class:"features-hint"},[n("span",{class:"feature-item"},"AI SEO 分析"),n("span",{class:"feature-item"},"即時報告"),n("span",{class:"feature-item"},"智能建議")],-1))])])])}}}),V=C(L,[["__scopeId","data-v-2917a11f"]]);export{V as default};
