import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const permissionSchema = z.object({
  resource: z.string().min(1),
  action: z.string().min(1),
  granted: z.boolean(),
})

const updatePermissionsSchema = z.object({
  permissions: z.array(permissionSchema),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only ADMIN can view permissions
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const permissions = await prisma.permission.findMany({
      where: { userId: params.id },
      orderBy: [
        { resource: 'asc' },
        { action: 'asc' },
      ],
    })

    return NextResponse.json(permissions)
  } catch (error) {
    console.error('Error fetching permissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only ADMIN can update permissions
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updatePermissionsSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete existing permissions and create new ones
    await prisma.permission.deleteMany({
      where: { userId: params.id },
    })

    const permissions = await prisma.permission.createMany({
      data: validatedData.permissions.map(p => ({
        userId: params.id,
        resource: p.resource,
        action: p.action,
        granted: p.granted,
      })),
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'updated_permissions',
        resource: `user:${params.id}`,
        details: JSON.stringify({
          permissions: validatedData.permissions,
        }),
      },
    })

    return NextResponse.json({ success: true, count: permissions.count })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Error updating permissions:', error)
    return NextResponse.json(
      { error: 'Failed to update permissions' },
      { status: 500 }
    )
  }
}
