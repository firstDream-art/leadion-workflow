import{d as _,r as m,l as L,a as S,c as v,m as g,b as e,k,h as f,_ as B,p as E,q as z,o as M,f as I,s as h,u as $,S as F,v as p,w as N,x as O}from"./index-Vb9Qnebq.js";const T={key:0,class:"rate-limit-notice"},V={class:"notice-content"},A={class:"notice-text"},D={class:"notice-message"},j={key:0,class:"retry-countdown"},q=_({__name:"RateLimitNotice",props:{show:{type:Boolean},message:{default:"系統正在處理大量請求，為了保護服務穩定性，請稍後再試。"},autoRetryDelay:{default:0},showRetryButton:{type:Boolean,default:!0}},emits:["retry","autoRetry"],setup(x,{emit:r}){const l=x,u=r,i=m(0);let d=null;L(()=>l.show,a=>{a&&l.autoRetryDelay>0?b():c()});function b(){i.value=Math.ceil(l.autoRetryDelay/1e3),d=setInterval(()=>{i.value--,i.value<=0&&(c(),u("autoRetry"))},1e3)}function c(){d&&(clearInterval(d),d=null),i.value=0}return S(()=>{c()}),(a,n)=>a.show?(f(),v("div",T,[e("div",V,[n[2]||(n[2]=e("div",{class:"notice-icon"},[e("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[e("path",{d:"M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",stroke:"currentColor","stroke-width":"2"})])],-1)),e("div",A,[n[1]||(n[1]=e("h3",{class:"notice-title"},"請稍候片刻",-1)),e("p",D,k(a.message),1),i.value>0?(f(),v("div",j,k(i.value)+" 秒後自動重試 ",1)):g("",!0)]),a.showRetryButton?(f(),v("button",{key:0,onClick:n[0]||(n[0]=w=>a.$emit("retry")),class:"retry-button"}," 立即重試 ")):g("",!0)])])):g("",!0)}}),P=B(q,[["__scopeId","data-v-b0683cd3"]]),U={class:"auth-container"},W={class:"auth-card glass-effect"},G={class:"auth-form"},H={class:"auth-footer"},J={class:"footer-text"},K=_({__name:"SignInView",setup(x){const r=m(!1),l=m(""),u=m(0);window.addEventListener("error",o=>{var s,y;const t=o.error;((s=t==null?void 0:t.message)!=null&&s.includes("429")||(y=t==null?void 0:t.message)!=null&&y.includes("Too Many Requests"))&&i(t)});function i(o){r.value=!0,l.value=E(o),u.value=z.getSuggestedWaitTime()}function d(){r.value=!1,window.location.reload()}function b(){r.value=!1,setTimeout(()=>{window.location.reload()},1e3)}M(()=>{console.log("📝 登入頁面：使用優化的樣式注入方式"),c(),w()}),S(()=>{R()});function c(){const o="clerk-signin-optimized-styles";if(document.getElementById(o))return;const t=`
    /* 🎨 Clerk 登入頁面優化樣式 */
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
    
    /* 按鈕樣式由 scoped CSS 處理，避免衝突 */
  `,s=document.createElement("style");s.id=o,s.textContent=t,document.head.appendChild(s),console.log("✅ 登入頁面 CSS 樣式注入完成")}let a=null,n=!1;function w(){let o=null;a=new MutationObserver(()=>{n||(o&&clearTimeout(o),o=setTimeout(()=>{C()},800))}),a.observe(document.body,{childList:!0,subtree:!0,attributes:!1})}function C(){if(!n){n=!0;try{console.log("🎯 登入頁面 Clerk 元素檢測完成，使用原生按鈕")}catch(o){console.error("處理登入頁面 Clerk 元素時出錯:",o)}finally{n=!1}}}function R(){a&&(a.disconnect(),a=null);const o=document.getElementById("clerk-signin-optimized-styles");o&&o.remove(),console.log("🧹 清理登入頁面優化資源")}return(o,t)=>{const s=O("router-link");return f(),v("div",U,[t[7]||(t[7]=I('<div class="auth-background" data-v-ea7e2aab><div class="tech-pattern" data-v-ea7e2aab></div><div class="floating-orbs" data-v-ea7e2aab><div class="orb orb-1" data-v-ea7e2aab></div><div class="orb orb-2" data-v-ea7e2aab></div><div class="orb orb-3" data-v-ea7e2aab></div></div></div>',1)),e("div",W,[t[6]||(t[6]=I('<div class="auth-header" data-v-ea7e2aab><div class="brand-logo" data-v-ea7e2aab><div class="logo-wrapper" data-v-ea7e2aab><div class="logo-circle" data-v-ea7e2aab><span class="logo-text" data-v-ea7e2aab>L</span></div></div><h1 class="auth-title" data-v-ea7e2aab>歡迎回到 LeadIO AI</h1></div><p class="auth-subtitle" data-v-ea7e2aab>登入您的帳戶以開始 AI 驅動的 SEO 分析</p></div>',1)),e("div",G,[h($(F),{"redirect-url":"/dashboard",routing:"hash","fallback-redirect-url":"/dashboard","sign-up-url":"/sign-up"}),t[0]||(t[0]=e("div",{class:"rate-limit-notice"},[e("p",{class:"notice-text"},[e("strong",null,"提示："),p("如果遇到登入問題，請稍等片刻後重試。 ")])],-1))]),e("div",H,[t[3]||(t[3]=e("div",{class:"divider"},[e("span",{class:"divider-text"},"或")],-1)),t[4]||(t[4]=e("div",{class:"new-user-notice"},[e("p",{class:"notice-text"},[e("strong",null,"新用戶提醒："),p("如果您還沒有帳戶，請先註冊才能登入。 ")])],-1)),e("p",J,[t[2]||(t[2]=p(" 還沒有帳戶？ ")),h(s,{to:"/sign-up",class:"auth-link"},{default:N(()=>t[1]||(t[1]=[p(" 立即註冊 ")])),_:1,__:[1]})]),t[5]||(t[5]=e("div",{class:"features-hint"},[e("span",{class:"feature-item"},"AI SEO 分析"),e("span",{class:"feature-item"},"即時報告"),e("span",{class:"feature-item"},"智能建議")],-1))])]),h(P,{show:r.value,message:l.value,"auto-retry-delay":u.value,onRetry:d,onAutoRetry:b},null,8,["show","message","auto-retry-delay"])])}}}),X=B(K,[["__scopeId","data-v-ea7e2aab"]]);export{X as default};
