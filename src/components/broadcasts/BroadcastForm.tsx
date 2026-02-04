'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface BroadcastFormProps {
  onSuccess: () => void
}

export function BroadcastForm({ onSuccess }: BroadcastFormProps) {
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'INFO' | 'WARNING' | 'URGENT'>('INFO')
  const [targetRole, setTargetRole] = useState<string>('all')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      alert('Please enter a message')
      return
    }

    setSending(true)
    try {
      const response = await fetch('/api/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          priority,
          targetRole: targetRole === 'all' ? null : targetRole,
        }),
      })

      if (response.ok) {
        setMessage('')
        setPriority('INFO')
        setTargetRole('all')
        onSuccess()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to send broadcast')
      }
    } catch (error) {
      console.error('Error sending broadcast:', error)
      alert('Failed to send broadcast')
    } finally {
      setSending(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Send Broadcast Message</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your broadcast message..."
            rows={4}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'INFO' | 'WARNING' | 'URGENT')}
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <Label htmlFor="targetRole">Target Audience</Label>
            <select
              id="targetRole"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Users</option>
              <option value="ADMIN">Admins Only</option>
              <option value="MODERATOR">Moderators Only</option>
              <option value="VISITOR">Visitors Only</option>
            </select>
          </div>
        </div>

        <Button type="submit" disabled={sending} className="w-full">
          {sending ? 'Sending...' : 'Send Broadcast'}
        </Button>
      </form>
    </Card>
  )
}
