'use client'

import { useState, useEffect } from 'react'
import { StatCard } from '@/components/analytics/StatCard'
import { ViewsChart } from '@/components/analytics/ViewsChart'
import { TopPages } from '@/components/analytics/TopPages'
import { DeviceChart } from '@/components/analytics/DeviceChart'
import { Button } from '@/components/ui/button'
import { Eye, Users, Clock, TrendingDown } from 'lucide-react'

interface AnalyticsData {
  summary: {
    totalViews: number
    uniqueVisitors: number
    avgDuration: number
    bounceRate: number
  }
  viewsChart: Array<{ date: string; views: number; uniqueVisitors: number }>
  topPages: Array<{
    pageId: string
    title: string
    slug: string
    views: number
    uniqueVisitors: number
  }>
  deviceBreakdown: Array<{ name: string; value: number }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(7)

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?days=${days}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${secs}s`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Failed to load analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your page performance and visitor insights</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={days === 7 ? 'default' : 'outline'} 
            onClick={() => setDays(7)}
          >
            Last 7 Days
          </Button>
          <Button 
            variant={days === 30 ? 'default' : 'outline'} 
            onClick={() => setDays(30)}
          >
            Last 30 Days
          </Button>
          <Button 
            variant={days === 90 ? 'default' : 'outline'} 
            onClick={() => setDays(90)}
          >
            Last 90 Days
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Views"
          value={data.summary.totalViews.toLocaleString()}
          icon={Eye}
        />
        <StatCard
          title="Unique Visitors"
          value={data.summary.uniqueVisitors.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="Avg. Duration"
          value={formatDuration(data.summary.avgDuration)}
          icon={Clock}
        />
        <StatCard
          title="Bounce Rate"
          value={`${data.summary.bounceRate.toFixed(1)}%`}
          icon={TrendingDown}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ViewsChart data={data.viewsChart} />
        </div>
        <div>
          <DeviceChart data={data.deviceBreakdown} />
        </div>
      </div>

      <TopPages pages={data.topPages} />
    </div>
  )
}
