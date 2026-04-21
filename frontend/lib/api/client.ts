import axios, { AxiosError, AxiosInstance } from 'axios'

/*
  WHY a central API client?
  
  Without it:
    fetch('http://localhost:5000/api/projects')  ← in Projects page
    fetch('http://localhost:5000/api/blog')      ← in Blog page
    fetch('http://localhost:5000/api/contact')   ← in Contact page
    
    Problem: URL is repeated everywhere.
    If backend URL changes → you update 20 files 😭
  
  With it:
    api.projects.getAll()   ← clean!
    api.blog.getAll()       ← clean!
    api.contact.send(data)  ← clean!
    
    URL is defined ONCE. Change it once → works everywhere ✅
*/

// Read the backend URL from environment variables
// In development: http://localhost:5000
// In production: your real server URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'

/*
  NEXT_PUBLIC_ prefix is important!
  
  Normal env vars (NEXT_PUBLIC_ missing):
    Only available on the SERVER
    Browser cannot see them (security)
    
  NEXT_PUBLIC_ env vars:
    Available in the BROWSER too
    Safe to expose (not secrets)
*/

// Create the axios instance — our configured HTTP client
const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,                                // 10 seconds max wait
  headers: {
    'Content-Type': 'application/json',          // we send JSON
    'Accept':       'application/json',          // we want JSON back
  },
  withCredentials: true,                         // send cookies with requests
})

/*
  INTERCEPTORS
  
  Think of interceptors like airport security:
  
  Request interceptor:
    Every request MUST go through here before leaving
    We can add auth tokens, log requests, etc.
  
  Response interceptor:
    Every response MUST go through here when it arrives
    We can handle errors globally, transform data, etc.
*/

// REQUEST INTERCEPTOR
axiosClient.interceptors.request.use(
  (config) => {
    // You can add auth token here later:
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`

    // Log in development only
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// RESPONSE INTERCEPTOR
axiosClient.interceptors.response.use(
  (response) => {
    // Request was successful (status 200-299)
    // Just return the data directly (not the whole axios response)
    return response
  },
  (error: AxiosError) => {
    // Request failed — handle common errors globally

    if (error.response) {
      // Server responded with an error status
      const status = error.response.status

      switch (status) {
        case 401:
          console.error('Not authenticated')
          // Later: redirect to login
          break
        case 403:
          console.error('Not authorized')
          break
        case 404:
          console.error('Not found')
          break
        case 429:
          console.error('Too many requests — slow down!')
          break
        case 500:
          console.error('Server error')
          break
      }
    } else if (error.request) {
      // Request was made but no response received
      // Usually means backend is offline
      console.error('Cannot reach server. Is the backend running?')
    }

    return Promise.reject(error)
  }
)

export default axiosClient
