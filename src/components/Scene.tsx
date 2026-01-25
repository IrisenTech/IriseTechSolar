'use client'

import { Canvas, useThree } from '@react-three/fiber'
import Model from './Model'
import { Suspense } from 'react'
import {useProgress, Html, ScrollControls, OrbitControls} from '@react-three/drei'
import { PerspectiveCamera, CameraHelper } from 'three'
import { div } from 'framer-motion/client'
//import { useEffect, useRef } from 'react'
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//import { PerspectiveCamera } from 'three'   

function Loader() {
    const { progress } = useProgress()
    return <Html center>{progress.toFixed(1)} % loaded</Html>
  } 

  function Controls(){
    const{ 
        camera, 
        gl:{ domElement },
     } = useThree();
     return <OrbitControls args={[camera, domElement]} />
  }
  function CameraHelperComponent() {
    const camera = new PerspectiveCamera(90, 1, 1, 3);
    return <primitive object={new CameraHelper(camera)} position={[-5, -5, 15]} />;
  }
  



export default function Scene({ gltfPath }: { gltfPath: string }) {
  return(
    <section className="flex h-[500px]">
      <Canvas camera={{position:[0, 0, 5], fov:30, near:2, far:12}} gl={{antialias:true}} dpr={[1, 1.5]} style={{width:'100%', height:'100vh', display:'block'}}>
        <directionalLight position={[0, 0, 5]} intensity={4} />
        <Suspense fallback={<Loader/>}>
          <ScrollControls pages={2} damping={0.2}>
            <Model gltfPath={gltfPath} />
          </ScrollControls>
          <Controls/>
        </Suspense>
      </Canvas>
    </section>
  )
}

        