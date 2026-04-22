"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContactBody = validateContactBody;
/*
  Input validation is CRITICAL for security.
  
  Never trust what the user sends you.
  
  Attacks that validation prevents:
  
  SQL Injection:
    User sends: name = "Robert'; DROP TABLE users;--"
    Without validation → database executes it → data gone!
    With validation → we catch suspicious characters → reject
  
  XSS via API:
    User sends: message = "<script>steal(document.cookie)</script>"
    Without validation → stored in DB → shown to admin → XSS!
    With validation → we strip HTML → stored as plain text → safe
  
  Oversized payloads:
    User sends 100MB JSON body
    Without validation → server runs out of memory → crashes
    With validation → we reject anything over 10kb → safe
*/
// Sanitize a string — remove dangerous characters
function sanitizeString(str) {
    return str
        .trim() // remove extra spaces
        .replace(/<[^>]*>/g, '') // remove HTML tags
        .replace(/javascript:/gi, '') // remove javascript: links
        .replace(/on\w+=/gi, ''); // remove onclick= etc.
}
// Validate contact form body
function validateContactBody(req, res, next) {
    const { name, email, subject, message } = req.body;
    const errors = [];
    // ---- NAME ----
    if (!name) {
        errors.push('Name is required');
    }
    else if (typeof name !== 'string') {
        errors.push('Name must be a string');
    }
    else if (name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }
    else if (name.trim().length > 100) {
        errors.push('Name must be under 100 characters');
    }
    // ---- EMAIL ----
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.push('Email is required');
    }
    else if (!emailRegex.test(email)) {
        errors.push('Email address is not valid');
    }
    else if (email.length > 255) {
        errors.push('Email is too long');
    }
    // ---- SUBJECT ----
    if (subject && subject.length > 200) {
        errors.push('Subject must be under 200 characters');
    }
    // ---- MESSAGE ----
    if (!message) {
        errors.push('Message is required');
    }
    else if (message.trim().length < 10) {
        errors.push('Message must be at least 10 characters');
    }
    else if (message.trim().length > 5000) {
        errors.push('Message must be under 5000 characters');
    }
    // If any errors — reject the request
    if (errors.length > 0) {
        const response = {
            success: false,
            error: errors.join('. '),
        };
        res.status(400).json(response);
        return;
    }
    // Sanitize inputs before passing to controller
    // This cleans the data even if it passed validation
    req.body.name = sanitizeString(name);
    req.body.email = email.trim().toLowerCase();
    req.body.subject = subject ? sanitizeString(subject) : 'No subject';
    req.body.message = sanitizeString(message);
    next();
}
