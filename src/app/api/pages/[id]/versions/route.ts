import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

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
      select: { id: true, authorId: true },
    })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Check permissions
    if (session.user.role !== 'ADMIN' && page.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const versions = await prisma.pageVersion.findMany({
      where: { pageId: id },
      orderBy: { version: 'desc' },
    })

    return NextResponse.json({ versions })
  } catch (error) {
    console.error('Error fetching page versions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page versions' },
      { status: 500 }
    )
  }
}
