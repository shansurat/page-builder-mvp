import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Image, MessageSquare, Users } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const stats = [
    {
      title: 'Total Pages',
      value: '0',
      description: 'Pages created',
      icon: FileText,
    },
    {
      title: 'Media Files',
      value: '0',
      description: 'Files uploaded',
      icon: Image,
    },
    {
      title: 'Messages',
      value: '0',
      description: 'Unread messages',
      icon: MessageSquare,
    },
    {
      title: 'Users',
      value: '1',
      description: 'Total users',
      icon: Users,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back, {session?.user?.name}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              No recent activity yet.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-500">
              • Create new page
            </p>
            <p className="text-sm text-gray-500">
              • Upload media
            </p>
            <p className="text-sm text-gray-500">
              • Send message
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
