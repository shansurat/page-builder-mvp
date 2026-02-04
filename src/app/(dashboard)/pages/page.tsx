import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PageList } from '@/components/pages/PageList'

export default async function PagesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; status?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const page = parseInt(searchParams.page || '1')
  const search = searchParams.search || ''
  const status = searchParams.status || ''

  const params = new URLSearchParams({
    page: page.toString(),
    limit: '10',
    ...(search && { search }),
    ...(status && { status }),
  })

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/pages?${params}`, {
    headers: {
      Cookie: `next-auth.session-token=${session}`,
    },
    cache: 'no-store',
  })

  let pages = []
  let pagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  }

  if (response.ok) {
    const data = await response.json()
    pages = data.pages
    pagination = data.pagination
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
        <p className="text-gray-500 mt-1">Manage your website pages</p>
      </div>

      <PageList initialPages={pages} initialPagination={pagination} />
    </div>
  )
}
