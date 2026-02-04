import { BlockComponent } from '@/types'
import { HeroBlock } from './HeroBlock'
import { FeaturesBlock } from './FeaturesBlock'
import { TextBlock } from './TextBlock'
import { ImageBlock } from './ImageBlock'
import { GalleryBlock } from './GalleryBlock'
import { VideoBlock } from './VideoBlock'
import { CTABlock } from './CTABlock'
import { FormBlock } from './FormBlock'
import { StatsBlock } from './StatsBlock'
import { TestimonialBlock } from './TestimonialBlock'
import { SpacerBlock } from './SpacerBlock'
import { DividerBlock } from './DividerBlock'

interface BlockRendererProps {
  block: BlockComponent
  isEditing?: boolean
}

export function BlockRenderer({ block, isEditing = false }: BlockRendererProps) {
  const style: React.CSSProperties = {
    marginTop: block.styles.margin?.top ? `${block.styles.margin.top}px` : undefined,
    marginRight: block.styles.margin?.right ? `${block.styles.margin.right}px` : undefined,
    marginBottom: block.styles.margin?.bottom ? `${block.styles.margin.bottom}px` : undefined,
    marginLeft: block.styles.margin?.left ? `${block.styles.margin.left}px` : undefined,
    paddingTop: block.styles.padding?.top ? `${block.styles.padding.top}px` : undefined,
    paddingRight: block.styles.padding?.right ? `${block.styles.padding.right}px` : undefined,
    paddingBottom: block.styles.padding?.bottom ? `${block.styles.padding.bottom}px` : undefined,
    paddingLeft: block.styles.padding?.left ? `${block.styles.padding.left}px` : undefined,
    backgroundColor: block.styles.backgroundColor,
    backgroundImage: block.styles.backgroundImage ? `url(${block.styles.backgroundImage})` : undefined,
    color: block.styles.textColor,
    borderRadius: block.styles.borderRadius ? `${block.styles.borderRadius}px` : undefined,
  }

  const className = block.styles.customClasses || ''

  const renderBlock = () => {
    switch (block.type) {
      case 'hero':
        return <HeroBlock block={block} />
      case 'features':
        return <FeaturesBlock block={block} />
      case 'text':
        return <TextBlock block={block} />
      case 'image':
        return <ImageBlock block={block} />
      case 'gallery':
        return <GalleryBlock block={block} />
      case 'video':
        return <VideoBlock block={block} />
      case 'cta':
        return <CTABlock block={block} />
      case 'form':
        return <FormBlock block={block} />
      case 'stats':
        return <StatsBlock block={block} />
      case 'testimonial':
        return <TestimonialBlock block={block} />
      case 'spacer':
        return <SpacerBlock block={block} />
      case 'divider':
        return <DividerBlock block={block} />
      default:
        return <div>Unknown block type</div>
    }
  }

  return (
    <div style={style} className={className}>
      {renderBlock()}
    </div>
  )
}
