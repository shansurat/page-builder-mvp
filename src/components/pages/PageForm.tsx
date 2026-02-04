'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'

interface PageFormProps {
  page?: {
    id: string
    title: string
    slug: string
    content: string
    seoTitle?: string | null
    seoDescription?: string | null
    seoKeywords?: string | null
    status: string
    scheduledFor?: Date | null
  }
  mode: 'create' | 'edit'
}

export function PageForm({ page, mode }: PageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '[]',
    seoTitle: page?.seoTitle || '',
    seoDescription: page?.seoDescription || '',
    seoKeywords: page?.seoKeywords || '',
    status: page?.status || 'DRAFT',
    scheduledFor: page?.scheduledFor ? new Date(page.scheduledFor).toISOString().slice(0, 16) : '',
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: mode === 'create' ? generateSlug(title) : prev.slug,
    }))
  }

  const handleSubmit = async (e: React.FormEvent, saveStatus: string = 'DRAFT') => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const payload = {
        ...formData,
        status: saveStatus,
        scheduledFor: formData.scheduledFor || null,
      }

      const url = mode === 'create' 
        ? '/api/pages' 
        : `/api/pages/${page?.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {}
          data.details.forEach((error: { path: string[]; message: string }) => {
            fieldErrors[error.path[0]] = error.message
          })
          setErrors(fieldErrors)
        } else {
          setErrors({ general: data.error || 'Failed to save page' })
        }
        return
      }

      router.push('/pages')
      router.refresh()
    } catch (error) {
      console.error('Error saving page:', error)
      setErrors({ general: 'An unexpected error occurred' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, formData.status)} className="space-y-6">
      {errors.general && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          {errors.general}
        </div>
      )}

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Enter page title"
              disabled={loading}
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="page-url-slug"
              disabled={loading}
            />
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Lowercase letters, numbers, and hyphens only
            </p>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.status === 'SCHEDULED' && (
            <div>
              <Label htmlFor="scheduledFor">Schedule For</Label>
              <Input
                id="scheduledFor"
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                disabled={loading}
              />
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input
              id="seoTitle"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              placeholder="Enter SEO title (optional)"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Recommended: 50-60 characters
            </p>
          </div>

          <div>
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea
              id="seoDescription"
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              placeholder="Enter SEO description (optional)"
              rows={3}
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Recommended: 150-160 characters
            </p>
          </div>

          <div>
            <Label htmlFor="seoKeywords">SEO Keywords</Label>
            <Input
              id="seoKeywords"
              value={formData.seoKeywords}
              onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
              placeholder="keyword1, keyword2, keyword3"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Comma-separated keywords
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/pages')}
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          onClick={(e) => handleSubmit(e, 'DRAFT')}
          disabled={loading}
        >
          Save Draft
        </Button>
        
        <Button
          type="button"
          onClick={(e) => handleSubmit(e, 'PUBLISHED')}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Publish'}
        </Button>
      </div>
    </form>
  )
}
