# Page Builder MVP

A comprehensive Next.js-based page builder system with drag-and-drop functionality, analytics, broadcasting, and user management.

## Features

### Core Functionality
- **Page Builder**: Drag-and-drop visual page editor with 12+ block types (Hero, Features, Text, Image, Gallery, Video, CTA, Form, Stats, Testimonial, Spacer, Divider)
- **User Management**: Role-based access control (Admin, Moderator, Visitor) with granular permissions
- **Media Library**: Upload and manage images, videos, and documents with folder organization
- **Messaging System**: Internal messaging with threading support
- **Analytics Dashboard**: Track page views, unique visitors, bounce rate, and device breakdown
- **Broadcast System**: Send system-wide announcements with priority levels
- **Settings**: User profile management, password changes, and preferences

### Analytics Dashboard
- Overview cards showing:
  - Total Views
  - Unique Visitors
  - Average Duration
  - Bounce Rate
- Interactive charts:
  - Page views over time (line chart)
  - Device breakdown (pie chart)
- Top performing pages table
- Date range filtering (7/30/90 days)

### Broadcast System
- Admin-only access for sending broadcasts
- Priority levels: INFO, WARNING, URGENT
- Target audience selection (All Users, Admins, Moderators, Visitors)
- Automatic notification creation for recipients
- Broadcast history with timestamps

### Public Page Viewer
- SEO-optimized server-side rendering
- Meta tags (title, description, keywords, OpenGraph)
- Clean public layout separate from dashboard
- Analytics tracking on page views
- 404 handling for unpublished pages

### Settings Page
- Profile management (name, email)
- Password changes with current password verification
- Theme selector (placeholder for future implementation)
- Language selector (English/Arabic placeholder)
- Admin-only system settings section

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **UI Components**: Custom components with Tailwind CSS
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **Styling**: Tailwind CSS
- **TypeScript**: Strict typing throughout

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication pages (login, register)
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── analytics/       # Analytics dashboard
│   │   ├── broadcasts/      # Broadcast management
│   │   ├── builder/         # Page builder editor
│   │   ├── dashboard/       # Main dashboard
│   │   ├── media/           # Media library
│   │   ├── messages/        # Messaging system
│   │   ├── pages/           # Page management
│   │   ├── settings/        # User settings
│   │   └── users/           # User management
│   ├── [slug]/              # Public page viewer
│   └── api/                 # API routes
│       ├── analytics/       # Analytics API
│       ├── broadcasts/      # Broadcasts API
│       ├── media/           # Media API
│       ├── messages/        # Messages API
│       ├── pages/           # Pages API
│       └── users/           # Users API
├── components/
│   ├── analytics/           # Analytics components
│   ├── broadcasts/          # Broadcast components
│   ├── builder/             # Page builder components
│   ├── media/               # Media components
│   ├── messages/            # Message components
│   ├── pages/               # Page components
│   ├── shared/              # Shared components (Sidebar, TopBar)
│   └── ui/                  # Base UI components
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── db.ts                # Prisma client
│   └── permissions.ts       # Permission utilities
└── types/
    └── index.ts             # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd page-builder-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## API Routes

### Analytics
- `GET /api/analytics?days=7` - Fetch analytics data
- `POST /api/analytics/track` - Track page view

### Broadcasts
- `GET /api/broadcasts` - Fetch broadcasts
- `POST /api/broadcasts` - Send broadcast (Admin only)

### Pages
- `GET /api/pages` - List pages
- `POST /api/pages` - Create page
- `GET /api/pages/[id]` - Get page details
- `PUT /api/pages/[id]` - Update page
- `DELETE /api/pages/[id]` - Delete page
- `POST /api/pages/[id]/publish` - Publish page
- `POST /api/pages/[id]/duplicate` - Duplicate page
- `GET /api/pages/[id]/versions` - Get page versions

### Users
- `GET /api/users` - List users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user (Admin only)

### Media
- `GET /api/media` - List media files
- `POST /api/media` - Upload media
- `DELETE /api/media/[id]` - Delete media

### Messages
- `GET /api/messages` - List messages
- `POST /api/messages` - Send message
- `GET /api/messages/[id]` - Get message details
- `POST /api/messages/[id]/reply` - Reply to message
- `PATCH /api/messages/[id]` - Update message status

## Database Schema

### Core Models
- **User**: User accounts with roles and permissions
- **Page**: Published pages with SEO metadata
- **Media**: Uploaded media files
- **Message**: Internal messaging
- **Notification**: User notifications
- **Broadcast**: System-wide announcements
- **Analytics**: Page view analytics
- **AuditLog**: User action tracking
- **Permission**: Granular user permissions
- **PageVersion**: Page version history

## Authentication & Authorization

### Roles
- **ADMIN**: Full system access
- **MODERATOR**: Content management access
- **VISITOR**: Limited read-only access

### Protected Routes
All routes under `/` (dashboard) require authentication. Role-based access control is enforced at both the API and UI levels.

## Security Features

- Password hashing with bcrypt
- JWT-based session management
- CSRF protection
- Role-based access control
- Audit logging for sensitive operations
- Current password verification for password changes

## Development

### Code Style
- TypeScript strict mode enabled
- No `any` types allowed
- ESLint configuration for code quality
- Consistent file naming conventions

### Testing
```bash
npm run test      # Run tests
npm run lint      # Run linter
```

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
