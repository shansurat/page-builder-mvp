import { BlockComponent } from '@/types'

interface DividerBlockProps {
  block: BlockComponent
}

export function DividerBlock({ block }: DividerBlockProps) {
  const { content } = block
  const style = (content.items?.[0] as { style?: string })?.style || 'solid'

  return (
    <div className="py-4">
      <hr
        className="border-gray-300"
        style={{
          borderStyle: style as 'solid' | 'dashed' | 'dotted',
        }}
      />
    </div>
  )
}
