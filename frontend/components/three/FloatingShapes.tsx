'use client'

import { useRef, useMemo } from 'react'
import { useFrame }        from '@react-three/fiber'
import * as THREE from 'three'
/*
  useFrame = runs every animation frame (60 times per second)
  Like requestAnimationFrame but for Three.js.

  We use it to:
  - Rotate objects
  - Move objects up and down (floating effect)
  - Change colors over time
*/

// ========================
// FLOATING BOX
// ========================
interface FloatingBoxProps {
  position: [number, number, number]
  size?:    [number, number, number]
  color?:   string
  speed?:   number
  rotationSpeed?: number
}

export function FloatingBox({
  position,
  size    = [1, 1, 1],
  color   = '#7c3aed',
  speed   = 1,
  rotationSpeed = 0.5,
}: FloatingBoxProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  /*
    useMemo = calculate once, reuse every frame.
    We use a random offset so each shape floats
    at a different phase — they do not all move together.
  */
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const t = clock.getElapsedTime()

    // Float up and down using sine wave
    // Math.sin goes from -1 to 1 smoothly
    meshRef.current.position.y =
      position[1] + Math.sin(t * speed + offset) * 0.3

    // Rotate on multiple axes
    meshRef.current.rotation.x += 0.003 * rotationSpeed
    meshRef.current.rotation.y += 0.005 * rotationSpeed
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.15}
        wireframe={false}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  )
}

// ========================
// FLOATING TORUS (donut shape)
// ========================
interface FloatingTorusProps {
  position:      [number, number, number]
  color?:        string
  speed?:        number
  rotationSpeed?: number
}

export function FloatingTorus({
  position,
  color = '#3b82f6',
  speed = 0.8,
  rotationSpeed = 0.3,
}: FloatingTorusProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const offset  = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    meshRef.current.position.y =
      position[1] + Math.sin(t * speed + offset) * 0.4

    meshRef.current.rotation.x += 0.004 * rotationSpeed
    meshRef.current.rotation.z += 0.003 * rotationSpeed
  })

  return (
    <mesh ref={meshRef} position={position}>
      {/*
        torusGeometry args:
        [radius, tube, radialSegments, tubularSegments]

        radius = size of the donut
        tube   = thickness of the ring
        segments = how smooth it looks (higher = smoother)
      */}
      <torusGeometry args={[0.6, 0.2, 16, 40]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.2}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  )
}

// ========================
// FLOATING OCTAHEDRON (diamond shape)
// ========================
interface FloatingOctahedronProps {
  position: [number, number, number]
  color?:   string
  speed?:   number
  scale?:   number
}

export function FloatingOctahedron({
  position,
  color = '#06b6d4',
  speed = 1.2,
  scale = 1,
}: FloatingOctahedronProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const offset  = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    meshRef.current.position.y =
      position[1] + Math.sin(t * speed + offset) * 0.35

    // Spin on Y axis
    meshRef.current.rotation.y += 0.008 * speed
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <octahedronGeometry args={[0.5]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.25}
        roughness={0.05}
        metalness={1}
      />
    </mesh>
  )
}

// ========================
// WIREFRAME SPHERE
// ========================
interface WireframeSphereProps {
  position: [number, number, number]
  radius?:  number
  color?:   string
  speed?:   number
}

export function WireframeSphere({
  position,
  radius = 1,
  color  = '#7c3aed',
  speed  = 0.5,
}: WireframeSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const offset  = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    meshRef.current.position.y =
      position[1] + Math.sin(t * speed + offset) * 0.2

    meshRef.current.rotation.y += 0.003
    meshRef.current.rotation.z += 0.002
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 12, 12]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.08}
        wireframe={true}
      />
    </mesh>
  )
}

// ========================
// PARTICLE FIELD
// Hundreds of tiny floating dots
// ========================
interface ParticleFieldProps {
  count?: number
  color?: string
}

export function ParticleField({
  count = 80,
  color = '#7c3aed',
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)

  /*
    We generate random positions for all particles once.
    useMemo = only runs once, not every frame.

    Float32Array = typed array (faster than normal array for 3D)
    Each particle needs 3 values: x, y, z
  */
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 20  // x: -10 to 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20  // y: -10 to 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10  // z: -5 to 5
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    // Slowly rotate the entire particle field
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02
    pointsRef.current.rotation.x = clock.getElapsedTime() * 0.01
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.05}
        transparent
        opacity={0.4}
        sizeAttenuation={true}
        // sizeAttenuation = farther particles appear smaller (realistic)
      />
    </points>
  )
}
