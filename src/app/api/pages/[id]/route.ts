import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updatePageSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only').optional(),
  content: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).optional(),
  scheduledFor: z.string().nullable().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const page = await prisma.page.findUnique({
      where: { id },
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

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Non-admin users can only view their own pages
    if (session.user.role !== 'ADMIN' && page.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    // Check permissions
    if (session.user.role !== 'ADMIN' && existingPage.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updatePageSchema.parse(body)

    // Check slug uniqueness if slug is being updated
    if (validatedData.slug && validatedData.slug !== existingPage.slug) {
      const slugExists = await prisma.page.findUnique({
        where: { slug: validatedData.slug },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'A page with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Update page
    const updateData: Record<string, unknown> = {}
    
    if (validatedData.title) updateData.title = validatedData.title
    if (validatedData.slug) updateData.slug = validatedData.slug
    if (validatedData.content !== undefined) updateData.content = validatedData.content
    if (validatedData.seoTitle !== undefined) updateData.seoTitle = validatedData.seoTitle
    if (validatedData.seoDescription !== undefined) updateData.seoDescription = validatedData.seoDescription
    if (validatedData.seoKeywords !== undefined) updateData.seoKeywords = validatedData.seoKeywords
    if (validatedData.status) {
      updateData.status = validatedData.status
      if (validatedData.status === 'PUBLISHED' && !existingPage.publishedAt) {
        updateData.publishedAt = new Date()
      }
    }
    if (validatedData.scheduledFor !== undefined) {
      updateData.scheduledFor = validatedData.scheduledFor ? new Date(validatedData.scheduledFor) : null
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

    // Create new version if content changed
    if (validatedData.content !== undefined) {
      const lastVersion = await prisma.pageVersion.findFirst({
        where: { pageId: id },
        orderBy: { version: 'desc' },
      })

      await prisma.pageVersion.create({
        data: {
          pageId: id,
          content: validatedData.content,
          version: (lastVersion?.version || 0) + 1,
        },
      })
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'updated_page',
        resource: `page:${page.id}`,
        details: JSON.stringify({
          title: page.title,
          slug: page.slug,
          changes: Object.keys(validatedData),
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
    
    console.error('Error updating page:', error)
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Check permissions
    if (session.user.role !== 'ADMIN' && existingPage.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.page.delete({
      where: { id },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'deleted_page',
        resource: `page:${id}`,
        details: JSON.stringify({
          title: existingPage.title,
          slug: existingPage.slug,
        }),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    )
  }
}
