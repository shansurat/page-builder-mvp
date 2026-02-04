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

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    const pageId = searchParams.get('pageId')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const where = {
      date: { gte: startDate },
      ...(pageId ? { pageId } : {}),
    }

    const analytics = await prisma.analytics.findMany({
      where,
      include: {
        page: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    })

    const totalViews = analytics.reduce((sum, a) => sum + a.views, 0)
    const totalUniqueVisitors = analytics.reduce((sum, a) => sum + a.uniqueVisitors, 0)
    const avgDuration = analytics.reduce((sum, a) => sum + (a.avgDuration || 0), 0) / (analytics.length || 1)
    const avgBounceRate = analytics.reduce((sum, a) => sum + (a.bounceRate || 0), 0) / (analytics.length || 1)

    const viewsByDate = analytics.reduce((acc, item) => {
      const dateKey = item.date.toISOString().split('T')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, views: 0, uniqueVisitors: 0 }
      }
      acc[dateKey].views += item.views
      acc[dateKey].uniqueVisitors += item.uniqueVisitors
      return acc
    }, {} as Record<string, { date: string; views: number; uniqueVisitors: number }>)

    const viewsChart = Object.values(viewsByDate)

    const pageStats = analytics.reduce((acc, item) => {
      const pageKey = item.pageId
      if (!acc[pageKey]) {
        acc[pageKey] = {
          pageId: item.pageId,
          title: item.page.title,
          slug: item.page.slug,
          views: 0,
          uniqueVisitors: 0,
        }
      }
      acc[pageKey].views += item.views
      acc[pageKey].uniqueVisitors += item.uniqueVisitors
      return acc
    }, {} as Record<string, { pageId: string; title: string; slug: string; views: number; uniqueVisitors: number }>)

    const topPages = Object.values(pageStats).sort((a, b) => b.views - a.views).slice(0, 10)

    const deviceStats = analytics.reduce((acc, item) => {
      if (item.deviceType) {
        acc[item.deviceType] = (acc[item.deviceType] || 0) + item.views
      }
      return acc
    }, {} as Record<string, number>)

    const deviceBreakdown = Object.entries(deviceStats).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }))

    return NextResponse.json({
      summary: {
        totalViews,
        uniqueVisitors: totalUniqueVisitors,
        avgDuration: Math.round(avgDuration),
        bounceRate: Math.round(avgBounceRate * 100) / 100,
      },
      viewsChart,
      topPages,
      deviceBreakdown,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
