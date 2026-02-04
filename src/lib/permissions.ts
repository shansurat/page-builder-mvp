export type UserRole = 'ADMIN' | 'MODERATOR' | 'VISITOR'

export const PERMISSIONS = {
  // Page permissions
  CREATE_PAGE: 'create_page',
  EDIT_PAGE: 'edit_page',
  DELETE_PAGE: 'delete_page',
  PUBLISH_PAGE: 'publish_page',
  
  // User permissions
  MANAGE_USERS: 'manage_users',
  VIEW_USERS: 'view_users',
  
  // Settings permissions
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_SETTINGS: 'view_settings',
  
  // Content permissions
  APPROVE_CONTENT: 'approve_content',
  
  // Media permissions
  MANAGE_MEDIA: 'manage_media',
  UPLOAD_MEDIA: 'upload_media',
  
  // Analytics permissions
  VIEW_ANALYTICS: 'view_analytics',
  
  // Communication permissions
  SEND_BROADCASTS: 'send_broadcasts',
  MODERATE_MESSAGES: 'moderate_messages',
} as const

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS]

// Default permissions by role
export const DEFAULT_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  ADMIN: Object.values(PERMISSIONS),
  MODERATOR: [
    PERMISSIONS.CREATE_PAGE,
    PERMISSIONS.EDIT_PAGE,
    PERMISSIONS.UPLOAD_MEDIA,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MODERATE_MESSAGES,
  ],
  VISITOR: [],
}

export function hasPermission(
  userRole: UserRole,
  userPermissions: Array<{ resource: string; action: string; granted: boolean }>,
  requiredPermission: PermissionKey
): boolean {
  // Admin has all permissions
  if (userRole === 'ADMIN') return true
  
  // Check if user has explicit permission
  const permission = userPermissions.find(
    (p) => p.resource + '_' + p.action === requiredPermission
  )
  
  if (permission) return permission.granted
  
  // Check default role permissions
  return DEFAULT_PERMISSIONS[userRole].includes(requiredPermission)
}

export function canAccessResource(
  userRole: UserRole,
  resource: string
): boolean {
  if (userRole === 'ADMIN') return true
  
  const moderatorResources = ['pages', 'media', 'messages', 'analytics']
  if (userRole === 'MODERATOR' && moderatorResources.includes(resource)) {
    return true
  }
  
  return false
}
