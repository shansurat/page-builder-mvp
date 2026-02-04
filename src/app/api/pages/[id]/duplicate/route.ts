import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (session.user.role === 'VISITOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const originalPage = await prisma.page.findUnique({
      where: { id },
    })

    if (!originalPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Generate unique slug for duplicate
    let newSlug = `${originalPage.slug}-copy`
    let counter = 1
    
    while (await prisma.page.findUnique({ where: { slug: newSlug } })) {
      counter++
      newSlug = `${originalPage.slug}-copy-${counter}`
    }

    // Create duplicate page
    const duplicatePage = await prisma.page.create({
      data: {
        title: `${originalPage.title} (Copy)`,
        slug: newSlug,
        content: originalPage.content,
        seoTitle: originalPage.seoTitle,
        seoDescription: originalPage.seoDescription,
        seoKeywords: originalPage.seoKeywords,
        status: 'DRAFT',
        authorId: session.user.id,
      },
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

    // Create initial version for duplicate
    await prisma.pageVersion.create({
      data: {
        pageId: duplicatePage.id,
        content: originalPage.content,
        version: 1,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'duplicated_page',
        resource: `page:${duplicatePage.id}`,
        details: JSON.stringify({
          originalPageId: originalPage.id,
          originalTitle: originalPage.title,
          newTitle: duplicatePage.title,
          newSlug: duplicatePage.slug,
        }),
      },
    })

    return NextResponse.json(duplicatePage, { status: 201 })
  } catch (error) {
    console.error('Error duplicating page:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate page' },
      { status: 500 }
    )
  }
}
