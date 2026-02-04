import { BlockComponent } from '@/types'
import Image from 'next/image'

interface ImageBlockProps {
  block: BlockComponent
}

export function ImageBlock({ block }: ImageBlockProps) {
  const { content } = block

  if (!content.imageUrl) {
    return (
      <div className="bg-gray-200 h-64 flex items-center justify-center rounded">
        <span className="text-gray-500">No image selected</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <img
        src={content.imageUrl}
        alt={content.title || 'Image'}
        className="w-full h-auto rounded"
      />
      {content.title && (
        <p className="text-center text-sm text-gray-600 mt-2 italic">
          {content.title}
        </p>
      )}
    </div>
  )
}
