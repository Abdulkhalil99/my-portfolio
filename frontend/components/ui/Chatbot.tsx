'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage, DisplayMessage } from '@/types/chat'

// ========================
// SUGGESTED QUESTIONS
// Shown when chat is empty.
// Makes it easy to start a conversation.
// ========================
const SUGGESTIONS = [
  'What projects have you built?',
  'What are your skills?',
  'Are you available for hire?',
  'Tell me about yourself',
]

// ========================
// STREAMING FETCH
// We use native fetch (not axios) for streaming
// because axios does not support streaming well.
// ========================
async function streamChat(
  messages: ChatMessage[],
  onChunk:  (text: string) => void,
  onDone:   () => void,
  onError:  (error: string) => void,
) {
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000').replace(/\/$/, '')

  const handleSSEData = (data: string): 'done' | 'error' | 'continue' => {
    if (data === '[DONE]') {
      onDone()
      return 'done'
    }

    if (data.startsWith('[ERROR]')) {
      onError(data.replace('[ERROR] ', ''))
      return 'error'
    }

    // Restore newlines that were escaped on server
    const restored = data.replace(/\\n/g, '\n')
    onChunk(restored)
    return 'continue'
  }

  try {
    const response = await fetch(`${API_URL}/api/ai/chat/stream`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ messages }),
    })

    if (!response.ok) {
      const rawError = await response.text().catch(() => '')
      const message = rawError
        ? `AI service error (${response.status}): ${rawError.slice(0, 160)}`
        : `AI service error (${response.status})`
      onError(message)
      return
    }

    if (!response.body) {
      onError('AI service returned an empty response stream')
      return
    }

    /*
      response.body is a ReadableStream.
      We read it chunk by chunk.
      
      TextDecoder converts raw bytes to text.
      We keep a buffer because SSE events can be split across chunks.
    */
    const reader  = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer    = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        buffer += decoder.decode()
        break
      }

      buffer += decoder.decode(value, { stream: true })

      // Each SSE event ends with a blank line (\n\n)
      const events = buffer.split('\n\n')
      buffer = events.pop() ?? ''

      for (const event of events) {
        const data = event
          .split('\n')
          .filter(line => line.startsWith('data:'))
          .map(line => line.replace(/^data:\s?/, ''))
          .join('\n')
          .trim()

        if (!data) continue

        const result = handleSSEData(data)
        if (result === 'done' || result === 'error') {
          return
        }
      }
    }

    // If stream closed without explicit [DONE], finalize gracefully
    if (buffer.trim().length > 0) {
      const data = buffer.replace(/^data:\s?/, '').trim()
      if (data.length > 0) {
        const result = handleSSEData(data)
        if (result === 'error') return
      }
    }

    onDone()
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error'
    onError(`Cannot reach AI service (${reason})`)
  }
}

