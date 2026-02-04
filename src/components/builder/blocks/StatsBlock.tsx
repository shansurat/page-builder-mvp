import { BlockComponent } from '@/types'

interface StatsBlockProps {
  block: BlockComponent
}

export function StatsBlock({ block }: StatsBlockProps) {
  const { content } = block
  const items = (content.items as Array<{ value: string | number; label: string }>) || []

  if (items.length === 0) {
    items.push(
      { value: '10K+', label: 'Active Users' },
      { value: '50+', label: 'Countries' },
      { value: '99%', label: 'Satisfaction' }
    )
  }

  return (
    <div className="py-12">
      {content.title && (
        <h2 className="text-3xl font-bold mb-12 text-center">{content.title}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">
              {item.value}
            </div>
            <div className="text-gray-600">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
