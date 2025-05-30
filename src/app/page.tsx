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
        <div className="absolute inset-0 bg-white bg-opacity-40 backdrop-blur-sm rounded-3xl">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Content */}
        <div className="relative py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-6 tracking-tight">
              Welcome to My Blog
              <span className="block text-2xl mt-3 text-sky-500">
                Thoughts, Stories & Ideas
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mt-8 relative">
              <span className="absolute -left-4 -top-4 text-4xl text-sky-200 opacity-50">"</span>
              Explore my thoughts and insights on web development, technology, and programming.
              Here you'll find in-depth articles about Next.js, React, and modern web development practices.
              <span className="absolute -right-4 -bottom-4 text-4xl text-sky-200 opacity-50">"</span>
            </p>
          </div>
        </div>
      </section>

      {/* Blog posts grid with proper centering */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-8">
          {posts.map((post) => (
            <div key={post.slug} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]">
              <BlogPost {...post} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination with updated styling */}
      <div className="mt-12 flex justify-center gap-3">
        <Link
          href={`/?page=${currentPage - 1}`}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage <= 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-sky-50 text-sky-600 border border-sky-100'
          }`}
          aria-disabled={currentPage <= 1}
        >
          Previous
        </Link>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Link
            key={pageNum}
            href={`/?page=${pageNum}`}
            className={`px-4 py-2 rounded-lg transition-colors ${
              pageNum === currentPage
                ? 'bg-sky-100 text-sky-600 border border-sky-200'
                : 'bg-white hover:bg-sky-50 text-sky-600 border border-sky-100'
            }`}
          >
            {pageNum}
          </Link>
        ))}
        
        <Link
          href={`/?page=${currentPage + 1}`}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage >= totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-sky-50 text-sky-600 border border-sky-100'
          }`}
          aria-disabled={currentPage >= totalPages}
        >
          Next
        </Link>
      </div>
    </main>
  )
} 