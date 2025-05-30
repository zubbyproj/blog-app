import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500 text-white">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-blue-100 transition-colors">
            Blog App
          </Link>
          <div className="flex gap-6 items-center">
            <Link 
              href="/" 
              className="text-sm font-medium text-blue-100 hover:text-white transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-blue-100 hover:text-white transition-colors relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
} 