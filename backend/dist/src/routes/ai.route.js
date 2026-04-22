"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
/*
  Special rate limiter for AI endpoint.
  
  Gemini free tier: 60 requests per minute.
  We limit to 20 per minute per IP to be safe
  and to prevent abuse.
  
  Each "request" = one message sent.
*/
const aiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 messages per minute per IP
    message: {
        success: false,
        error: 'Too many messages. Please wait a minute.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Normal response
router.post('/chat', aiLimiter, ai_controller_1.chat);
// Streaming response
router.post('/chat/stream', aiLimiter, ai_controller_1.chatStream);
exports.default = router;
