import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { BlockRenderer } from '@/components/builder/blocks/BlockRenderer'
import { BlockComponent } from '@/types'
import AnalyticsTracker from './AnalyticsTracker'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
  })

  if (!page || page.status !== 'PUBLISHED') {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
    keywords: page.seoKeywords || undefined,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || undefined,
      type: 'website',
    },
  }
}

export default async function PublicPage({ params }: PageProps) {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
  })

  if (!page || page.status !== 'PUBLISHED') {
    notFound()
  }

  let blocks: BlockComponent[] = []
  try {
    blocks = JSON.parse(page.content)
  } catch (error) {
    console.error('Error parsing page content:', error)
  }

  return (
    <>
      <AnalyticsTracker pageId={page.id} />
      <div className="w-full">
        {blocks.length === 0 ? (
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
            <p className="text-muted-foreground">This page is empty</p>
          </div>
        ) : (
          blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} isEditing={false} />
          ))
        )}
      </div>
    </>
  )
}
