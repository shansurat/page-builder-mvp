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

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        replies: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Check permissions
    if (message.senderId !== session.user.id && message.recipientId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Mark as read if user is the recipient
    if (message.recipientId === session.user.id && message.status === 'UNREAD') {
      await prisma.message.update({
        where: { id },
        data: {
          status: 'READ',
          readAt: new Date(),
        },
      })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error fetching message:', error)
    return NextResponse.json(
      { error: 'Failed to fetch message' },
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
    const { status } = body
    const { id } = await params

    const message = await prisma.message.findUnique({
      where: { id },
    })

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Only recipient can update status
    if (message.recipientId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        status,
        readAt: status === 'READ' ? new Date() : message.readAt,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(updatedMessage)
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}
