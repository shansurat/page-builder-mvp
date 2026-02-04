import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const broadcasts = await prisma.broadcast.findMany({
      include: {
        sentBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(broadcasts)
  } catch (error) {
    console.error('Error fetching broadcasts:', error)
    return NextResponse.json({ error: 'Failed to fetch broadcasts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { message, priority, targetRole } = body

    if (!message || !priority) {
      return NextResponse.json({ error: 'Message and priority are required' }, { status: 400 })
    }

    if (!['INFO', 'WARNING', 'URGENT'].includes(priority)) {
      return NextResponse.json({ error: 'Invalid priority' }, { status: 400 })
    }

    const broadcast = await prisma.broadcast.create({
      data: {
        message,
        priority,
        targetRole: targetRole || null,
        sentById: session.user.id,
      },
    })

    const whereClause = targetRole ? { role: targetRole } : {}
    const targetUsers = await prisma.user.findMany({
      where: whereClause,
      select: { id: true },
    })

    const notifications = targetUsers.map((user) => ({
      userId: user.id,
      type: 'BROADCAST' as const,
      title: `${priority} Broadcast`,
      content: message,
      link: '/broadcasts',
    }))

    await prisma.notification.createMany({
      data: notifications,
    })

    return NextResponse.json(broadcast)
  } catch (error) {
    console.error('Error creating broadcast:', error)
    return NextResponse.json({ error: 'Failed to create broadcast' }, { status: 500 })
  }
}
