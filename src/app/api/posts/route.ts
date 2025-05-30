import { NextResponse } from 'next/server'
import { getAllPosts, getPaginatedPosts } from '../../lib/posts'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page')) || 1
  
  const paginatedPosts = await getPaginatedPosts(page)
  
  return NextResponse.json(paginatedPosts)
} 