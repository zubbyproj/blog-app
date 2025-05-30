import 'server-only'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { cache } from 'react'

const postsDirectory = path.join(process.cwd(), 'src/content')
const POSTS_PER_PAGE = 10

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  imageUrl: string
}

export interface PaginatedPosts {
  posts: Post[]
  totalPages: number
  currentPage: number
}

export const getPaginatedPosts = cache(async (page: number = 1): Promise<PaginatedPosts> => {
  const allPosts = await getAllPosts()
  const totalPosts = allPosts.length
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
  
  const startIndex = (page - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const paginatedPosts = allPosts.slice(startIndex, endIndex)
  
  return {
    posts: paginatedPosts,
    totalPages,
    currentPage: page
  }
})

export const getAllPosts = cache(async (): Promise<Post[]> => {
  // Get all markdown files from the posts directory
  const fileNames = await new Promise<string[]>((resolve) => {
    fs.readdir(postsDirectory, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err)
        resolve([])
        return
      }
      resolve(files)
    })
  })

  const allPosts = await Promise.all(
    fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(async (fileName) => {
        // Remove ".md" from file name to get slug
        const slug = fileName.replace(/\.md$/, '')

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = await new Promise<string>((resolve) => {
          fs.readFile(fullPath, 'utf8', (err, data) => {
            if (err) {
              console.error(`Error reading file ${fileName}:`, err)
              resolve('')
              return
            }
            resolve(data)
          })
        })

        if (!fileContents) return null

        // Use gray-matter to parse the post metadata section
        const { data, content } = matter(fileContents)

        // Ensure all required fields are present
        if (!data.title || !data.date || !data.excerpt) {
          console.warn(`Missing required fields in ${fileName}`)
          return null
        }

        // Generate a fallback image URL if none is provided
        const imageUrl = data.imageUrl || `/images/${slug.toLowerCase().replace(/ /g, '-')}.jpg`

        return {
          slug,
          title: data.title,
          date: data.date,
          excerpt: data.excerpt,
          content: content,
          imageUrl
        }
      })
  )

  // Filter out null values and sort posts by date
  return allPosts
    .filter((post): post is Post => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
})

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = await new Promise<string>((resolve, reject) => {
      fs.readFile(fullPath, 'utf8', (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })

    const { data, content } = matter(fileContents)

    // Convert markdown to HTML
    const processedContent = await remark()
      .use(html)
      .process(content)
    const contentHtml = processedContent.toString()

    // Generate a fallback image URL if none is provided
    const imageUrl = data.imageUrl || `/images/${slug.toLowerCase().replace(/ /g, '-')}.jpg`

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      content: contentHtml,
      imageUrl
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}) 