import { BlockComponent } from '@/types'

interface GalleryBlockProps {
  block: BlockComponent
}

export function GalleryBlock({ block }: GalleryBlockProps) {
  const { content } = block
  const items = (content.items as Array<{ url: string; caption?: string }>) || []

  if (items.length === 0) {
    items.push(
      { url: 'https://via.placeholder.com/400x300', caption: 'Image 1' },
      { url: 'https://via.placeholder.com/400x300', caption: 'Image 2' },
      { url: 'https://via.placeholder.com/400x300', caption: 'Image 3' }
    )
  }

  return (
    <div className="py-8">
      {content.title && (
        <h2 className="text-3xl font-bold mb-8 text-center">{content.title}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div key={index} className="relative group overflow-hidden rounded">
            <img
              src={item.url}
              alt={item.caption || `Image ${index + 1}`}
              className="w-full h-64 object-cover transition-transform group-hover:scale-110"
            />
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
