"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.AppError = void 0;
exports.errorHandler = errorHandler;
/*
  WHY a global error handler?
  
  Without it — every route handles errors differently:
    route 1: res.status(500).send('Error!')
    route 2: res.status(500).json({ msg: 'broke' })
    route 3: console.log(err) // forgot to respond! 😱
  
  With it — ALL errors go to one place:
    Any route: next(error) → comes here → consistent response
  
  Express knows this is an error handler because it has
  4 parameters: (err, req, res, next)
  Normal middleware has 3: (req, res, next)
*/
// Custom error class — lets us set status codes
class AppError extends Error {
    constructor(message, statusCode = 500, code) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'AppError';
        // Fixes instanceof check in TypeScript
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
// Helper to create common errors quickly
exports.createError = {
    notFound: (msg = 'Not found') => new AppError(msg, 404, 'NOT_FOUND'),
    unauthorized: (msg = 'Unauthorized') => new AppError(msg, 401, 'UNAUTHORIZED'),
    forbidden: (msg = 'Forbidden') => new AppError(msg, 403, 'FORBIDDEN'),
    badRequest: (msg = 'Bad request') => new AppError(msg, 400, 'BAD_REQUEST'),
    serverError: (msg = 'Internal server error') => new AppError(msg, 500, 'SERVER_ERROR'),
};
// The global error handler — must have 4 params for Express to recognize it
function errorHandler(err, req, res, next) {
    // Log error in development
    if (process.env.NODE_ENV !== 'production') {
        console.error('\n❌ Error:', {
            message: err.message,
            stack: err.stack,
            url: req.url,
            method: req.method,
        });
    }
    // If it is our custom AppError — use its status code
    if (err instanceof AppError) {
        const response = {
            success: false,
            error: err.message,
        };
        res.status(err.statusCode).json(response);
        return;
    }
    // Otherwise — generic 500 error
    // Never expose internal error details in production
    const response = {
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Something went wrong'
            : err.message,
    };
    res.status(500).json(response);
}
