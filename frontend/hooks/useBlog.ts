import { useQuery } from '@tanstack/react-query'
import { getAllPosts, getPostBySlug } from '@/lib/api/blog'
import { queryKeys } from '@/lib/queryKeys'

export function useBlogPosts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.blog.all,
    queryFn:  getAllPosts,
    staleTime: 1000 * 60 * 5,
  })

  return {
    posts: data ?? [],
    isLoading,
    isError,
  }
}

export function useBlogPost(slug: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.blog.detail(slug),
    queryFn:  () => getPostBySlug(slug),
    enabled:  !!slug,
    staleTime: 1000 * 60 * 5,
  })

  return {
    post: data,
    isLoading,
    isError,
  }
}
