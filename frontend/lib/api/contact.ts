import axiosClient from './client'
import type { ApiResponse, ContactForm } from '@/types'

export type ContactPayload = ContactForm

export interface ContactSubmitResult {
  id: string
}

export async function sendContactMessage(
  payload: ContactPayload,
): Promise<ContactSubmitResult | null> {
  const response = await axiosClient.post<ApiResponse<ContactSubmitResult>>(
    '/api/contact',
    payload,
  )

  return response.data.data ?? null
}
