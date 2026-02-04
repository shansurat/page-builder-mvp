'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { BroadcastForm } from '@/components/broadcasts/BroadcastForm'
import { BroadcastList } from '@/components/broadcasts/BroadcastList'

interface Broadcast {
  id: string
  message: string
  priority: 'INFO' | 'WARNING' | 'URGENT'
  targetRole: string | null
  createdAt: Date
  sentBy: {
    id: string
    name: string | null
    email: string
  }
}

export default function BroadcastsPage() {
  const { data: session } = useSession()
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBroadcasts()
  }, [])

  const fetchBroadcasts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/broadcasts')
      if (response.ok) {
        const data = await response.json()
        setBroadcasts(data)
      }
    } catch (error) {
      console.error('Error fetching broadcasts:', error)
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = session?.user?.role === 'ADMIN'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading broadcasts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Broadcasts</h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin ? 'Send system-wide announcements to users' : 'View system announcements'}
        </p>
      </div>

      {isAdmin && (
        <BroadcastForm onSuccess={fetchBroadcasts} />
      )}

      {!isAdmin && (
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          Only administrators can send broadcasts. Contact an admin if you need to send a system-wide message.
        </div>
      )}

      <BroadcastList broadcasts={broadcasts} />
    </div>
  )
}
