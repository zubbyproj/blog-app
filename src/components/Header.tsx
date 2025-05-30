import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white bg-opacity-70 backdrop-blur-sm border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-sky-600 hover:text-sky-700 transition-colors">
            Blog App
          </Link>
          <div className="flex gap-8 items-center">
            <Link 
              href="/" 
              className="text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors relative group py-1"
            >
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors relative group py-1"
            >
              About
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
} 