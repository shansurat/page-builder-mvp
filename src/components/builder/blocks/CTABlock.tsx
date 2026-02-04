import { BlockComponent } from '@/types'
import { Button } from '@/components/ui/button'

interface CTABlockProps {
  block: BlockComponent
}

export function CTABlock({ block }: CTABlockProps) {
  const { content } = block

  return (
    <div className="py-16 text-center">
      <div className="max-w-3xl mx-auto px-4">
        {content.title && (
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {content.title}
          </h2>
        )}
        {content.text && (
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            {content.text}
          </p>
        )}
        {content.buttonText && (
          <Button size="lg" className="text-lg px-8">
            {content.buttonText}
          </Button>
        )}
      </div>
    </div>
  )
}
