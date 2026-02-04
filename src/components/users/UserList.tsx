'use client'

import { formatDistanceToNow } from 'date-fns'
import { Edit, Trash2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
  _count?: {
    pages: number
    mediaUploads: number
    sentMessages: number
  }
}

interface UserListProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (id: string) => void
  onEditPermissions: (user: User) => void
}

export function UserList({ users, onEdit, onDelete, onEditPermissions }: UserListProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-red-600">Admin</Badge>
      case 'MODERATOR':
        return <Badge className="bg-blue-600">Moderator</Badge>
      default:
        return <Badge variant="outline">Visitor</Badge>
    }
  }

  if (users.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200">
        <p className="text-gray-500">No users found</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.name || 'N/A'}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell className="text-sm text-gray-600">
                {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {user._count && (
                  <div className="space-y-1">
                    <div>{user._count.pages} pages</div>
                    <div>{user._count.mediaUploads} media</div>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditPermissions(user)}
                    title="Edit Permissions"
                  >
                    <Shield className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                    title="Edit User"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(user.id)}
                    title="Delete User"
                    className="hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
