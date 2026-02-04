'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BlockComponent } from '@/types'
import { BlockRenderer } from '@/components/builder/blocks/BlockRenderer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit } from 'lucide-react'

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.id as string
  const [blocks, setBlocks] = useState<BlockComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [pageTitle, setPageTitle] = useState('')

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/pages/${pageId}`)
        if (!res.ok) throw new Error('Failed to fetch page')
        
        const page = await res.json()
        setPageTitle(page.title)
        
        let content: BlockComponent[] = []
        try {
          content = typeof page.content === 'string' 
            ? JSON.parse(page.content) 
            : page.content
        } catch (e) {
          content = []
        }
        
        setBlocks(content)
      } catch (error) {
        console.error('Error fetching page:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [pageId])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/builder/${pageId}`)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/pages')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pages
        </Button>
      </div>

      <div className="pt-16">
        {blocks.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">No content yet</p>
              <p className="text-sm">Edit this page to add content</p>
            </div>
          </div>
        ) : (
          blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))
        )}
      </div>
    </div>
  )
}
