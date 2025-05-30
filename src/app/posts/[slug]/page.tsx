import { getPostBySlug } from '../../../lib/posts'
import Image from 'next/image'
import Link from 'next/link'

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold text-red-500">Post not found</h1>
        <Link href="/" className="mt-4 text-blue-600 hover:text-blue-800">
          ← Back to home
        </Link>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <article className="prose lg:prose-xl">
        <Link href="/" className="text-blue-600 hover:text-blue-800 no-underline mb-8 block">
          ← Back to home
        </Link>
        <div className="relative w-full h-[400px] mb-8">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h1>{post.title}</h1>
        <time className="text-gray-500">{post.date}</time>
        <div className="mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  )
} 