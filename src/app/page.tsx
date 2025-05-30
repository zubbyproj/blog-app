import BlogPost from '../components/BlogPost'
import Link from 'next/link'
import { getPaginatedPosts } from './lib/posts'

export const dynamic = 'force-dynamic'

interface HomeProps {
  searchParams: { page?: string }
}

export default async function Home({ searchParams }: HomeProps) {
  const page = Number(searchParams.page) || 1
  const { posts, totalPages, currentPage } = await getPaginatedPosts(page)

  return (
    <main className="py-12">
      <section className="mb-16 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Content */}
        <div className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
            
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 mb-6 tracking-tight">
              Welcome to My Blog
              <span className="block text-2xl mt-3 bg-gradient-to-r from-blue-500 to-teal-400">
                Thoughts, Stories & Ideas
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto mt-8 relative">
              <span className="absolute -left-4 -top-4 text-4xl text-indigo-200 opacity-50">"</span>
              Explore my thoughts and insights on web development, technology, and programming.
              Here you'll find in-depth articles about Next.js, React, and modern web development practices.
              <span className="absolute -right-4 -bottom-4 text-4xl text-indigo-200 opacity-50">"</span>
            </p>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogPost key={post.slug} {...post} />
        ))}
      </div>
      
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href={`/?page=${currentPage - 1}`}
          className={`px-4 py-2 rounded ${
            currentPage <= 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          aria-disabled={currentPage <= 1}
        >
          Previous
        </Link>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Link
            key={pageNum}
            href={`/?page=${pageNum}`}
            className={`px-4 py-2 rounded ${
              pageNum === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {pageNum}
          </Link>
        ))}
        
        <Link
          href={`/?page=${currentPage + 1}`}
          className={`px-4 py-2 rounded ${
            currentPage >= totalPages
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          aria-disabled={currentPage >= totalPages}
        >
          Next
        </Link>
      </div>
    </main>
  )
} 