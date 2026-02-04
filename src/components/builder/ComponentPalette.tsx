'use client'

import { useBuilderStore } from '@/store/builder-store'
import { BlockComponent, BlockType } from '@/types'
import { Plus } from 'lucide-react'

const blockTemplates: Array<{ type: BlockType; label: string; icon: string }> = [
  { type: 'hero', label: 'Hero', icon: '🦸' },
  { type: 'features', label: 'Features', icon: '⭐' },
  { type: 'text', label: 'Text', icon: '📝' },
  { type: 'image', label: 'Image', icon: '🖼️' },
  { type: 'gallery', label: 'Gallery', icon: '🎨' },
  { type: 'video', label: 'Video', icon: '🎥' },
  { type: 'cta', label: 'Call to Action', icon: '📢' },
  { type: 'form', label: 'Form', icon: '📋' },
  { type: 'stats', label: 'Stats', icon: '📊' },
  { type: 'testimonial', label: 'Testimonial', icon: '💬' },
  { type: 'spacer', label: 'Spacer', icon: '↕️' },
  { type: 'divider', label: 'Divider', icon: '➖' },
]

const getDefaultContent = (type: BlockType): BlockComponent['content'] => {
  switch (type) {
    case 'hero':
      return {
        title: 'Welcome to Our Website',
        subtitle: 'Build amazing pages with our page builder',
        buttonText: 'Get Started',
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
      }
    case 'features':
      return {
        title: 'Our Features',
        subtitle: 'Everything you need to succeed',
        items: [
          { icon: '🚀', title: 'Fast', description: 'Lightning-fast performance' },
          { icon: '⚡', title: 'Easy', description: 'Simple to use interface' },
          { icon: '🎯', title: 'Powerful', description: 'Feature-rich capabilities' },
        ],
      }
    case 'text':
      return {
        title: 'Your Heading Here',
        text: '<p>Your text content goes here. You can format it with HTML.</p>',
      }
    case 'image':
      return {
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
        title: 'Image caption',
      }
    case 'gallery':
      return {
        title: 'Photo Gallery',
        items: [
          { url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400', caption: 'Image 1' },
          { url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400', caption: 'Image 2' },
          { url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400', caption: 'Image 3' },
        ],
      }
    case 'video':
      return {
        title: 'Watch Our Video',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }
    case 'cta':
      return {
        title: 'Ready to Get Started?',
        text: 'Join thousands of satisfied customers today',
        buttonText: 'Sign Up Now',
      }
    case 'form':
      return {
        title: 'Contact Us',
        subtitle: 'We\'d love to hear from you',
        buttonText: 'Send Message',
        items: [
          { type: 'text', label: 'Name', required: true },
          { type: 'email', label: 'Email', required: true },
          { type: 'textarea', label: 'Message', required: true },
        ],
      }
    case 'stats':
      return {
        title: 'Our Impact',
        items: [
          { value: '10K+', label: 'Active Users' },
          { value: '50+', label: 'Countries' },
          { value: '99%', label: 'Satisfaction' },
        ],
      }
    case 'testimonial':
      return {
        text: 'This product has completely transformed how we work. Highly recommended!',
        title: 'John Doe',
        subtitle: 'CEO, Company Inc.',
        imageUrl: 'https://i.pravatar.cc/150?img=1',
      }
    case 'spacer':
      return { items: [{ height: 40 }] }
    case 'divider':
      return { items: [{ style: 'solid' }] }
    default:
      return {}
  }
}

export function ComponentPalette() {
  const { addBlock } = useBuilderStore()

  const handleAddBlock = (type: BlockType) => {
    const newBlock: BlockComponent = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: getDefaultContent(type),
      styles: {
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: { top: 16, right: 16, bottom: 16, left: 16 },
        responsiveVisibility: { mobile: true, tablet: true, desktop: true },
      },
    }
    addBlock(newBlock)
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      <div className="space-y-2">
        {blockTemplates.map((template) => (
          <button
            key={template.type}
            onClick={() => handleAddBlock(template.type)}
            className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 hover:border-blue-300 transition-colors text-left"
          >
            <span className="text-2xl">{template.icon}</span>
            <span className="text-sm font-medium">{template.label}</span>
            <Plus className="w-4 h-4 ml-auto text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  )
}
