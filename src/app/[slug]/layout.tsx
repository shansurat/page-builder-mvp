import { ReactNode } from 'react'
import Link from 'next/link'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Page Builder
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm hover:text-primary transition-colors">
              Login
            </Link>
            <Link href="/register" className="text-sm hover:text-primary transition-colors">
              Register
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t bg-muted/30 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Page Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
