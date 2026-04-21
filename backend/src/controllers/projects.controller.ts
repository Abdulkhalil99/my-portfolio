import { Request, Response, NextFunction } from 'express'
import prisma from '../lib/prisma'
import { ApiResponse } from '../types'

// GET /api/projects
export async function getAllProjects(
  req:  Request,
  res:  Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { featured, category } = req.query

    const projects = await prisma.project.findMany({
      where: {
        // Only show non-deleted projects
        deletedAt: null,

        // Filter by featured if provided
        ...(featured === 'true' && { featured: true }),

        // Filter by category if provided
        ...(category && typeof category === 'string' && {
          category: {
            equals:   category,
            mode:     'insensitive', // case-insensitive match
          },
        }),
      },
      orderBy: { order: 'asc' }, // show in our custom order
    })

    const response: ApiResponse = {
      success: true,
      data:    projects,
      meta:    { total: projects.length },
    }

    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}

// GET /api/projects/:id
export async function getProjectById(
  req:  Request,
  res:  Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params

    const project = await prisma.project.findFirst({
      where: {
        id,
        deletedAt: null, // do not return deleted projects
      },
    })

    if (!project) {
      res.status(404).json({
        success: false,
        error:   `Project with id "${id}" not found`,
      })
      return
    }

    const response: ApiResponse = {
      success: true,
      data:    project,
    }

    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}
