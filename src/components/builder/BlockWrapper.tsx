'use client'

import { useBuilderStore } from '@/store/builder-store'
import { BlockComponent } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BlockRenderer } from './blocks/BlockRenderer'
import { Trash2, GripVertical } from 'lucide-react'

interface BlockWrapperProps {
  block: BlockComponent
  index: number
}

export function BlockWrapper({ block, index }: BlockWrapperProps) {
  const { selectedBlockId, selectBlock, deleteBlock } = useBuilderStore()
  const isSelected = selectedBlockId === block.id

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        selectBlock(block.id)
      }}
    >
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
        <button
          {...attributes}
          {...listeners}
          className="bg-white border border-gray-300 rounded p-1 hover:bg-gray-50 cursor-move"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            deleteBlock(block.id)
          }}
          className="bg-white border border-gray-300 rounded p-1 hover:bg-red-50 text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <BlockRenderer block={block} isEditing />
    </div>
  )
}
