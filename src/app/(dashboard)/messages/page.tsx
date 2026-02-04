'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Plus, Inbox, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MessageList } from '@/components/messages/MessageList'
import { MessageThread } from '@/components/messages/MessageThread'
import { ComposeMessage } from '@/components/messages/ComposeMessage'

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

export default function MessagesPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState<'received' | 'sent'>('received')
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [type])

  useEffect(() => {
    const messageId = searchParams.get('id')
    if (messageId && messages.length > 0) {
      const message = messages.find((m) => m.id === messageId)
      if (message) {
        handleSelectMessage(messageId)
      }
    }
  }, [searchParams, messages])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?type=${type}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedMessage(data)
        
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, status: 'READ' } : m
          )
        )
      }
    } catch (error) {
      console.error('Error fetching message:', error)
    }
  }

  const handleReply = async (content: string) => {
    if (!selectedMessage) return

    try {
      const response = await fetch(`/api/messages/${selectedMessage.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        handleSelectMessage(selectedMessage.id)
      }
    } catch (error) {
      console.error('Error sending reply:', error)
    }
  }

  const handleArchive = async () => {
    if (!selectedMessage) return

    try {
      const response = await fetch(`/api/messages/${selectedMessage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ARCHIVED' }),
      })

      if (response.ok) {
        setSelectedMessage(null)
        fetchMessages()
      }
    } catch (error) {
      console.error('Error archiving message:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedMessage) return
    if (!confirm('Are you sure you want to delete this message?')) return

    setSelectedMessage(null)
    setMessages((prev) => prev.filter((m) => m.id !== selectedMessage.id))
  }

  const handleSendMessage = () => {
    setIsComposing(false)
    fetchMessages()
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      <div className="w-80 flex flex-col border-r border-gray-200 pr-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>

        <Button className="mb-4 w-full" onClick={() => setIsComposing(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Compose
        </Button>

        <div className="mb-4 flex gap-2">
          <Button
            variant={type === 'received' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setType('received')}
          >
            <Inbox className="mr-2 h-4 w-4" />
            Inbox
          </Button>
          <Button
            variant={type === 'sent' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setType('sent')}
          >
            <Send className="mr-2 h-4 w-4" />
            Sent
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : (
            <MessageList
              messages={messages}
              selectedId={selectedMessage?.id || null}
              onSelect={handleSelectMessage}
              type={type}
            />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {isComposing ? (
          <div className="h-full overflow-y-auto rounded-lg border border-gray-200 p-6">
            <ComposeMessage
              onSend={handleSendMessage}
              onCancel={() => setIsComposing(false)}
            />
          </div>
        ) : selectedMessage ? (
          <div className="h-full overflow-hidden rounded-lg border border-gray-200">
            <MessageThread
              message={selectedMessage}
              currentUserId={session?.user?.id || ''}
              onReply={handleReply}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">Select a message to view</p>
          </div>
        )}
      </div>
    </div>
  )
}
