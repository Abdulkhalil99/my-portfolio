export interface ChatMessage {
  role:    'user' | 'model'
  content: string
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}

interface GeminiEndpoint {
  model:   string
  version: string
}

type GeminiMethod = 'generateContent' | 'streamGenerateContent'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim() || ''
const BASE_URL = 'https://generativelanguage.googleapis.com'
const DEFAULT_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
]
const DEFAULT_API_VERSIONS = ['v1beta', 'v1']

let cachedEndpoint: GeminiEndpoint | null = null

function parseCSV(value?: string): string[] {
  return (value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function dedupe(items: string[]): string[] {
  return [...new Set(items)]
}

function configuredModels(): string[] {
  const explicitList = parseCSV(process.env.GEMINI_MODELS)
  if (explicitList.length > 0) return dedupe(explicitList)

  const preferred = process.env.GEMINI_MODEL?.trim()
  return dedupe([preferred, ...DEFAULT_MODELS].filter(Boolean) as string[])
}

function configuredVersions(): string[] {
  const explicitList = parseCSV(process.env.GEMINI_API_VERSIONS)
  if (explicitList.length > 0) return dedupe(explicitList)
  return DEFAULT_API_VERSIONS
}

function buildSystemPrompt(): string {
  return `You are an AI assistant embedded in a developer portfolio website.
Your job is to help visitors learn about the developer and their work.

ABOUT THE DEVELOPER:
Name: Abdul Khalil
Title: Full-Stack Developer
Location: Kabul, Afghanistan
Available for: Freelance work, full-time positions, collaborations

TECHNICAL SKILLS:
Frontend: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion, Three.js
Backend: Node.js, Express.js, REST APIs, Socket.io
Database: PostgreSQL, Prisma ORM, Redis, Supabase

PROJECTS:
1. Portfolio Website - Next.js 14, Three.js, Framer Motion, AI chatbot
2. Real-time Dashboard - React, Socket.io, Redis, Node.js
3. AI Writing Tool - Next.js, Gemini API, Supabase, Stripe
4. E-commerce API - Node.js, Express, PostgreSQL, Prisma

YOUR RULES:
1. Be friendly and helpful
2. Keep responses short, 2 to 4 sentences maximum
3. Only talk about Khalil and his work
4. If asked about hiring, say he is available and to use the contact form
5. Never make up information not listed here
6. Use plain text only, no markdown, no stars, no hashtags`
}

/*
  IMPORTANT: Gemini REST API format for system_instruction
  
  WRONG (what we had):
  { "system_instruction": { "parts": [{ "text": "..." }] } }
  
  CORRECT:
  { "system_instruction": { "role": "user", "parts": [{ "text": "..." }] } }
  
  The role field is required!
*/
function buildBody(
  messages: ChatMessage[],
  version:  string,
): string {
  const common = {
    contents: messages.map(msg => ({
      role:  msg.role,
      parts: [{ text: msg.content }],
    })),
    generationConfig: {
      temperature:     0.7,
      maxOutputTokens: 400,
    },
  }

  if (version === 'v1') {
    return JSON.stringify({
      ...common,
      systemInstruction: {
        role:  'user',
        parts: [{ text: buildSystemPrompt() }],
      },
    })
  }

  return JSON.stringify({
    ...common,
    system_instruction: {
      role:  'user',
      parts: [{ text: buildSystemPrompt() }],
    },
  })
}

function shorten(text: string, max = 220): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return 'No error details'
  return clean.length <= max ? clean : `${clean.slice(0, max)}...`
}

function getCandidateEndpoints(): GeminiEndpoint[] {
  const endpoints: GeminiEndpoint[] = []

  if (cachedEndpoint) {
    endpoints.push(cachedEndpoint)
  }

  for (const model of configuredModels()) {
    for (const version of configuredVersions()) {
      const duplicateCached =
        cachedEndpoint &&
        cachedEndpoint.model === model &&
        cachedEndpoint.version === version

      if (!duplicateCached) {
        endpoints.push({ model, version })
      }
    }
  }

  return endpoints
}

function buildRequestUrl(
  endpoint: GeminiEndpoint,
  method:   GeminiMethod,
): string {
  const params = new URLSearchParams({ key: GEMINI_API_KEY })
  if (method === 'streamGenerateContent') {
    params.set('alt', 'sse')
  }

  return `${BASE_URL}/${endpoint.version}/models/${endpoint.model}:${method}?${params.toString()}`
}

async function requestWithFallback(
  messages: ChatMessage[],
  method:   GeminiMethod,
): Promise<Response> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in backend/.env')
  }

  const endpoints = getCandidateEndpoints()
  const attempts: string[] = []

  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i]
    const isLast = i === endpoints.length - 1
    const url = buildRequestUrl(endpoint, method)
    const body = buildBody(messages, endpoint.version)

    const response = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    if (response.ok) {
      cachedEndpoint = endpoint
      return response
    }

    const err = await response.text()
    attempts.push(
      `${endpoint.model} (${endpoint.version}) => ${response.status} ${shorten(err, 120)}`,
    )

    // 404 usually means endpoint/model path is unavailable.
    // Try next candidate before failing.
    if ((response.status === 404 || response.status === 429) && !isLast) {
      continue
    }

    throw new Error(
      `Gemini ${response.status} on ${endpoint.model} (${endpoint.version}): ${shorten(err)}`,
    )
  }

  throw new Error(`Gemini failed on all candidates: ${attempts.join(' | ')}`)
}

// ========================
// NORMAL RESPONSE
// ========================
export async function sendMessage(
  messages: ChatMessage[],
): Promise<string> {
  const response = await requestWithFallback(messages, 'generateContent')

  const data = await response.json() as GeminiResponse
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) throw new Error('Empty response from Gemini')
  return text
}

// ========================
// STREAMING RESPONSE
// ========================
export async function sendMessageStream(
  messages: ChatMessage[],
  onChunk:  (text: string) => void,
  onDone:   () => void,
  onError:  (error: Error) => void,
): Promise<void> {
  try {
    const response = await requestWithFallback(messages, 'streamGenerateContent')

    if (!response.body) throw new Error('No response body')

    const reader  = response.body.getReader()
    const decoder = new TextDecoder()
    let   buffer  = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue

        const data = trimmed.slice(5).trim()
        if (!data || data === '[DONE]') continue

        try {
          const parsed = JSON.parse(data)
          const text   = parsed?.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) onChunk(text)
        } catch {
          // skip non-JSON lines
        }
      }
    }

    onDone()
  } catch (error) {
    onError(error as Error)
  }
}

export async function verifyAIConnection(): Promise<boolean> {
  try {
    if (!GEMINI_API_KEY) {
      console.warn('⚠️  GEMINI_API_KEY not set in .env')
      return false
    }
    await sendMessage([{ role: 'user', content: 'hi' }])
    console.log('✅ Gemini AI connected')
    return true
  } catch (error) {
    console.warn('⚠️  Gemini unavailable:', (error as Error).message)
    return false
  }
}
