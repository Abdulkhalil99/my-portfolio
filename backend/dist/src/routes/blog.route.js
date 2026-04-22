"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const rateLimit_1 = require("../middleware/security/rateLimit");
const router = (0, express_1.Router)();
router.get('/', rateLimit_1.readLimiter, blog_controller_1.getAllPosts);
router.get('/:slug', rateLimit_1.readLimiter, blog_controller_1.getPostBySlug);
exports.default = router;
