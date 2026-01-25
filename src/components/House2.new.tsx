"use client";
import React, { useRef, useEffect, useState } from "react";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from 'three';
import dynamic from 'next/dynamic';

// Dynamically import DebugOverlay with no SSR
const DebugOverlay = dynamic(() => import('./DebugOverlay').then(mod => mod.DebugOverlay), {
  ssr: false
});

interface House2Props {
  scale?: number;
  onLoaded?: () => void;
  activeCamera: string;
  orbitControlsRef: React.RefObject<any>;
  triggerSignal?: number;
  debug?: boolean;
  onAnimationComplete?: () => void;
  resetSignal?: number;
}

const House2 = ({ 
  scale = 1, 
  onLoaded, 
  activeCamera, 
  orbitControlsRef, 
  triggerSignal, 
  debug = false,
  onAnimationComplete,
  resetSignal 
}: House2Props) => {
  const group = useRef<THREE.Group | null>(null);
  const gltf: any = useGLTF("/projectHouse09-01.glb") as any;
  const { nodes, materials, scene } = gltf;
  const animations: THREE.AnimationClip[] = (gltf.animations as THREE.AnimationClip[]) || [];
  const { camera, set } = useThree();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  
  const cameraBackRef = useRef<any>();
  const cameraSlrRef = useRef<any>();
  const cameraStartRef = useRef<any>();
  const cameraRedRef = useRef<any>();
  const initialMount = useRef(true);
  const preloadedClips = useRef<Record<string, THREE.AnimationClip>>({});

  // All your existing useEffects and functions here...
  // (copy them from the original file)

  if (!nodes || !materials) {
    return null;
  }

  return (
    <>
      {typeof window !== 'undefined' && (
        <DebugOverlay
          animations={animations}
          onPlayByIndex={playAnimationByIndex}
          onPlayByName={playAnimationByName}
          enabled={debug}
        />
      )}
      <group ref={group} dispose={null}>
        <group name="Scene">
          {/* Your existing scene structure here */}
        </group>
      </group>
    </>
  );
};

useGLTF.preload('/projectHouse09-01.glb');
export default House2;