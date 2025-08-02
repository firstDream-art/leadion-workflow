/**
 * 管理員配置
 */

// 管理員 Email 列表
export const ADMIN_EMAILS = [
  'riverchang@adbest.com.tw',  // 你的 Email
  // 'another-admin@company.com'  // 可以添加其他管理員
]

// 檢查是否為管理員
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

// 管理員權限配置
export const ADMIN_PERMISSIONS = {
  // 點數管理
  canManageCredits: true,
  // 用戶管理  
  canViewUsers: true,
  // 交易記錄
  canViewTransactions: true,
  // 系統設置
  canManageSystem: true
}

// 檢查特定權限
export function hasAdminPermission(email: string | null | undefined, permission: keyof typeof ADMIN_PERMISSIONS): boolean {
  return isAdmin(email) && ADMIN_PERMISSIONS[permission]
}