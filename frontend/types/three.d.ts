import '@react-three/fiber'

declare module '@react-three/fiber' {
  interface ThreeElements {
    bufferAttribute: {
      attach:    string
      args:      [ArrayLike<number>, number]
      count?:    number
      itemSize?: number
    }
  }
}
