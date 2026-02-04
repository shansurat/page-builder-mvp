import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface TopPagesProps {
  pages: Array<{
    pageId: string
    title: string
    slug: string
    views: number
    uniqueVisitors: number
  }>
}

export function TopPages({ pages }: TopPagesProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Top Performing Pages</h3>
      <div className="space-y-3">
        {pages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data available</p>
        ) : (
          pages.map((page, index) => (
            <div key={page.pageId} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                <div>
                  <Link 
                    href={`/${page.slug}`} 
                    className="font-medium hover:text-primary transition-colors"
                    target="_blank"
                  >
                    {page.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">/{page.slug}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{page.views.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{page.uniqueVisitors} unique</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
