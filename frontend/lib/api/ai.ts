import axiosClient from './client'
import { ChatMessage } from '@/types/chat'

// Normal (non-streaming) chat
export async function sendChatMessage(
  messages: ChatMessage[]
): Promise<string> {
  const response = await axiosClient.post('/api/ai/chat', { messages })
  return response.data.data.reply
}
