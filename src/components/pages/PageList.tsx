'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

interface Page {
  id: string
  title: string
  slug: string
  status: string
  author: {
    id: string
    name: string | null
    email: string
  }
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

interface PageListProps {
  initialPages: Page[]
  initialPagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function PageList({ initialPages, initialPagination }: PageListProps) {
  const router = useRouter()
  const [pages, setPages] = useState(initialPages)
  const [pagination, setPagination] = useState(initialPagination)
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null)
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
  })

  useEffect(() => {
    fetchPages()
  }, [filters.page, filters.status, filters.search])

  const fetchPages = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: '10',
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
      })

      const response = await fetch(`/api/pages?${params}`)
      const data = await response.json()

      if (response.ok) {
        setPages(data.pages)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setFilters({ ...filters, page: 1 })
    fetchPages()
  }

  const handleDelete = async () => {
    if (!pageToDelete) return

    try {
      const response = await fetch(`/api/pages/${pageToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDeleteDialogOpen(false)
        setPageToDelete(null)
        fetchPages()
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting page:', error)
    }
  }

  const handleDuplicate = async (pageId: string) => {
    try {
      const response = await fetch(`/api/pages/${pageId}/duplicate`, {
        method: 'POST',
      })

      if (response.ok) {
        fetchPages()
        router.refresh()
      }
    } catch (error) {
      console.error('Error duplicating page:', error)
    }
  }

  const handlePublishToggle = async (page: Page) => {
    try {
      const action = page.status === 'PUBLISHED' ? 'unpublish' : 'publish'
      const response = await fetch(`/api/pages/${page.id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        fetchPages()
        router.refresh()
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge variant="success">Published</Badge>
      case 'DRAFT':
        return <Badge variant="secondary">Draft</Badge>
      case 'SCHEDULED':
        return <Badge variant="warning">Scheduled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search pages..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="max-w-sm"
        />
        
        <Select
          value={filters.status}
          onChange={(e) => {
            setFilters({ ...filters, status: e.target.value, page: 1 })
          }}
          className="max-w-xs"
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="SCHEDULED">Scheduled</option>
        </Select>

        <Button onClick={handleSearch} disabled={loading}>
          Search
        </Button>

        <Button onClick={() => router.push('/pages/new')} className="ml-auto">
          Create Page
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No pages found
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-gray-500">{page.slug}</TableCell>
                  <TableCell>{getStatusBadge(page.status)}</TableCell>
                  <TableCell>{page.author.name || page.author.email}</TableCell>
                  <TableCell>{formatDate(page.publishedAt)}</TableCell>
                  <TableCell>{formatDate(page.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/pages/${page.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDuplicate(page.id)}
                      >
                        Duplicate
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePublishToggle(page)}
                      >
                        {page.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPageToDelete(page)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </p>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilters({ ...filters, page: filters.page - 1 })
              }}
              disabled={pagination.page === 1 || loading}
            >
              Previous
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilters({ ...filters, page: filters.page + 1 })
              }}
              disabled={pagination.page === pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Page</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{pageToDelete?.title}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
