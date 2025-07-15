import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@clerk/vue'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('@/views/SignInView.vue'),
    meta: { requiresAuth: false, hideForAuth: true }
  },
  {
    path: '/sign-up',
    name: 'SignUp', 
    component: () => import('@/views/SignUpView.vue'),
    meta: { requiresAuth: false, hideForAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: () => import('@/views/AnalysisView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/ReportsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/HistoryView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守衛
router.beforeEach((to, from, next) => {
  const { isSignedIn, isLoaded } = useAuth()
  
  // 如果 Clerk 還沒載入完成，允許路由繼續（讓 App.vue 處理載入狀態）
  if (!isLoaded.value) {
    return next()
  }
  
  // 檢查是否需要認證
  if (to.meta.requiresAuth && !isSignedIn.value) {
    return next('/sign-in')
  }
  
  // 如果已登入用戶試圖訪問登入頁面，重定向到儀表板
  if (to.meta.hideForAuth && isSignedIn.value) {
    return next('/dashboard')
  }
  
  // 如果訪問根路徑且已登入，重定向到儀表板
  if (to.path === '/' && isSignedIn.value) {
    return next('/dashboard')
  }
  
  next()
})

export default router 