import Link from 'next/link'
import Image from 'next/image'

interface BlogPostProps {
  title: string
  date: string
  excerpt: string
  slug: string
  imageUrl: string
}

export default function BlogPost({ title, date, excerpt, slug, imageUrl }: BlogPostProps) {
  return (
    <article className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative w-full h-56">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
      </div>
      
      <div className="relative p-6">
        <time className="text-xs font-medium text-indigo-500 mb-2 block">
          {date}
        </time>
        
        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
          {title}
        </h2>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {excerpt}
        </p>

        <Link
          href={`/posts/${slug}`}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Read more
          <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </article>
  )
} 