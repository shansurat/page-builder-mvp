import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const replySchema = z.object({
  content: z.string().min(1, 'Content is required'),
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

    const body = await request.json()
    const validatedData = replySchema.parse(body)
    const { id } = await params

    // Get parent message
    const parentMessage = await prisma.message.findUnique({
      where: { id },
    })

    if (!parentMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Check permissions
    if (parentMessage.senderId !== session.user.id && parentMessage.recipientId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Determine recipient (reply to sender)
    const recipientId = parentMessage.senderId === session.user.id 
      ? parentMessage.recipientId 
      : parentMessage.senderId

    const reply = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId,
        subject: `Re: ${parentMessage.subject}`,
        content: validatedData.content,
        status: 'UNREAD',
        parentId: id,
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

    // Create notification for recipient
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'MESSAGE',
        title: 'New Reply',
        content: `${session.user.name || session.user.email} replied to your message: ${parentMessage.subject}`,
        link: `/messages?id=${id}`,
      },
    })

    return NextResponse.json(reply, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Error creating reply:', error)
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    )
  }
}
