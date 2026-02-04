'use client'

import { Card } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface DeviceChartProps {
  data: Array<{
    name: string
    value: number
  }>
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export function DeviceChart({ data }: DeviceChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
