// cn = classNames
// This is a helper function to combine Tailwind classes cleanly

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/*
  WHY do we need this?
  
  Problem: Tailwind conflicts
  <div className={`p-4 ${isLarge ? 'p-8' : ''}`}> 
  This gives: "p-4 p-8" ← CONFLICT! Which one wins?
  
  Solution: cn() automatically resolves conflicts
  <div className={cn('p-4', isLarge && 'p-8')}>
  This gives: "p-8" ← CORRECT!
*/

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}