import axiosClient from './client'

/*
  Each function here = one API endpoint
  
  Frontend          Backend
  ─────────────────────────────────────
  getAll()      →   GET  /api/projects
  getById(id)   →   GET  /api/projects/:id
  getFeatured() →   GET  /api/projects?featured=true
*/

// TypeScript type for a project
export interface Project {
  id:          string
  title:       string
  description: string
  techStack:   string[]
  githubUrl?:  string
  liveUrl?:    string
  imageUrl?:   string
  featured:    boolean
  gradient:    string
  category:    string
  createdAt:   string
}

// GET /api/projects
export async function getAllProjects(): Promise<Project[]> {
  const response = await axiosClient.get<Project[]>('/api/projects')
  return response.data
}

// GET /api/projects?featured=true
export async function getFeaturedProjects(): Promise<Project[]> {
  const response = await axiosClient.get<Project[]>('/api/projects', {
    params: { featured: true },  // adds ?featured=true to URL
  })
  return response.data
}

// GET /api/projects/:id
export async function getProjectById(id: string): Promise<Project> {
  const response = await axiosClient.get<Project>(`/api/projects/${id}`)
  return response.data
}
