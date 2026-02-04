'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Send, Archive, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  subject: string
  content: string
  status: string
  createdAt: string
  sender: {
    id: string
    name: string | null
    email: string
  }
  recipient: {
    id: string
    name: string | null
    email: string
  }
  replies: Array<{
    id: string
    content: string
    createdAt: string
    sender: {
      id: string
      name: string | null
      email: string
    }
  }>
}

interface MessageThreadProps {
  message: Message
  currentUserId: string
  onReply: (content: string) => void
  onArchive: () => void
  onDelete: () => void
}

export function MessageThread({ message, currentUserId, onReply, onArchive, onDelete }: MessageThreadProps) {
  const [replyContent, setReplyContent] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  const handleReply = async () => {
    if (!replyContent.trim()) return

    setIsReplying(true)
    await onReply(replyContent)
    setReplyContent('')
    setIsReplying(false)
  }

  const allMessages = [
    {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      sender: message.sender,
    },
    ...message.replies,
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold">{message.subject}</h2>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-gray-600">
            From: {message.sender.name || message.sender.email}
          </span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-600">
            To: {message.recipient.name || message.recipient.email}
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={onArchive}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {allMessages.map((msg, index) => {
          const isCurrentUser = msg.sender.id === currentUserId
          return (
            <div
              key={msg.id}
              className={cn(
                'rounded-lg p-4',
                isCurrentUser ? 'bg-blue-50 ml-12' : 'bg-gray-50 mr-12'
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-sm">
                  {msg.sender.name || msg.sender.email}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {msg.content}
              </p>
            </div>
          )
        })}
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Type your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={handleReply} disabled={isReplying || !replyContent.trim()}>
              <Send className="mr-2 h-4 w-4" />
              Send Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