// ========================
// MAIN CHATBOT COMPONENT
// ========================
export function Chatbot() {
  const [isOpen,      setIsOpen]      = useState(false)
  const [messages,    setMessages]    = useState<DisplayMessage[]>([])
  const [input,       setInput]       = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // ========================
  // SEND MESSAGE
  // ========================
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return

    const userMessage: DisplayMessage = {
      id:      `user-${Date.now()}`,
      role:    'user',
      content: text.trim(),
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsStreaming(true)

    // Add empty AI message that we will fill in
    const aiMessageId = `ai-${Date.now()}`
    const aiMessage: DisplayMessage = {
      id:        aiMessageId,
      role:      'model',
      content:   '',
      isLoading: true,
    }
    setMessages(prev => [...prev, aiMessage])

    // Build conversation history for API
    // Include all previous messages + new user message
    const history: ChatMessage[] = [
      ...messages.map(m => ({
        role:    m.role,
        content: m.content,
      })),
      { role: 'user', content: text.trim() },
    ]

    // Stream the response
    await streamChat(
      history,

      // onChunk — append each piece to the AI message
      (chunk) => {
        setMessages(prev => prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, content: msg.content + chunk, isLoading: false }
            : msg
        ))
      },

      // onDone — streaming finished
      () => {
        setIsStreaming(false)
        setMessages(prev => prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, isLoading: false }
            : msg
        ))
      },

      // onError — something went wrong
      (error) => {
        setIsStreaming(false)
        const friendlyMessage = process.env.NODE_ENV === 'development'
          ? `Sorry, I had trouble responding.\n${error}`
          : 'Sorry, I had trouble responding. Please try again.'

        setMessages(prev => prev.map(msg =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content:   friendlyMessage,
                isLoading: false,
              }
            : msg
        ))
        console.error('Chat error:', error)
      },
    )
  }, [messages, isStreaming])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* ==============================
          CHAT WINDOW
      ============================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' as const }}
            className={cn(
              'fixed bottom-24 right-4 sm:right-6 z-50',
              'w-[calc(100vw-2rem)] sm:w-[380px]',
              'h-[520px]',
              'flex flex-col',
              'rounded-2xl overflow-hidden',
              'glass-violet',
              'shadow-2xl shadow-black/40',
            )}
          >

            {/* HEADER */}
            <div className={cn(
              'flex items-center justify-between',
              'px-4 py-3',
              'border-b border-[hsl(var(--violet)/0.2)]',
              'bg-[hsl(var(--violet)/0.08)]',
            )}>
              <div className="flex items-center gap-2.5">
                {/* Animated bot icon */}
                <div className={cn(
                  'h-8 w-8 rounded-full',
                  'bg-[hsl(var(--violet)/0.2)]',
                  'border border-[hsl(var(--violet)/0.4)]',
                  'flex items-center justify-center',
                )}>
                  <Bot className="h-4 w-4 text-[hsl(var(--violet))]" />
                </div>

                <div>
                  <p className="text-sm font-semibold leading-none">
                    Portfolio Assistant
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {/* Online indicator */}
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--emerald))] animate-pulse" />
                    <span className="text-[10px] text-[hsl(var(--text-muted))]">
                      Powered by Gemini AI
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'h-7 w-7 rounded-lg',
                    'flex items-center justify-center',
                    'text-[hsl(var(--text-muted))]',
                    'hover:text-[hsl(var(--text-primary))]',
                    'hover:bg-[hsl(var(--bg-overlay))]',
                    'transition-colors duration-150',
                  )}
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">

              {/* Welcome message when empty */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0  }}
                  className="space-y-4"
                >
                  {/* Bot greeting */}
                  <div className="flex items-start gap-2.5">
                    <BotAvatar />
                    <div className={cn(
                      'rounded-2xl rounded-tl-sm',
                      'px-4 py-3 max-w-[85%]',
                      'bg-[hsl(var(--bg-elevated))]',
                      'border border-[hsl(var(--border-default))]',
                      'text-sm text-[hsl(var(--text-secondary))]',
                      'leading-relaxed',
                    )}>
                      Hi! I am the AI assistant for this portfolio.
                      I can tell you about projects, skills, and experience.
                      What would you like to know? 👋
                    </div>
                  </div>

                  {/* Suggestion buttons */}
                  <div className="ml-9 flex flex-col gap-2">
                    {SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        className={cn(
                          'text-left px-3 py-2 rounded-xl',
                          'text-xs text-[hsl(var(--text-secondary))]',
                          'border border-[hsl(var(--border-default))]',
                          'hover:border-[hsl(var(--violet)/0.4)]',
                          'hover:text-[hsl(var(--violet))]',
                          'hover:bg-[hsl(var(--violet)/0.05)]',
                          'transition-all duration-150',
                          'text-left',
                        )}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message list */}
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'flex items-start gap-2.5',
                    message.role === 'user' && 'flex-row-reverse',
                  )}
                >
                  {/* Avatar */}
                  {message.role === 'model'
                    ? <BotAvatar />
                    : <UserAvatar />
                  }

                  {/* Bubble */}
                  <div className={cn(
                    'rounded-2xl px-4 py-3 max-w-[85%]',
                    'text-sm leading-relaxed',
                    message.role === 'user'
                      ? [
                          'rounded-tr-sm',
                          'bg-[hsl(var(--violet))]',
                          'text-white',
                        ]
                      : [
                          'rounded-tl-sm',
                          'bg-[hsl(var(--bg-elevated))]',
                          'border border-[hsl(var(--border-default))]',
                          'text-[hsl(var(--text-secondary))]',
                        ],
                  )}>
                    {/* Loading dots while AI is thinking */}
                    {message.isLoading && message.content === '' ? (
                      <ThinkingDots />
                    ) : (
                      // Render message with line breaks
                      message.content.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < message.content.split('\n').length - 1 && <br />}
                        </span>
                      ))
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Invisible div at bottom — we scroll to this */}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT AREA */}
            <div className={cn(
              'p-3 border-t border-[hsl(var(--violet)/0.2)]',
              'bg-[hsl(var(--bg-elevated)/0.5)]',
            )}>
              <div className={cn(
                'flex items-center gap-2',
                'px-3 py-2 rounded-xl',
                'bg-[hsl(var(--bg-overlay))]',
                'border border-[hsl(var(--border-default))]',
                'focus-within:border-[hsl(var(--violet)/0.5)]',
                'transition-colors duration-200',
              )}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  disabled={isStreaming}
                  className={cn(
                    'flex-1 bg-transparent',
                    'text-sm text-[hsl(var(--text-primary))]',
                    'placeholder:text-[hsl(var(--text-muted))]',
                    'focus:outline-none',
                    'disabled:opacity-50',
                  )}
                />

                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isStreaming}
                  className={cn(
                    'h-7 w-7 rounded-lg shrink-0',
                    'flex items-center justify-center',
                    'transition-all duration-150',
                    input.trim() && !isStreaming
                      ? 'bg-[hsl(var(--violet))] text-white hover:bg-[hsl(var(--violet-dim))]'
                      : 'text-[hsl(var(--text-muted))] cursor-not-allowed',
                  )}
                  aria-label="Send message"
                >
                  {isStreaming
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Send    className="h-3.5 w-3.5" />
                  }
                </button>
              </div>

              <p className="text-center text-[10px] text-[hsl(var(--text-muted))] mt-2">
                AI can make mistakes. Verify important info.
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ==============================
          FLOATING BUTTON
          Always visible in corner
      ============================== */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', bounce: 0.5 }}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className={cn(
          'fixed bottom-4 right-4 sm:right-6 z-50',
          'h-14 w-14 rounded-full',
          'flex items-center justify-center',
          'shadow-lg shadow-black/30',
          'transition-all duration-200',
          isOpen
            ? 'bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-default))] text-[hsl(var(--text-primary))]'
            : 'bg-[hsl(var(--violet))] text-white shadow-[0_0_20px_hsl(var(--violet)/0.5)] hover:shadow-[0_0_30px_hsl(var(--violet)/0.7)]',
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{    rotate:  90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0,  opacity: 1 }}
              exit={{    rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread dot — shown when chat is closed */}
        {!isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              'absolute -top-1 -right-1',
              'h-4 w-4 rounded-full',
              'bg-[hsl(var(--emerald))]',
              'border-2 border-[hsl(var(--bg-base))]',
              'flex items-center justify-center',
            )}
          >
            <span className="text-[8px] font-bold text-white">AI</span>
          </motion.span>
        )}
      </motion.button>
    </>
  )
}

// ========================
// SMALL HELPER COMPONENTS
// ========================

function BotAvatar() {
  return (
    <div className={cn(
      'h-7 w-7 rounded-full shrink-0',
      'bg-[hsl(var(--violet)/0.15)]',
      'border border-[hsl(var(--violet)/0.3)]',
      'flex items-center justify-center',
    )}>
      <Bot className="h-3.5 w-3.5 text-[hsl(var(--violet))]" />
    </div>
  )
}

function UserAvatar() {
  return (
    <div className={cn(
      'h-7 w-7 rounded-full shrink-0',
      'bg-[hsl(var(--blue)/0.15)]',
      'border border-[hsl(var(--blue)/0.3)]',
      'flex items-center justify-center',
    )}>
      <User className="h-3.5 w-3.5 text-[hsl(var(--blue))]" />
    </div>
  )
}

// Animated dots shown while AI is thinking
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{
            duration:   0.8,
            repeat:     Infinity,
            delay:      i * 0.15,
            ease:       'easeInOut' as const,
          }}
          className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--text-muted))]"
        />
      ))}
    </div>
  )
}
