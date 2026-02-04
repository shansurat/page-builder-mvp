'use client'

import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface PageCardProps {
  page: {
    id: string
    title: string
    slug: string
    status: string
    author: {
      name: string | null
      email: string
    }
    publishedAt: Date | null
    updatedAt: Date
  }
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
}

export function PageCard({ page, onDelete, onDuplicate }: PageCardProps) {
  const router = useRouter()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge variant="success">Published</Badge>
      case 'DRAFT':
        return <Badge variant="secondary">Draft</Badge>
      case 'SCHEDULED':
        return <Badge variant="warning">Scheduled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold line-clamp-1">{page.title}</h3>
        {getStatusBadge(page.status)}
      </div>
      
      <p className="text-sm text-gray-500 mb-4">/{page.slug}</p>
      
      <div className="text-xs text-gray-500 space-y-1 mb-4">
        <p>Author: {page.author.name || page.author.email}</p>
        <p>Updated: {formatDate(page.updatedAt)}</p>
        {page.publishedAt && <p>Published: {formatDate(page.publishedAt)}</p>}
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => router.push(`/builder/${page.id}`)}
          className="flex-1"
        >
          Build
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/pages/${page.id}/edit`)}
        >
          Edit
        </Button>
        
        {onDuplicate && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDuplicate(page.id)}
          >
            Duplicate
          </Button>
        )}
        
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(page.id)}
          >
            Delete
          </Button>
        )}
      </div>
    </Card>
  )
}
