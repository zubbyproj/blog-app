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