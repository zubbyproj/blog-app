import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface BlogPostProps {
  title: string
  date: string
  excerpt: string
  slug: string
  imageUrl: string
}

export default function BlogPost({ title, date, excerpt, slug, imageUrl }: BlogPostProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <article className="group bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-sky-100">
      <div className="relative w-full h-56">
        <Image
          src={imageError ? 'https://source.unsplash.com/800x600/?coding' : imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageError(true)}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
      </div>
      
      <div className="relative p-6">
        <time className="text-xs font-medium text-sky-500 mb-2 block">
          {date}
        </time>
        
        <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-sky-600 transition-colors">
          {title}
        </h2>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {excerpt}
        </p>

        <Link
          href={`/posts/${slug}`}
          className="inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
        >
          Read more
          <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  )
} 