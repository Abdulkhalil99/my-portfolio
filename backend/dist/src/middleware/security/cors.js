"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
/*
  ALLOWED ORIGINS
  
  We allow different origins for different environments:
  
  Development:
    http://localhost:3000  ← Next.js dev server
    http://localhost:3001  ← in case you run on different port
  
  Production:
    https://yoursite.com   ← your real domain
    
  We read these from .env so we never hardcode URLs.
*/
function getAllowedOrigins() {
    const origins = [];
    // Always allow the main frontend URL from .env
    if (process.env.FRONTEND_URL) {
        origins.push(process.env.FRONTEND_URL);
    }
    // In development, also allow common localhost ports
    if (process.env.NODE_ENV === 'development') {
        origins.push('http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000');
    }
    return origins;
}
/*
  The origin function runs for EVERY request.
  It checks: "is this requester allowed?"
  
  origin = where the request is coming FROM
  callback(error, allow?) = our decision
*/
function corsOriginHandler(origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    // No origin = request from same server, Postman, curl
    // These are fine to allow (not a browser request)
    if (!origin) {
        callback(null, true);
        return;
    }
    if (allowedOrigins.includes(origin)) {
        // Origin is in our allowed list → ALLOW
        callback(null, true);
    }
    else {
        // Origin is NOT allowed → BLOCK with error
        console.warn(`🚫 CORS blocked request from: ${origin}`);
        callback(new Error(`CORS: Origin ${origin} is not allowed`));
    }
}
exports.corsMiddleware = (0, cors_1.default)({
    origin: corsOriginHandler,
    // Allow cookies and auth headers to be sent
    credentials: true,
    // Which HTTP methods are allowed
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    // Which headers the frontend can send
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
    ],
    // Which headers the frontend can READ from the response
    exposedHeaders: [
        'X-Total-Count', // we send total items count here
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
    ],
    // How long browser caches CORS preflight response
    // 24 hours = browser does not send preflight every time
    maxAge: 86400,
});
