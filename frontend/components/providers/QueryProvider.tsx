'use client'

/*
  WHY 'use client'?
  
  React Query uses React context internally.
  Context only works in Client Components.
  So the provider must be a Client Component.
  
  But — Server Components INSIDE this provider
  are still server components! The provider
  just wraps them, it does not affect them.
*/

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

/*
  WHY useState for QueryClient?
  
  If we wrote: const queryClient = new QueryClient()
  It would create a NEW client on every render!
  That destroys the cache every time. Bad!
  
  useState(() => new QueryClient()) creates it
  ONCE and keeps it stable. Good!
*/

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // How long before data is considered stale
            staleTime: 1000 * 60 * 5,     // 5 minutes

            // How long unused data stays in cache
            gcTime: 1000 * 60 * 10,       // 10 minutes

            // Retry failed requests
            retry: 1,                      // try once more on failure

            // Refetch when user comes back to tab
            refetchOnWindowFocus: false,   // disabled — less noise
          },
          mutations: {
            // Retry failed mutations (POST, PUT, DELETE)
            retry: 0,                      // do not retry mutations
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/*
        DevTools — only visible in development!
        Shows you the cache, queries, status.
        Invaluable for debugging.
        Automatically hidden in production build.
      */}
      <ReactQueryDevtools
        initialIsOpen={false}   // starts collapsed
        buttonPosition="bottom-left"
      />
    </QueryClientProvider>
  )
}
