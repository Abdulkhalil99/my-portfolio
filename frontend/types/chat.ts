export interface ChatMessage {
  role:    'user' | 'model'
  content: string
}

export interface DisplayMessage {
  id:        string
  role:      'user' | 'model'
  content:   string
  isLoading?: boolean   // true while AI is typing
}
