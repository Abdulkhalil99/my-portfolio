// This is a "barrel file"
// Instead of importing from 3 different files:
//   import { Button } from '@/components/ui/Button'
//   import { Card } from '@/components/ui/Card'
//   import { Badge } from '@/components/ui/Badge'
//
// You can now do ONE import:
//   import { Button, Card, Badge } from '@/components/ui'

export { Button } from './Button'
export { Card, CardHeader, CardBody, CardFooter } from './Card'
export { Container } from './Container'
export { Section } from './Section'
export { Badge } from './Badge'