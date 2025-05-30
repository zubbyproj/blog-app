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
    <article className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover rounded-md"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{excerpt}</p>
      <div className="flex justify-between items-center">
        <time className="text-sm text-gray-500">{date}</time>
        <Link
          href={`/posts/${slug}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Read more →
        </Link>
      </div>
    </article>
  )
} 