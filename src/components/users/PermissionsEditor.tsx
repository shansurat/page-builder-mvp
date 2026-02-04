'use client'

import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface Permission {
  id?: string
  resource: string
  action: string
  granted: boolean
}

interface User {
  id: string
  email: string
  name: string | null
}

interface PermissionsEditorProps {
  user: User
  onSave: () => void
  onCancel: () => void
}

const AVAILABLE_PERMISSIONS = [
  { resource: 'page', action: 'create', label: 'Create Pages' },
  { resource: 'page', action: 'edit', label: 'Edit Pages' },
  { resource: 'page', action: 'delete', label: 'Delete Pages' },
  { resource: 'page', action: 'publish', label: 'Publish Pages' },
  { resource: 'media', action: 'upload', label: 'Upload Media' },
  { resource: 'media', action: 'delete', label: 'Delete Media' },
  { resource: 'message', action: 'send', label: 'Send Messages' },
  { resource: 'user', action: 'view', label: 'View Users' },
  { resource: 'user', action: 'edit', label: 'Edit Users' },
  { resource: 'settings', action: 'edit', label: 'Edit Settings' },
]

export function PermissionsEditor({ user, onSave, onCancel }: PermissionsEditorProps) {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPermissions()
  }, [])

  const fetchPermissions = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}/permissions`)
      if (response.ok) {
        const data = await response.json()
        const existingPerms = new Map(
          data.map((p: Permission) => [`${p.resource}:${p.action}`, p.granted])
        )

        const allPermissions = AVAILABLE_PERMISSIONS.map((p) => ({
          resource: p.resource,
          action: p.action,
          granted: existingPerms.get(`${p.resource}:${p.action}`) || false,
        }))

        setPermissions(allPermissions)
      }
    } catch (error) {
      console.error('Error fetching permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePermission = (resource: string, action: string) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.resource === resource && p.action === action
          ? { ...p, granted: !p.granted }
          : p
      )
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${user.id}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permissions: permissions.filter(p => p.granted),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update permissions')
      }

      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update permissions')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Edit Permissions</h3>
          <p className="text-sm text-gray-600">
            {user.name || user.email}
          </p>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">Loading permissions...</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {AVAILABLE_PERMISSIONS.map((perm) => {
              const permission = permissions.find(
                (p) => p.resource === perm.resource && p.action === perm.action
              )
              const isGranted = permission?.granted || false

              return (
                <div
                  key={`${perm.resource}:${perm.action}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                >
                  <Label htmlFor={`${perm.resource}-${perm.action}`}>
                    {perm.label}
                  </Label>
                  <button
                    type="button"
                    id={`${perm.resource}-${perm.action}`}
                    onClick={() => togglePermission(perm.resource, perm.action)}
                    className={`flex h-6 w-6 items-center justify-center rounded border-2 transition-colors ${
                      isGranted
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isGranted && <Check className="h-4 w-4" />}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Permissions'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
