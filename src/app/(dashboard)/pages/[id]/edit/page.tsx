import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PageForm } from '@/components/pages/PageForm'

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const { id } = await params

  const page = await prisma.page.findUnique({
    where: { id },
  })

  if (!page) {
    notFound()
  }

  if (session.user.role !== 'ADMIN' && page.authorId !== session.user.id) {
    redirect('/pages')
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Page</h1>
        <p className="text-gray-500 mt-1">Update page information</p>
      </div>

      <PageForm mode="edit" page={page} />
    </div>
  )
}
