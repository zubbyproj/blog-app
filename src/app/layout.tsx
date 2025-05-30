import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blog App',
  description: 'A Next.js blog application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-gray-50">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <div className="flex-1 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            {children}
          </div>
        </div>
        <footer className="bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500 text-white py-8">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>© {new Date().getFullYear()} Blog App. Built with Next.js</p>
          </div>
        </footer>
      </body>
    </html>
  )
} 