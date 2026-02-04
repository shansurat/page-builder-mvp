import { BlockComponent } from '@/types'

interface SpacerBlockProps {
  block: BlockComponent
}

export function SpacerBlock({ block }: SpacerBlockProps) {
  const { content } = block
  const height = (content.items?.[0] as { height?: number })?.height || 40

  return <div style={{ height: `${height}px` }} />
}
