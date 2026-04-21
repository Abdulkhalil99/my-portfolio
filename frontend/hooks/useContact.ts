import { useMutation } from '@tanstack/react-query'
import { sendContactMessage } from '@/lib/api/contact'
import type { ContactPayload } from '@/lib/api/contact'
import { toast } from '@/store'

/*
  useMutation vs useQuery:
  
  useQuery    = GET data (read)
    Runs automatically when component mounts
    
  useMutation = POST/PUT/DELETE data (write)
    Runs only when you call mutate()
    Perfect for form submissions
*/

export function useContactForm() {
  const mutation = useMutation({
    mutationFn: (payload: ContactPayload) => sendContactMessage(payload),

    onSuccess: (data) => {
      // This runs when request succeeds
      toast.success('Message sent!', 'I will reply within 24 hours.')
    },

    onError: (error) => {
      // This runs when request fails
      toast.error('Failed to send', 'Please try emailing me directly.')
      console.error('Contact form error:', error)
    },
  })

  return {
    sendMessage: mutation.mutate,     // call this to send
    isLoading:   mutation.isPending,  // true while sending
    isSuccess:   mutation.isSuccess,  // true after success
    isError:     mutation.isError,    // true after error
    reset:       mutation.reset,      // reset back to idle
  }
}
