// This file defines the "shape" of our data
// Think of types like a form template — it says what fields exist

// ========================
// NAVIGATION
// ========================
export interface NavItem {
  label: string    // Text shown in navbar: "Home", "Projects"
  href: string     // URL: "/", "/projects"
  icon?: string    // Optional icon name
}

// ========================
// PROJECTS
// ========================
export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  techStack: string[]          // ["React", "Node.js", "PostgreSQL"]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  featured: boolean            // Show on home page?
  createdAt: Date
}

// ========================
// BLOG
// ========================
export interface BlogPost {
  id: string
  title: string
  slug: string                 // URL-friendly title: "my-first-post"
  excerpt: string              // Short preview text
  content: string              // Full article content
  tags: string[]
  published: boolean
  readTime: number             // Minutes to read
  createdAt: Date
  updatedAt: Date
}

// ========================
// CONTACT FORM
// ========================
export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

// ========================
// API RESPONSE WRAPPER
// ========================
// All our API responses will have this shape
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}