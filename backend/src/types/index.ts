import { Request, Response, NextFunction } from 'express'

// Standard API response shape
// Every endpoint returns this format
export interface ApiResponse<T = unknown> {
  success: boolean
  data?:   T
  error?:  string
  message?: string
  meta?: {
    total?:    number
    page?:     number
    perPage?:  number
  }
}

// Express handler types — saves us repeating these
export type ExpressRequest  = Request
export type ExpressResponse = Response
export type NextFn          = NextFunction

// Async route handler type
// All our controllers will have this shape
export type AsyncHandler = (
  req:  Request,
  res:  Response,
  next: NextFunction,
) => Promise<void>

// ========================
// DATA TYPES
// These match what we return from API
// ========================

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

export interface BlogPost {
  id:        string
  title:     string
  slug:      string
  excerpt:   string
  content:   string
  tags:      string[]
  published: boolean
  readTime:  number
  createdAt: string
  updatedAt: string
}

export interface ContactMessage {
  name:    string
  email:   string
  subject: string
  message: string
}
