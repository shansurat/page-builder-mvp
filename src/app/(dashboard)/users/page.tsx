'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserList } from '@/components/users/UserList'
import { UserForm } from '@/components/users/UserForm'
import { PermissionsEditor } from '@/components/users/PermissionsEditor'

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

export default function UsersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'permissions' | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchUsers()
  }, [session, search, roleFilter])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (roleFilter !== 'all') params.append('role', roleFilter)

      const response = await fetch(`/api/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== id))
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleSave = () => {
    setDialogMode(null)
    setSelectedUser(null)
    fetchUsers()
  }

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">
            Manage users, roles, and permissions
          </p>
        </div>
        <Button onClick={() => setDialogMode('create')}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MODERATOR">Moderator</SelectItem>
            <SelectItem value="VISITOR">Visitor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">Loading users...</p>
        </div>
      ) : (
        <UserList
          users={users}
          onEdit={(user) => {
            setSelectedUser(user)
            setDialogMode('edit')
          }}
          onDelete={handleDelete}
          onEditPermissions={(user) => {
            setSelectedUser(user)
            setDialogMode('permissions')
          }}
        />
      )}

      <Dialog
        open={dialogMode === 'create' || dialogMode === 'edit'}
        onOpenChange={(open) => {
          if (!open) {
            setDialogMode(null)
            setSelectedUser(null)
          }
        }}
      >
        <DialogContent>
          <UserForm
            user={selectedUser || undefined}
            onSave={handleSave}
            onCancel={() => {
              setDialogMode(null)
              setSelectedUser(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogMode === 'permissions'}
        onOpenChange={(open) => {
          if (!open) {
            setDialogMode(null)
            setSelectedUser(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          {selectedUser && (
            <PermissionsEditor
              user={selectedUser}
              onSave={handleSave}
              onCancel={() => {
                setDialogMode(null)
                setSelectedUser(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
