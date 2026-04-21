import { Request, Response, NextFunction } from 'express'
import prisma from '../lib/prisma'
import { ApiResponse } from '../types'

// GET /api/blog
export async function getAllPosts(
  req:  Request,
  res:  Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { tag } = req.query

    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,

        // Filter by tag if provided
        ...(tag && typeof tag === 'string' && {
          tags: {
            has: tag, // check if tag is in the array
          },
        }),
      },
      // Only return preview fields — not full content
      // This makes the list page faster to load
      select: {
        id:        true,
        title:     true,
        slug:      true,
        excerpt:   true,
        tags:      true,
        readTime:  true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
        // content: false ← not included (saves bandwidth)
      },
      orderBy: { createdAt: 'desc' }, // newest first
    })

    const response: ApiResponse = {
      success: true,
      data:    posts,
      meta:    { total: posts.length },
    }

    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

// GET /api/blog/:slug
export async function getPostBySlug(
  req:  Request,
  res:  Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { slug } = req.params

    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        published: true,
      },
      // Return ALL fields including content for full article
    })

    if (!post) {
      res.status(404).json({
        success: false,
        error:   `Post "${slug}" not found`,
      })
      return
    }

    const response: ApiResponse = {
      success: true,
      data:    post,
    }

    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}
