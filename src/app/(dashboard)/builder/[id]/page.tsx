'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useBuilderStore } from '@/store/builder-store'
import { ComponentPalette } from '@/components/builder/ComponentPalette'
import { Canvas } from '@/components/builder/Canvas'
import { PropertyPanel } from '@/components/builder/PropertyPanel'
import { Toolbar } from '@/components/builder/Toolbar'
import { BlockComponent } from '@/types'

export default function BuilderPage() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.id as string
  const { setBlocks, blocks, markClean } = useBuilderStore()
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
  }, [pageId, setBlocks])

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: JSON.stringify(blocks),
        }),
      })

      if (!res.ok) throw new Error('Failed to save')
      
      markClean()
      alert('Page saved successfully!')
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save page')
    }
  }

  const handlePublish = async () => {
    try {
      const res = await fetch(`/api/pages/${pageId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: JSON.stringify(blocks),
        }),
      })

      if (!res.ok) throw new Error('Failed to publish')
      
      markClean()
      alert('Page published successfully!')
    } catch (error) {
      console.error('Error publishing:', error)
      alert('Failed to publish page')
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <Toolbar 
        pageId={pageId} 
        onSave={handleSave} 
        onPublish={handlePublish} 
      />
      <div className="flex-1 flex overflow-hidden">
        <ComponentPalette />
        <Canvas />
        <PropertyPanel />
      </div>
    </div>
  )
}
