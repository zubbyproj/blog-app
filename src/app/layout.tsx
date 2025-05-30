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
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-sky-50 to-cyan-50`}>
        <Header />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {children}
          </div>
        </div>
        <footer className="mt-12 bg-white bg-opacity-70 backdrop-blur-sm border-t border-sky-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-sky-600">
            <p>© {new Date().getFullYear()} Blog App. Built with Next.js</p>
          </div>
        </footer>
      </body>
    </html>
  )
} 