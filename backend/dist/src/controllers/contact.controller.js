"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactMessage = sendContactMessage;
exports.getContactMessages = getContactMessages;
exports.markAsRead = markAsRead;
const prisma_1 = __importDefault(require("../lib/prisma"));
const email_service_1 = require("../services/email.service");
// We import io lazily to avoid circular imports
function getIO() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require('../services/socket.service').io;
    }
    catch {
        return null;
    }
}
// POST /api/contact
async function sendContactMessage(req, res, next) {
    try {
        const { name, email, subject, message } = req.body;
        // Save to database first
        const saved = await prisma_1.default.contactMessage.create({
            data: {
                name,
                email,
                subject: subject || 'No subject',
                message,
                ipAddress: req.ip || null,
            },
        });
        console.log(`\n💾 Message saved — ID: ${saved.id}`);
        // Send emails in background
        (0, email_service_1.sendContactEmails)({
            id: saved.id,
            name: saved.name,
            email: saved.email,
            subject: saved.subject,
            message: saved.message,
        }).catch(err => console.error('Email error:', err));
        // Notify all connected visitors via Socket.io
        const io = getIO();
        if (io) {
            io.emit('contact-received', {
                timestamp: new Date().toISOString(),
            });
        }
        res.status(201).json({
            success: true,
            message: 'Message received! I will reply within 24 hours.',
            data: { id: saved.id },
        });
    }
    catch (error) {
        next(error);
    }
}
// GET /api/contact
async function getContactMessages(req, res, next) {
    try {
        const messages = await prisma_1.default.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({
            success: true,
            data: messages,
            meta: { total: messages.length },
        });
    }
    catch (error) {
        next(error);
    }
}
// PATCH /api/contact/:id/read
async function markAsRead(req, res, next) {
    try {
        const updated = await prisma_1.default.contactMessage.update({
            where: { id: req.params.id },
            data: { read: true },
        });
        res.status(200).json({ success: true, data: updated });
    }
    catch (error) {
        next(error);
    }
}
