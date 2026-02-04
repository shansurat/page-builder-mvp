import { BlockComponent } from '@/types'

interface VideoBlockProps {
  block: BlockComponent
}

export function VideoBlock({ block }: VideoBlockProps) {
  const { content } = block

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('youtu.be/')[1]
        : new URL(url).searchParams.get('v')
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  if (!content.videoUrl) {
    return (
      <div className="bg-gray-200 h-96 flex items-center justify-center rounded">
        <span className="text-gray-500">No video URL provided</span>
      </div>
    )
  }

  return (
    <div className="py-8">
      {content.title && (
        <h2 className="text-3xl font-bold mb-6 text-center">{content.title}</h2>
      )}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={getEmbedUrl(content.videoUrl)}
          className="absolute inset-0 w-full h-full rounded"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
