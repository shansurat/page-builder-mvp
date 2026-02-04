import { BlockComponent } from '@/types'

interface TextBlockProps {
  block: BlockComponent
}

export function TextBlock({ block }: TextBlockProps) {
  const { content } = block

  return (
    <div className="prose prose-lg max-w-none">
      {content.title && (
        <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
      )}
      {content.text && (
        <div
          dangerouslySetInnerHTML={{ __html: content.text }}
          className="text-gray-700 leading-relaxed"
        />
      )}
    </div>
  )
}
