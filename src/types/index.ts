// Type definitions for the page builder

export interface BlockComponent {
  id: string
  type: BlockType
  content: BlockContent
  styles: BlockStyles
  effects?: BlockEffects
}

export type BlockType =
  | 'hero'
  | 'features'
  | 'text'
  | 'image'
  | 'gallery'
  | 'video'
  | 'cta'
  | 'form'
  | 'stats'
  | 'testimonial'
  | 'spacer'
  | 'divider'

export interface BlockContent {
  title?: string
  subtitle?: string
  text?: string
  imageUrl?: string
  videoUrl?: string
  buttonText?: string
  buttonLink?: string
  items?: Array<Record<string, string | number | boolean>>
}

export interface BlockStyles {
  margin?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  padding?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  backgroundColor?: string
  backgroundImage?: string
  textColor?: string
  borderRadius?: number
  customClasses?: string
  responsiveVisibility?: {
    mobile?: boolean
    tablet?: boolean
    desktop?: boolean
  }
}

export interface BlockEffects {
  animation?: AnimationType
  parallax?: boolean
  sticky?: boolean
  hover?: HoverEffect
  scrollTrigger?: boolean
}

export type AnimationType =
  | 'fade-in'
  | 'fade-out'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out'

export type HoverEffect =
  | 'lift'
  | 'scale'
  | 'brightness'
  | 'shadow'

export interface PageData {
  id: string
  title: string
  slug: string
  content: BlockComponent[]
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED'
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  publishedAt?: Date
  scheduledFor?: Date
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string | null
  role: 'ADMIN' | 'MODERATOR' | 'VISITOR'
  image?: string | null
  createdAt: Date
}

export interface Message {
  id: string
  senderId: string
  recipientId: string
  subject: string
  content: string
  status: 'UNREAD' | 'READ' | 'ARCHIVED'
  createdAt: Date
  readAt?: Date | null
  sender?: User
  recipient?: User
}

export interface Notification {
  id: string
  userId: string
  type: 'MESSAGE' | 'BROADCAST' | 'SYSTEM' | 'APPROVAL_REQUEST'
  title: string
  content: string
  read: boolean
  link?: string | null
  createdAt: Date
}
