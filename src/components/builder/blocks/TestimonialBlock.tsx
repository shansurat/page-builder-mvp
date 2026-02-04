import { BlockComponent } from '@/types'

interface TestimonialBlockProps {
  block: BlockComponent
}

export function TestimonialBlock({ block }: TestimonialBlockProps) {
  const { content } = block

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <div className="bg-gray-50 rounded-lg p-8 md:p-12">
        <div className="text-4xl text-gray-400 mb-4">"</div>
        {content.text && (
          <blockquote className="text-xl md:text-2xl text-gray-700 mb-6 italic">
            {content.text}
          </blockquote>
        )}
        <div className="flex items-center">
          {content.imageUrl && (
            <img
              src={content.imageUrl}
              alt={content.title || 'Author'}
              className="w-16 h-16 rounded-full mr-4"
            />
          )}
          <div>
            {content.title && (
              <div className="font-semibold text-lg">{content.title}</div>
            )}
            {content.subtitle && (
              <div className="text-gray-600">{content.subtitle}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
