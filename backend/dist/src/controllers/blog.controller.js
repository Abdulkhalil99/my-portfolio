"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPosts = getAllPosts;
exports.getPostBySlug = getPostBySlug;
const prisma_1 = __importDefault(require("../lib/prisma"));
// GET /api/blog
async function getAllPosts(req, res, next) {
    try {
        const { tag } = req.query;
        const posts = await prisma_1.default.blogPost.findMany({
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
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                tags: true,
                readTime: true,
                coverImage: true,
                createdAt: true,
                updatedAt: true,
                // content: false ← not included (saves bandwidth)
            },
            orderBy: { createdAt: 'desc' }, // newest first
        });
        const response = {
            success: true,
            data: posts,
            meta: { total: posts.length },
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
}
// GET /api/blog/:slug
async function getPostBySlug(req, res, next) {
    try {
        const { slug } = req.params;
        const post = await prisma_1.default.blogPost.findFirst({
            where: {
                slug,
                published: true,
            },
            // Return ALL fields including content for full article
        });
        if (!post) {
            res.status(404).json({
                success: false,
                error: `Post "${slug}" not found`,
            });
            return;
        }
        const response = {
            success: true,
            data: post,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
}
