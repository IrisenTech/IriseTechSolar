'use client'
import React, { useRef } from 'react'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import House2 from '@/components/House2'

interface SceneHouseProps {
  activeCamera: string;
  playTrigger?: number;
  onAnimationComplete?: () => void;
  resetSignal?: number;
}

const SceneHouse = ({ activeCamera, playTrigger, onAnimationComplete, resetSignal }: SceneHouseProps) => {
  const orbitControlsRef = useRef<any>();

  return (
    <div className="w-full h-full">
      <Canvas
        className="w-full h-full bg-transparent"
        camera={{
          position: [-5, 20, 95],
          fov: 55,
          near: 0.1,
          far: 1000,
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <OrbitControls
            ref={orbitControlsRef}
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={false}
            minDistance={5}
            maxDistance={100}
          />

          <Environment preset="city" />
          <House2 
            orbitControlsRef={orbitControlsRef}
            triggerSignal={playTrigger}
            onAnimationComplete={onAnimationComplete}
            resetSignal={resetSignal}
            debug={true}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default SceneHouse