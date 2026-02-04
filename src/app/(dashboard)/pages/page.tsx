import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PageList } from '@/components/pages/PageList'
import { prisma } from '@/lib/db'

export default async function PagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 10
  const search = params.search || ''
  const status = params.status || ''

  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}
  
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { slug: { contains: search } },
    ]
  }
  
  if (status) {
    where.status = status
  }

  // Non-admin users can only see their own pages
  if (session.user.role !== 'ADMIN') {
    where.authorId = session.user.id
  }

  const [pages, total] = await Promise.all([
    prisma.page.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.page.count({ where }),
  ])

  const pagination = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
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
