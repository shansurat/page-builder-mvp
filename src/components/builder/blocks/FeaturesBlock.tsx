import { BlockComponent } from '@/types'

interface FeaturesBlockProps {
  block: BlockComponent
}

export function FeaturesBlock({ block }: FeaturesBlockProps) {
  const { content } = block
  const items = (content.items as Array<{ icon?: string; title: string; description: string }>) || []
  const columns = items.length >= 4 ? 4 : items.length >= 3 ? 3 : 2

  if (items.length === 0) {
    items.push(
      { icon: '🚀', title: 'Feature 1', description: 'Description for feature 1' },
      { icon: '⚡', title: 'Feature 2', description: 'Description for feature 2' },
      { icon: '🎯', title: 'Feature 3', description: 'Description for feature 3' }
    )
  }

  return (
    <div className="py-12">
      {content.title && (
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {content.title}
        </h2>
      )}
      {content.subtitle && (
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          {content.subtitle}
        </p>
      )}
      <div className={`grid gap-8 md:grid-cols-${columns}`}>
        {items.map((item, index) => (
          <div key={index} className="text-center">
            {item.icon && (
              <div className="text-4xl mb-4">{item.icon}</div>
            )}
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
