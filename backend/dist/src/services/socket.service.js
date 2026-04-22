"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
exports.initSocket = initSocket;
const socket_io_1 = require("socket.io");
// Track connected visitors
let visitorCount = 0;
// Recent activity feed (last 10 items)
const activityFeed = [];
function addActivity(item) {
    const activity = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
    };
    // Add to front of array
    activityFeed.unshift(activity);
    // Keep only last 10
    if (activityFeed.length > 10)
        activityFeed.pop();
    return activity;
}
function initSocket(httpServer) {
    exports.io = new socket_io_1.Server(httpServer, {
        /*
          CORS for Socket.io — separate from Express CORS!
          Socket.io has its own CORS configuration.
        */
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        /*
          transports = how to connect
          
          websocket  = real WebSocket (fast, modern)
          polling    = HTTP fallback (slower, for old browsers)
          
          We prefer WebSocket but allow polling as fallback.
        */
        transports: ['websocket', 'polling'],
        // Ping settings — detect dead connections
        pingTimeout: 60000, // 60 seconds
        pingInterval: 25000, // check every 25 seconds
    });
    // ========================
    // CONNECTION EVENT
    // Runs every time a new client connects
    // ========================
    exports.io.on('connection', (socket) => {
        // Increase visitor count
        visitorCount++;
        console.log(`🟢 Client connected: ${socket.id} (total: ${visitorCount})`);
        // Add join activity
        const joinActivity = addActivity({
            type: 'join',
            text: 'A new visitor joined',
        });
        /*
          Tell ALL connected clients the new count.
          io.emit = sends to EVERYONE including the new person.
          socket.broadcast.emit = sends to everyone EXCEPT new person.
        */
        exports.io.emit('visitor-count', { count: visitorCount });
        exports.io.emit('new-activity', joinActivity);
        // Send current state to the NEW client only
        socket.emit('activity-history', activityFeed);
        // ========================
        // PAGE VIEW EVENT
        // Client tells us which page they are on
        // ========================
        socket.on('page-view', (data) => {
            const pageNames = {
                '/': 'Home',
                '/about': 'About',
                '/projects': 'Projects',
                '/skills': 'Skills',
                '/blog': 'Blog',
                '/contact': 'Contact',
            };
            const pageName = pageNames[data.page] || data.page;
            const activity = addActivity({
                type: 'page',
                text: `Someone is viewing ${pageName}`,
            });
            // Tell everyone about this page view
            exports.io.emit('new-activity', activity);
        });
        // ========================
        // MESSAGE SENT EVENT
        // Triggered when someone sends contact form
        // ========================
        socket.on('contact-sent', () => {
            const activity = addActivity({
                type: 'message',
                text: 'Someone sent a message',
            });
            exports.io.emit('new-activity', activity);
        });
        // ========================
        // DISCONNECT EVENT
        // Runs when a client leaves
        // ========================
        socket.on('disconnect', (reason) => {
            visitorCount = Math.max(0, visitorCount - 1);
            console.log(`🔴 Client disconnected: ${socket.id} (${reason}) (total: ${visitorCount})`);
            const leaveActivity = addActivity({
                type: 'leave',
                text: 'A visitor left',
            });
            exports.io.emit('visitor-count', { count: visitorCount });
            exports.io.emit('new-activity', leaveActivity);
        });
    });
    console.log('✅ Socket.io initialized');
    return exports.io;
}
