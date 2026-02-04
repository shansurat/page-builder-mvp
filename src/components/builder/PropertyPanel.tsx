'use client'

import { useBuilderStore } from '@/store/builder-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export function PropertyPanel() {
  const { blocks, selectedBlockId, updateBlock, deleteBlock } = useBuilderStore()
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId)

  const [localContent, setLocalContent] = useState(selectedBlock?.content || {})
  const [localStyles, setLocalStyles] = useState(selectedBlock?.styles || {})

  useEffect(() => {
    if (selectedBlock) {
      setLocalContent(selectedBlock.content)
      setLocalStyles(selectedBlock.styles)
    }
  }, [selectedBlock])

  if (!selectedBlock) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <p className="text-gray-500 text-sm">Select a block to edit its properties</p>
      </div>
    )
  }

  const handleContentChange = (key: string, value: any) => {
    const newContent = { ...localContent, [key]: value }
    setLocalContent(newContent)
    updateBlock(selectedBlock.id, { content: newContent })
  }

  const handleStyleChange = (category: 'margin' | 'padding', side: string, value: number) => {
    const newStyles = {
      ...localStyles,
      [category]: {
        ...localStyles[category],
        [side]: value,
      },
    }
    setLocalStyles(newStyles)
    updateBlock(selectedBlock.id, { styles: newStyles })
  }

  const handleColorChange = (key: string, value: string | number) => {
    const newStyles = { ...localStyles, [key]: value }
    setLocalStyles(newStyles)
    updateBlock(selectedBlock.id, { styles: newStyles })
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Properties</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteBlock(selectedBlock.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Content Section */}
        <div>
          <h3 className="text-sm font-medium mb-3">Content</h3>
          <div className="space-y-3">
            {localContent.title !== undefined && (
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={localContent.title || ''}
                  onChange={(e) => handleContentChange('title', e.target.value)}
                />
              </div>
            )}
            {localContent.subtitle !== undefined && (
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={localContent.subtitle || ''}
                  onChange={(e) => handleContentChange('subtitle', e.target.value)}
                />
              </div>
            )}
            {localContent.text !== undefined && (
              <div>
                <Label htmlFor="text">Text</Label>
                <Textarea
                  id="text"
                  value={localContent.text || ''}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  rows={4}
                />
              </div>
            )}
            {localContent.imageUrl !== undefined && (
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={localContent.imageUrl || ''}
                  onChange={(e) => handleContentChange('imageUrl', e.target.value)}
                />
              </div>
            )}
            {localContent.videoUrl !== undefined && (
              <div>
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={localContent.videoUrl || ''}
                  onChange={(e) => handleContentChange('videoUrl', e.target.value)}
                />
              </div>
            )}
            {localContent.buttonText !== undefined && (
              <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={localContent.buttonText || ''}
                  onChange={(e) => handleContentChange('buttonText', e.target.value)}
                />
              </div>
            )}
            {localContent.buttonLink !== undefined && (
              <div>
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                  id="buttonLink"
                  value={localContent.buttonLink || ''}
                  onChange={(e) => handleContentChange('buttonLink', e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Spacing Section */}
        <div>
          <h3 className="text-sm font-medium mb-3">Spacing</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Padding</Label>
              <div className="grid grid-cols-4 gap-1 mt-1">
                {['top', 'right', 'bottom', 'left'].map((side) => (
                  <Input
                    key={side}
                    type="number"
                    placeholder={side[0].toUpperCase()}
                    value={localStyles.padding?.[side as keyof typeof localStyles.padding] || 0}
                    onChange={(e) =>
                      handleStyleChange('padding', side, parseInt(e.target.value) || 0)
                    }
                    className="text-xs"
                  />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs">Margin</Label>
              <div className="grid grid-cols-4 gap-1 mt-1">
                {['top', 'right', 'bottom', 'left'].map((side) => (
                  <Input
                    key={side}
                    type="number"
                    placeholder={side[0].toUpperCase()}
                    value={localStyles.margin?.[side as keyof typeof localStyles.margin] || 0}
                    onChange={(e) =>
                      handleStyleChange('margin', side, parseInt(e.target.value) || 0)
                    }
                    className="text-xs"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Colors Section */}
        <div>
          <h3 className="text-sm font-medium mb-3">Colors</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="bgColor"
                  type="color"
                  value={localStyles.backgroundColor || '#ffffff'}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={localStyles.backgroundColor || ''}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={localStyles.textColor || '#000000'}
                  onChange={(e) => handleColorChange('textColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={localStyles.textColor || ''}
                  onChange={(e) => handleColorChange('textColor', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <Label htmlFor="borderRadius">Border Radius (px)</Label>
          <Input
            id="borderRadius"
            type="number"
            value={localStyles.borderRadius || 0}
            onChange={(e) =>
              handleColorChange('borderRadius', parseInt(e.target.value) || 0)
            }
          />
        </div>
      </div>
    </div>
  )
}
