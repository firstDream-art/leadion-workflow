/**
 * 圖標映射：將舊的SVG圖標映射到 Lucide 圖標
 * 參考 https://lucide.dev/icons/
 */
import { 
  Search, 
  FileText, 
  BarChart3, 
  Settings, 
  User, 
  Mail, 
  Shield, 
  ExternalLink,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Sun,
  Moon,
  Menu,
  Zap,
  Target,
  Bot,
  BarChart,
  Clock,
  Star,
  Users,
  AlertTriangle,
  Loader
} from 'lucide-vue-next'

// 工作流程類別圖標映射
export const categoryIcons = {
  'seo': Search,
  'content': FileText,
  'analysis': BarChart3,
  'automation': Settings,
  'user': User,
  'email': Mail,
  'security': Shield,
  'external': ExternalLink,
  'search': Search,
  'document': FileText,
  'chart': BarChart,
  'target': Target,
  'bot': Bot,
  'zap': Zap
}

// 通知圖標映射
export const notificationIcons = {
  info: Info,
  warning: AlertCircle,
  error: XCircle,
  success: CheckCircle
}

// 主題圖標映射
export const themeIcons = {
  light: Sun,
  dark: Moon
}

// 狀態圖標映射
export const statusIcons = {
  completed: CheckCircle,
  success: CheckCircle,
  failed: XCircle,
  error: XCircle,
  running: Loader,
  pending: Clock,
  warning: AlertTriangle
}

// 工作流程圖標映射（根據功能分類）
export const workflowIcons = {
  'SEO 關鍵字分析器': Search,
  '內容生成器': FileText,
  '數據分析儀表板': BarChart3,
  '社交媒體管理': User,
  '電子郵件自動化': Mail,
  '安全監控': Shield,
  '報告生成器': FileText,
  '搜索優化': Search
}

// 通用圖標映射
export const commonIcons = {
  menu: Menu,
  star: Star,
  users: Users,
  clock: Clock,
  settings: Settings,
  info: Info,
  warning: AlertCircle,
  error: XCircle,
  success: CheckCircle,
  search: Search,
  document: FileText,
  chart: BarChart3,
  bot: Bot,
  target: Target,
  zap: Zap
}

// 根據名稱獲取圖標組件
export function getIconComponent(iconName: string) {
  const allIcons = {
    ...categoryIcons,
    ...notificationIcons,
    ...themeIcons,
    ...statusIcons,
    ...commonIcons
  }
  
  return allIcons[iconName as keyof typeof allIcons] || Info
}

// 根據工作流程標題獲取圖標
export function getWorkflowIcon(title: string) {
  // 根據標題關鍵字匹配圖標
  const lowercaseTitle = title.toLowerCase()
  
  if (lowercaseTitle.includes('seo') || lowercaseTitle.includes('搜索') || lowercaseTitle.includes('關鍵字')) {
    return Search
  }
  if (lowercaseTitle.includes('內容') || lowercaseTitle.includes('文檔') || lowercaseTitle.includes('報告')) {
    return FileText
  }
  if (lowercaseTitle.includes('分析') || lowercaseTitle.includes('數據') || lowercaseTitle.includes('圖表')) {
    return BarChart3
  }
  if (lowercaseTitle.includes('用戶') || lowercaseTitle.includes('社交')) {
    return User
  }
  if (lowercaseTitle.includes('郵件') || lowercaseTitle.includes('email')) {
    return Mail
  }
  if (lowercaseTitle.includes('安全') || lowercaseTitle.includes('監控')) {
    return Shield
  }
  if (lowercaseTitle.includes('自動化') || lowercaseTitle.includes('設定')) {
    return Settings
  }
  
  // 預設圖標
  return Bot
} 