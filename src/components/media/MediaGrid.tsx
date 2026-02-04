'use client'

import { MediaCard } from './MediaCard'

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

interface MediaGridProps {
  media: Media[]
  onDelete: (id: string) => void
}

export function MediaGrid({ media, onDelete }: MediaGridProps) {
  if (media.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">No media files found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {media.map((item) => (
        <MediaCard key={item.id} media={item} onDelete={onDelete} />
      ))}
    </div>
  )
}
