import { create } from 'zustand'
import { BlockComponent } from '@/types'

interface BuilderState {
  blocks: BlockComponent[]
  selectedBlockId: string | null
  history: BlockComponent[][]
  historyIndex: number
  isDirty: boolean
}

interface BuilderActions {
  setBlocks: (blocks: BlockComponent[]) => void
  addBlock: (block: BlockComponent, index?: number) => void
  updateBlock: (id: string, updates: Partial<BlockComponent>) => void
  deleteBlock: (id: string) => void
  reorderBlocks: (startIndex: number, endIndex: number) => void
  selectBlock: (id: string | null) => void
  undo: () => void
  redo: () => void
  reset: () => void
  markClean: () => void
}

type BuilderStore = BuilderState & BuilderActions

const MAX_HISTORY = 50

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  blocks: [],
  selectedBlockId: null,
  history: [[]],
  historyIndex: 0,
  isDirty: false,

  setBlocks: (blocks) => {
    set({
      blocks,
      history: [blocks],
      historyIndex: 0,
      isDirty: false,
      selectedBlockId: null,
    })
  },

  addBlock: (block, index) => {
    const { blocks, history, historyIndex } = get()
    const newBlocks = [...blocks]
    
    if (index !== undefined && index >= 0 && index <= blocks.length) {
      newBlocks.splice(index, 0, block)
    } else {
      newBlocks.push(block)
    }

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newBlocks)
    
    set({
      blocks: newBlocks,
      history: newHistory.slice(-MAX_HISTORY),
      historyIndex: Math.min(newHistory.length - 1, MAX_HISTORY - 1),
      isDirty: true,
      selectedBlockId: block.id,
    })
  },

  updateBlock: (id, updates) => {
    const { blocks, history, historyIndex } = get()
    const newBlocks = blocks.map((block) =>
      block.id === id ? { ...block, ...updates } : block
    )

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newBlocks)

    set({
      blocks: newBlocks,
      history: newHistory.slice(-MAX_HISTORY),
      historyIndex: Math.min(newHistory.length - 1, MAX_HISTORY - 1),
      isDirty: true,
    })
  },

  deleteBlock: (id) => {
    const { blocks, history, historyIndex, selectedBlockId } = get()
    const newBlocks = blocks.filter((block) => block.id !== id)

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newBlocks)

    set({
      blocks: newBlocks,
      history: newHistory.slice(-MAX_HISTORY),
      historyIndex: Math.min(newHistory.length - 1, MAX_HISTORY - 1),
      isDirty: true,
      selectedBlockId: selectedBlockId === id ? null : selectedBlockId,
    })
  },

  reorderBlocks: (startIndex, endIndex) => {
    const { blocks, history, historyIndex } = get()
    const newBlocks = [...blocks]
    const [removed] = newBlocks.splice(startIndex, 1)
    newBlocks.splice(endIndex, 0, removed)

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newBlocks)

    set({
      blocks: newBlocks,
      history: newHistory.slice(-MAX_HISTORY),
      historyIndex: Math.min(newHistory.length - 1, MAX_HISTORY - 1),
      isDirty: true,
    })
  },

  selectBlock: (id) => {
    set({ selectedBlockId: id })
  },

  undo: () => {
    const { historyIndex, history } = get()
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      set({
        blocks: history[newIndex],
        historyIndex: newIndex,
        isDirty: true,
      })
    }
  },

  redo: () => {
    const { historyIndex, history } = get()
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      set({
        blocks: history[newIndex],
        historyIndex: newIndex,
        isDirty: true,
      })
    }
  },

  reset: () => {
    set({
      blocks: [],
      selectedBlockId: null,
      history: [[]],
      historyIndex: 0,
      isDirty: false,
    })
  },

  markClean: () => {
    set({ isDirty: false })
  },
}))
