import axiosClient from './client'
import type { ApiResponse, BlogPost } from '@/types'

type BlogListItem = Omit<BlogPost, 'content' | 'published'> & {
  coverImage?: string | null
  createdAt: string
  updatedAt: string
}

type BlogDetailItem = BlogPost & {
  coverImage?: string | null
  createdAt: string
  updatedAt: string
}

export async function getAllPosts(): Promise<BlogListItem[]> {
  const response = await axiosClient.get<ApiResponse<BlogListItem[]>>('/api/blog')
  return response.data.data ?? []
}

export async function getPostBySlug(slug: string): Promise<BlogDetailItem | null> {
  const response = await axiosClient.get<ApiResponse<BlogDetailItem>>(`/api/blog/${slug}`)
  return response.data.data ?? null
}
