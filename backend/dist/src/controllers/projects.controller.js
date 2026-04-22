"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProjects = getAllProjects;
exports.getProjectById = getProjectById;
const prisma_1 = __importDefault(require("../lib/prisma"));
// GET /api/projects
async function getAllProjects(req, res, next) {
    try {
        const { featured, category } = req.query;
        const projects = await prisma_1.default.project.findMany({
            where: {
                // Only show non-deleted projects
                deletedAt: null,
                // Filter by featured if provided
                ...(featured === 'true' && { featured: true }),
                // Filter by category if provided
                ...(category && typeof category === 'string' && {
                    category: {
                        equals: category,
                        mode: 'insensitive', // case-insensitive match
                    },
                }),
            },
            orderBy: { order: 'asc' }, // show in our custom order
        });
        const response = {
            success: true,
            data: projects,
            meta: { total: projects.length },
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
}
// GET /api/projects/:id
async function getProjectById(req, res, next) {
    try {
        const { id } = req.params;
        const project = await prisma_1.default.project.findFirst({
            where: {
                id,
                deletedAt: null, // do not return deleted projects
            },
        });
        if (!project) {
            res.status(404).json({
                success: false,
                error: `Project with id "${id}" not found`,
            });
            return;
        }
        const response = {
            success: true,
            data: project,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
}
