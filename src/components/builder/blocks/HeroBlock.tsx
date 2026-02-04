import { BlockComponent } from '@/types'
import { Button } from '@/components/ui/button'

interface HeroBlockProps {
  block: BlockComponent
}

export function HeroBlock({ block }: HeroBlockProps) {
  const { content } = block

  return (
    <div className="relative min-h-[500px] flex items-center justify-center">
      {content.imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${content.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        {content.title && (
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {content.title}
          </h1>
        )}
        {content.subtitle && (
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            {content.subtitle}
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
