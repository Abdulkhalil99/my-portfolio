"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projects_controller_1 = require("../controllers/projects.controller");
const rateLimit_1 = require("../middleware/security/rateLimit");
const router = (0, express_1.Router)();
// Read routes get more relaxed limiter (300 req / 15 min)
router.get('/', rateLimit_1.readLimiter, projects_controller_1.getAllProjects);
router.get('/:id', rateLimit_1.readLimiter, projects_controller_1.getProjectById);
exports.default = router;
