"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = require("./middleware/security/cors");
const helmet_1 = require("./middleware/security/helmet");
const rateLimit_1 = require("./middleware/security/rateLimit");
const logger_1 = require("./middleware/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const email_service_1 = require("./services/email.service");
const ai_service_1 = require("./services/ai.service");
const socket_service_1 = require("./services/socket.service");
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
/*
  WHY createServer(app)?

  Normally Express listens directly:
    app.listen(PORT)

  But Socket.io needs access to the raw Node.js
  HTTP server — not the Express app.

  So we:
  1. Create a raw HTTP server
  2. Give Express to it (handles HTTP requests)
  3. Give Socket.io to it (handles WebSocket)
  Both share the same port!

  Port 5000:
    HTTP request → Express handles it
    WebSocket    → Socket.io handles it
*/
const httpServer = (0, http_1.createServer)(app);
// Initialize Socket.io on the HTTP server
const io = (0, socket_service_1.initSocket)(httpServer);
exports.io = io;
// ============================================================
// MIDDLEWARE
// ============================================================
app.use(helmet_1.helmetMiddleware);
app.use(cors_1.corsMiddleware);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(logger_1.logger);
app.use('/api', rateLimit_1.apiLimiter);
// ============================================================
// ROUTES
// ============================================================
app.get('/health', (req, res) => {
    const response = {
        success: true,
        message: 'Server is healthy',
        data: {
            status: 'healthy',
            environment: NODE_ENV,
            timestamp: new Date().toISOString(),
            uptime: `${Math.floor(process.uptime())}s`,
            connections: io.engine.clientsCount,
            // ↑ how many WebSocket clients are connected right now
        },
    };
    res.status(200).json(response);
});
app.use('/api', routes_1.default);
// ============================================================
// ERROR HANDLERS
// ============================================================
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
// ============================================================
// START — use httpServer.listen NOT app.listen
// ============================================================
httpServer.listen(PORT, async () => {
    console.log('\n' + '═'.repeat(50));
    console.log('🚀  Server running!');
    console.log('═'.repeat(50));
    console.log(`📍  Local:    http://localhost:${PORT}`);
    console.log(`🏥  Health:   http://localhost:${PORT}/health`);
    console.log(`📦  API:      http://localhost:${PORT}/api`);
    console.log(`🔌  Socket:   ws://localhost:${PORT}`);
    console.log(`🌍  Env:      ${NODE_ENV}`);
    console.log('═'.repeat(50));
    console.log('\n🔌 Checking services...');
    await (0, email_service_1.verifyEmailConnection)();
    await (0, ai_service_1.verifyAIConnection)();
    console.log();
});
process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down gracefully...');
    httpServer.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
exports.default = app;
