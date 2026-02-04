import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PageForm } from '@/components/pages/PageForm'

export default async function NewPagePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (session.user.role === 'VISITOR') {
    redirect('/pages')
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Page</h1>
        <p className="text-gray-500 mt-1">Create a new page for your website</p>
      </div>

      <PageForm mode="create" />
    </div>
  )
}
