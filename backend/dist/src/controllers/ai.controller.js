"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = chat;
exports.chatStream = chatStream;
const ai_service_1 = require("../services/ai.service");
/*
  We have TWO endpoints:
  
  POST /api/ai/chat         → normal response (full text at once)
  POST /api/ai/chat/stream  → streaming response (word by word)
  
  For the frontend we will use streaming.
  The normal one is good for testing.
*/
// POST /api/ai/chat
// Normal response — full text at once
async function chat(req, res, next) {
    try {
        const { messages } = req.body;
        // Validate
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            res.status(400).json({
                success: false,
                error: 'messages array is required',
            });
            return;
        }
        // Limit conversation length
        // Too long = too many tokens = slower and more expensive
        const recentMessages = messages.slice(-10); // last 10 messages only
        const reply = await (0, ai_service_1.sendMessage)(recentMessages);
        const response = {
            success: true,
            data: { reply },
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
}
// POST /api/ai/chat/stream
// Streaming response — Server-Sent Events (SSE)
async function chatStream(req, res, next) {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            res.status(400).json({
                success: false,
                error: 'messages array is required',
            });
            return;
        }
        /*
          SERVER-SENT EVENTS (SSE)
          
          SSE is a way for the server to push data to the browser
          over a single HTTP connection — one direction only.
          
          Perfect for streaming AI responses!
          
          How it works:
          1. Frontend opens connection to /api/ai/chat/stream
          2. Server sends chunks of text as they arrive
          3. Frontend shows each chunk immediately
          4. Server sends [DONE] when finished
          5. Frontend closes connection
          
          The format MUST be:
            data: your text here\n\n
          
          The \n\n is required by the SSE standard.
        */
        // Set SSE headers
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            // Keep intermediaries from buffering the stream
            'X-Accel-Buffering': 'no',
        });
        const recentMessages = messages.slice(-10);
        let hasSentChunks = false;
        await (0, ai_service_1.sendMessageStream)(recentMessages, 
        // Called for each chunk of text
        (chunk) => {
            hasSentChunks = true;
            // Escape newlines in the chunk
            // SSE uses \n\n as message separator
            // so we cannot have raw newlines in the data
            const escaped = chunk.replace(/\n/g, '\\n');
            res.write(`data: ${escaped}\n\n`);
        }, 
        // Called when streaming is complete
        () => {
            res.write('data: [DONE]\n\n');
            res.end();
        }, 
        // Called if an error occurs
        async (error) => {
            console.error('Stream error:', error);
            // If stream already started and then failed, keep partial answer
            // instead of replacing it with an error message.
            if (hasSentChunks) {
                res.write('data: [DONE]\n\n');
                res.end();
                return;
            }
            // Fallback: if streaming endpoint fails, try non-stream response.
            try {
                const reply = await (0, ai_service_1.sendMessage)(recentMessages);
                const escaped = reply.replace(/\n/g, '\\n');
                res.write(`data: ${escaped}\n\n`);
                res.write('data: [DONE]\n\n');
                res.end();
            }
            catch (fallbackError) {
                const message = fallbackError instanceof Error
                    ? fallbackError.message
                    : 'AI service is temporarily unavailable';
                res.write(`data: [ERROR] ${message}\n\n`);
                res.end();
            }
        });
    }
    catch (error) {
        // If headers already sent, we cannot send error response
        if (!res.headersSent) {
            next(error);
        }
        else {
            res.write('data: [ERROR] Something went wrong\n\n');
            res.end();
        }
    }
}
