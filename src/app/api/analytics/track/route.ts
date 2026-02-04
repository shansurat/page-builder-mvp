import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pageId, deviceType, duration, bounced } = body

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    const page = await prisma.page.findUnique({
      where: { id: pageId },
    })

    if (!page || page.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const analytics = await prisma.analytics.upsert({
      where: {
        pageId_date: {
          pageId,
          date: today,
        },
      },
      update: {
        views: { increment: 1 },
        uniqueVisitors: { increment: 1 },
        avgDuration: duration ? Math.round(duration) : undefined,
        bounceRate: bounced !== undefined ? (bounced ? 1 : 0) : undefined,
        deviceType: deviceType || 'desktop',
      },
      create: {
        pageId,
        date: today,
        views: 1,
        uniqueVisitors: 1,
        avgDuration: duration ? Math.round(duration) : 0,
        bounceRate: bounced ? 1 : 0,
        deviceType: deviceType || 'desktop',
      },
    })

    return NextResponse.json({ success: true, analytics })
  } catch (error) {
    console.error('Error tracking analytics:', error)
    return NextResponse.json({ error: 'Failed to track analytics' }, { status: 500 })
  }
}
