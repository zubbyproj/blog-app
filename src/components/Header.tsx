import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600">
            Blog App
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            {/* Add more navigation items here as needed */}
          </div>
        </nav>
      </div>
    </header>
  )
} 