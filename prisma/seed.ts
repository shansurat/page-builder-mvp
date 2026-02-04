import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo users
  const adminPassword = await bcrypt.hash('admin123', 12)
  const modPassword = await bcrypt.hash('mod123', 12)
  const visitorPassword = await bcrypt.hash('visitor123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const moderator = await prisma.user.upsert({
    where: { email: 'mod@example.com' },
    update: {},
    create: {
      email: 'mod@example.com',
      name: 'Moderator User',
      password: modPassword,
      role: 'MODERATOR',
    },
  })

  const visitor = await prisma.user.upsert({
    where: { email: 'visitor@example.com' },
    update: {},
    create: {
      email: 'visitor@example.com',
      name: 'Visitor User',
      password: visitorPassword,
      role: 'VISITOR',
    },
  })

  console.log('✅ Users created')

  // Create sample pages
  const landingPage = await prisma.page.create({
    data: {
      title: 'Welcome to Our Platform',
      slug: 'home',
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date(),
      seoTitle: 'Welcome to Our Platform - Page Builder',
      seoDescription: 'Build amazing pages with our intuitive drag-and-drop builder',
      content: JSON.stringify([
        {
          id: '1',
          type: 'hero',
          content: {
            heading: 'Build Beautiful Pages',
            subheading: 'Create stunning websites without code',
            buttonText: 'Get Started',
            buttonLink: '/register',
            backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
          },
          styles: { padding: { top: 80, bottom: 80 } },
        },
        {
          id: '2',
          type: 'features',
          content: {
            columns: 3,
            features: [
              { icon: 'Zap', title: 'Fast', description: 'Lightning-fast performance' },
              { icon: 'Lock', title: 'Secure', description: 'Enterprise-grade security' },
              { icon: 'Smartphone', title: 'Responsive', description: 'Works on all devices' },
            ],
          },
          styles: { padding: { top: 60, bottom: 60 } },
        },
      ]),
    },
  })

  const aboutPage = await prisma.page.create({
    data: {
      title: 'About Us',
      slug: 'about',
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date(),
      seoTitle: 'About Us - Learn More',
      seoDescription: 'Learn about our mission and team',
      content: JSON.stringify([
        {
          id: '1',
          type: 'text',
          content: {
            text: '<h1>About Our Company</h1><p>We are dedicated to helping you build amazing websites.</p>',
          },
          styles: { padding: { top: 40, bottom: 40 } },
        },
      ]),
    },
  })

  console.log('✅ Sample pages created')

  // Create sample analytics
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    await prisma.analytics.create({
      data: {
        pageId: landingPage.id,
        date,
        views: Math.floor(Math.random() * 100) + 50,
        uniqueVisitors: Math.floor(Math.random() * 80) + 30,
        bounceRate: Math.random() * 0.5 + 0.2,
        avgDuration: Math.floor(Math.random() * 200) + 60,
        deviceType: ['desktop', 'mobile', 'tablet'][i % 3],
        country: 'US',
      },
    })
  }

  console.log('✅ Sample analytics created')

  // Create sample messages
  await prisma.message.create({
    data: {
      senderId: moderator.id,
      recipientId: admin.id,
      subject: 'Welcome Message',
      content: 'Welcome to the platform! How can I help you today?',
      status: 'UNREAD',
    },
  })

  console.log('✅ Sample messages created')

  // Create sample notification
  await prisma.notification.create({
    data: {
      userId: admin.id,
      type: 'SYSTEM',
      title: 'Welcome!',
      content: 'Welcome to the Page Builder System',
      read: false,
    },
  })

  console.log('✅ Sample notifications created')

  // Create sample broadcast
  await prisma.broadcast.create({
    data: {
      message: 'System maintenance scheduled for this weekend',
      priority: 'INFO',
      sentById: admin.id,
    },
  })

  console.log('✅ Sample broadcast created')

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📧 Demo Accounts:')
  console.log('   Admin: admin@example.com / admin123')
  console.log('   Moderator: mod@example.com / mod123')
  console.log('   Visitor: visitor@example.com / visitor123')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
