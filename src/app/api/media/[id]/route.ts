import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { unlink } from 'fs/promises'
import { join } from 'path'

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

    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    return NextResponse.json(media)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
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

    const body = await request.json()
    const { filename, folder, tags } = body
    const { id } = await params

    const media = await prisma.media.findUnique({
      where: { id },
    })

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Check permissions
    if (session.user.role !== 'ADMIN' && media.uploadedById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedMedia = await prisma.media.update({
      where: { id },
      data: {
        filename: filename || media.filename,
        folder: folder !== undefined ? folder : media.folder,
        tags: tags !== undefined ? JSON.stringify(tags) : media.tags,
      },
      include: {
        uploadedBy: {
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
        action: 'updated_media',
        resource: `media:${id}`,
        details: JSON.stringify({
          filename,
          folder,
          tags,
        }),
      },
    })

    return NextResponse.json(updatedMedia)
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json(
      { error: 'Failed to update media' },
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

    const media = await prisma.media.findUnique({
      where: { id },
    })

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Check permissions
    if (session.user.role !== 'ADMIN' && media.uploadedById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete file from disk
    try {
      const filePath = join(process.cwd(), 'public', media.url)
      await unlink(filePath)
    } catch (error) {
      console.error('Error deleting file:', error)
    }

    // Delete from database
    await prisma.media.delete({
      where: { id },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'deleted_media',
        resource: `media:${id}`,
        details: JSON.stringify({
          filename: media.filename,
          url: media.url,
        }),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}
