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

function getPlaceholderImage(slug: string): string {
  // List of reliable placeholder images from Unsplash
  const placeholderImages = [
    'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&auto=format&fit=crop&q=80', // Code
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=80', // Laptop
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80', // Code on screen
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=80', // Code
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80', // Keyboard
  ]
  
  // Use the slug to consistently select the same image for each post
  const index = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % placeholderImages.length
  return placeholderImages[index]
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

        // Update the image URL generation
        const imageUrl = data.imageUrl || getPlaceholderImage(slug)

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

    // Update the image URL generation
    const imageUrl = data.imageUrl || getPlaceholderImage(slug)

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