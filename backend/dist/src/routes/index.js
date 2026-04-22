"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projects_route_1 = __importDefault(require("./projects.route"));
const blog_route_1 = __importDefault(require("./blog.route"));
const contact_route_1 = __importDefault(require("./contact.route"));
const ai_route_1 = __importDefault(require("./ai.route"));
const router = (0, express_1.Router)();
router.use('/projects', projects_route_1.default);
router.use('/blog', blog_route_1.default);
router.use('/contact', contact_route_1.default);
router.use('/ai', ai_route_1.default);
exports.default = router;
