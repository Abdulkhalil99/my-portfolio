"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = notFound;
/*
  This runs when NO route matches the request.
  
  Example:
    Client calls: GET /api/unicorn
    No route exists for that
    This handler catches it → sends 404
  
  It MUST be added AFTER all routes in index.ts
  so it only catches requests that nothing else handled.
*/
function notFound(req, res) {
    const response = {
        success: false,
        error: `Route not found: ${req.method} ${req.url}`,
    };
    res.status(404).json(response);
}
