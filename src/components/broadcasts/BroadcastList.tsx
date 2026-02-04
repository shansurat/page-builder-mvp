import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface Broadcast {
  id: string
  message: string
  priority: 'INFO' | 'WARNING' | 'URGENT'
  targetRole: string | null
  createdAt: Date
  sentBy: {
    id: string
    name: string | null
    email: string
  }
}

interface BroadcastListProps {
  broadcasts: Broadcast[]
}

export function BroadcastList({ broadcasts }: BroadcastListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'INFO':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
      case 'WARNING':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
      case 'URGENT':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Broadcast History</h2>
      <div className="space-y-3">
        {broadcasts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No broadcasts sent yet</p>
        ) : (
          broadcasts.map((broadcast) => (
            <div key={broadcast.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getPriorityColor(broadcast.priority)}>
                      {broadcast.priority}
                    </Badge>
                    {broadcast.targetRole && (
                      <Badge variant="outline">{broadcast.targetRole}</Badge>
                    )}
                    {!broadcast.targetRole && (
                      <Badge variant="outline">All Users</Badge>
                    )}
                  </div>
                  <p className="text-sm">{broadcast.message}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <span>
                  Sent by {broadcast.sentBy.name || broadcast.sentBy.email}
                </span>
                <span>
                  {formatDistanceToNow(new Date(broadcast.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
