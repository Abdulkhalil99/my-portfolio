/*
  Custom hooks wrap React Query.
  
  WHY? Clean separation:
    - API functions = how to fetch data
    - Custom hooks  = how to use data in React
    - Components    = how to display data
  
  Usage in any component:
    const { projects, isLoading } = useProjects()
    const { project } = useProject('some-id')
*/

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllProjects, getFeaturedProjects, getProjectById } from '@/lib/api/projects'
import { queryKeys } from '@/lib/queryKeys'

// ========================
// ALL PROJECTS
// ========================
export function useProjects() {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: queryKeys.projects.all,
    queryFn:  getAllProjects,

    staleTime: 1000 * 60 * 5,
    // staleTime = how long data is considered "fresh"
    // 5 minutes = do not refetch for 5 minutes
    // After 5 min → data is "stale" → refetch in background
  })

  return {
    projects:   data ?? [],    // ?? = use [] if data is undefined
    isLoading,
    isError,
    error,
    isFetching,                // true when refetching in background
  }
}

// ========================
// FEATURED PROJECTS ONLY
// ========================
export function useFeaturedProjects() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.projects.featured,
    queryFn:  getFeaturedProjects,
    staleTime: 1000 * 60 * 5,
  })

  return {
    projects: data ?? [],
    isLoading,
    isError,
  }
}

// ========================
// SINGLE PROJECT
// ========================
export function useProject(id: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn:  () => getProjectById(id),

    // Only run if id exists
    // enabled = false means: do not fetch yet
    enabled:   !!id,
    staleTime: 1000 * 60 * 5,
  })

  return {
    project: data,
    isLoading,
    isError,
  }
}
