'use client'

import { useBuilderStore } from '@/store/builder-store'
import { Button } from '@/components/ui/button'
import { Save, Eye, Upload, Undo, Redo } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ToolbarProps {
  pageId: string
  onSave: () => Promise<void>
  onPublish: () => Promise<void>
}

export function Toolbar({ pageId, onSave, onPublish }: ToolbarProps) {
  const router = useRouter()
  const { blocks, undo, redo, history, historyIndex, isDirty } = useBuilderStore()
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave()
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      await onPublish()
    } finally {
      setPublishing(false)
    }
  }

  const handlePreview = () => {
    router.push(`/builder/${pageId}/preview`)
  }

  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
        >
          <Undo className="w-4 h-4 mr-2" />
          Undo
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo}
        >
          <Redo className="w-4 h-4 mr-2" />
          Redo
        </Button>
        <div className="ml-4 text-sm text-gray-600">
          {blocks.length} block{blocks.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isDirty && (
          <span className="text-sm text-amber-600">Unsaved changes</span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreview}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={saving || !isDirty}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button
          size="sm"
          onClick={handlePublish}
          disabled={publishing}
        >
          <Upload className="w-4 h-4 mr-2" />
          {publishing ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </div>
  )
}
