'use client'

import { Suspense } from 'react'
import { Canvas }  from '@react-three/fiber'
import {
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei'
import {
  FloatingBox,
  FloatingTorus,
  FloatingOctahedron,
  WireframeSphere,
  ParticleField,
} from './FloatingShapes'

/*
  Canvas = the 3D viewport
  Everything inside Canvas is rendered in 3D.
  Everything outside Canvas is normal HTML/CSS.

  Think of Canvas like a <video> element —
  it is an HTML element but what is inside is special.
*/

function Scene() {
  return (
    <>
      {/*
        CAMERA
        fov = field of view (how wide you can see)
        75 degrees is natural, like human vision
        position = where the camera is in 3D space
        Z = 5 means camera is 5 units in front of the scene
      */}
      <PerspectiveCamera makeDefault fov={75} position={[0, 0, 5]} />

      {/*
        LIGHTS
        Without lights, everything is black.

        ambientLight = light from everywhere (no shadows)
        intensity 0.3 = dim, so shapes are mostly dark

        directionalLight = light from one direction (like sun)
        position [5, 5, 5] = top-right-front
        This creates nice highlights on shapes
      */}
      
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#ffffff"
      />
      <directionalLight
        position={[-5, -5, -5]}
        intensity={0.2}
        color="#7c3aed"
      />

      {/*
        SHAPES
        position = [x, y, z]
        x: negative = left, positive = right
        y: negative = down, positive = up
        z: negative = far, positive = near
      */}

      {/* Left side shapes */}
      <FloatingBox
        position={[-3.5, 1.5, -1]}
        size={[0.8, 0.8, 0.8]}
        color="#7c3aed"
        speed={0.8}
      />
      <FloatingTorus
        position={[-2.5, -1.5, -2]}
        color="#3b82f6"
        speed={0.6}
      />
      <FloatingOctahedron
        position={[-4, -0.5, -1]}
        color="#06b6d4"
        speed={1}
        scale={0.8}
      />

      {/* Right side shapes */}
      <FloatingBox
        position={[3.5, -1, -1]}
        size={[0.6, 0.6, 0.6]}
        color="#3b82f6"
        speed={1.2}
        rotationSpeed={0.8}
      />
      <FloatingTorus
        position={[2.5, 1.5, -2]}
        color="#7c3aed"
        speed={0.9}
      />
      <FloatingOctahedron
        position={[4, 0.5, -0.5]}
        color="#7c3aed"
        speed={0.7}
        scale={1.2}
      />

      {/* Center background */}
      <WireframeSphere
        position={[0, 0, -3]}
        radius={2}
        color="#7c3aed"
        speed={0.3}
      />

      {/* Small accent shapes */}
      <FloatingBox
        position={[1.5, 2.5, -2]}
        size={[0.3, 0.3, 0.3]}
        color="#06b6d4"
        speed={1.5}
      />
      <FloatingBox
        position={[-1.5, -2.5, -1.5]}
        size={[0.4, 0.4, 0.4]}
        color="#10b981"
        speed={1.1}
      />

      {/* Particle field in background */}
      <ParticleField count={100} color="#7c3aed" />

      {/*
        OrbitControls = lets user rotate the scene with mouse
        enableZoom = false: we do not want user to zoom in/out
        enablePan  = false: no dragging the view
        autoRotate = slowly spins the scene automatically
        autoRotateSpeed = how fast it spins
        maxPolarAngle / minPolarAngle = limit up/down rotation
      */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
    </>
  )
}

/*
  HeroScene is what you put in your page.
  It is a normal React component that renders a Canvas.
*/
export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        gl={{
          antialias:          true,   // smooth edges
          alpha:              true,   // transparent background
          powerPreference:    'high-performance',
        }}
        dpr={[1, 2]}
        // dpr = device pixel ratio
        // [1, 2] = use up to 2x for retina screens
        // but not higher (performance)
      >
        {/*
          Suspense = show nothing while 3D loads
          We do not need a fallback because the page
          content is visible anyway (HTML in front)
        */}
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
