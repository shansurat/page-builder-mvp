'use client'

import { formatDistanceToNow } from 'date-fns'
import { File, Image as ImageIcon, Video, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Media {
  id: string
  filename: string
  url: string
  type: string
  mimeType: string
  size: number
  createdAt: string
  uploadedBy: {
    name: string | null
  }
}

interface MediaCardProps {
  media: Media
  onDelete: (id: string) => void
}

export function MediaCard({ media, onDelete }: MediaCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getIcon = () => {
    switch (media.type) {
      case 'image':
        return <ImageIcon className="h-5 w-5" />
      case 'video':
        return <Video className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg">
      <div className="aspect-square bg-gray-100">
        {media.type === 'image' ? (
          <img
            src={media.url}
            alt={media.filename}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            {getIcon()}
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-gray-900">
          {media.filename}
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          {formatFileSize(media.size)} • {formatDistanceToNow(new Date(media.createdAt), { addSuffix: true })}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          By {media.uploadedBy.name || 'Unknown'}
        </p>
      </div>

      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-white shadow-sm hover:bg-gray-100"
          asChild
        >
          <a href={media.url} download={media.filename}>
            <Download className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-white shadow-sm hover:bg-red-50 hover:text-red-600"
          onClick={() => onDelete(media.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
