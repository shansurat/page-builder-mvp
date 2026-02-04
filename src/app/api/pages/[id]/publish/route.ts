import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const publishSchema = z.object({
  action: z.enum(['publish', 'unpublish']),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existingPage = await prisma.page.findUnique({
      where: { id },
    })

    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Check permissions - only admin or page author can publish
    if (session.user.role !== 'ADMIN' && existingPage.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if user has publish permission
    if (session.user.role === 'VISITOR') {
      return NextResponse.json({ error: 'Forbidden - no publish permission' }, { status: 403 })
    }

    const body = await request.json()
    const { action } = publishSchema.parse(body)

    const updateData: Record<string, unknown> = {}
    
    if (action === 'publish') {
      updateData.status = 'PUBLISHED'
      updateData.publishedAt = existingPage.publishedAt || new Date()
      updateData.scheduledFor = null
    } else {
      updateData.status = 'DRAFT'
      updateData.publishedAt = null
    }

    const page = await prisma.page.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: action === 'publish' ? 'published_page' : 'unpublished_page',
        resource: `page:${page.id}`,
        details: JSON.stringify({
          title: page.title,
          slug: page.slug,
          status: page.status,
        }),
      },
    })

    return NextResponse.json(page)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Error publishing/unpublishing page:', error)
    return NextResponse.json(
      { error: 'Failed to update page status' },
      { status: 500 }
    )
  }
}
