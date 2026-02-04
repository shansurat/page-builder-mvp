'use client'

import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ViewsChartProps {
  data: Array<{
    date: string
    views: number
    uniqueVisitors: number
  }>
}

export function ViewsChart({ data }: ViewsChartProps) {
  const formattedData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Views: item.views,
    'Unique Visitors': item.uniqueVisitors,
  }))

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Page Views Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Views" stroke="#8b5cf6" strokeWidth={2} />
          <Line type="monotone" dataKey="Unique Visitors" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
