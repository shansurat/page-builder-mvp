'use client'

import { formatDistanceToNow } from 'date-fns'
import { Mail, MailOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  subject: string
  content: string
  status: string
  createdAt: string
  sender: {
    name: string | null
    email: string
  }
  recipient: {
    name: string | null
    email: string
  }
  replies: { id: string }[]
}

interface MessageListProps {
  messages: Message[]
  selectedId: string | null
  onSelect: (id: string) => void
  type: 'received' | 'sent'
}

export function MessageList({ messages, selectedId, onSelect, type }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        No messages found
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {messages.map((message) => {
        const isUnread = type === 'received' && message.status === 'UNREAD'
        const isSelected = message.id === selectedId
        const otherPerson = type === 'received' ? message.sender : message.recipient

        return (
          <button
            key={message.id}
            onClick={() => onSelect(message.id)}
            className={cn(
              'w-full rounded-lg p-4 text-left transition-colors',
              isSelected
                ? 'bg-blue-50 border border-blue-200'
                : 'hover:bg-gray-50 border border-transparent'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {isUnread ? (
                  <Mail className="h-5 w-5 text-blue-600" />
                ) : (
                  <MailOpen className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={cn(
                    'text-sm truncate',
                    isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                  )}>
                    {otherPerson.name || otherPerson.email}
                  </p>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className={cn(
                  'text-sm truncate',
                  isUnread ? 'font-medium text-gray-900' : 'text-gray-600'
                )}>
                  {message.subject}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {message.content}
                </p>
                {message.replies.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    {message.replies.length} {message.replies.length === 1 ? 'reply' : 'replies'}
                  </p>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
