"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("../controllers/contact.controller");
const rateLimit_1 = require("../middleware/security/rateLimit");
const validate_1 = require("../middleware/security/validate");
const router = (0, express_1.Router)();
// POST /api/contact — send message (public)
router.post('/', rateLimit_1.strictLimiter, validate_1.validateContactBody, contact_controller_1.sendContactMessage);
// GET /api/contact — read messages (private — add auth later)
router.get('/', contact_controller_1.getContactMessages);
// PATCH /api/contact/:id/read — mark as read
router.patch('/:id/read', contact_controller_1.markAsRead);
exports.default = router;
