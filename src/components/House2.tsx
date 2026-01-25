"use client";
import React, { useRef, useEffect, useState } from "react";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from 'three';

interface House2Props {
  scale?: number;
  onLoaded?: () => void;
  orbitControlsRef: React.RefObject<any>;
  triggerSignal?: number;
  debug?: boolean;
  onAnimationComplete?: () => void;
  resetSignal?: number;
}

const House2 = ({ 
  scale = 1, 
  orbitControlsRef, 
  triggerSignal, 
  debug = false, 
  onAnimationComplete, 
  resetSignal 
}: House2Props) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations, nodes, materials } = useGLTF("/projectHouse09-02.glb") as any;
  const { camera } = useThree();
  
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));
  const [isLoaded, setIsLoaded] = useState(false);
  const initialCameraRef = useRef<{ position: THREE.Vector3; rotation: THREE.Euler } | null>(null);

  // Camera references
  const cameraBackRef = useRef<THREE.Camera>();
  const mountedRef = useRef(false);
  const prevTriggerRef = useRef<number | undefined>(undefined);

  // Initialize and find cameras
  useEffect(() => {
    if (scene) {
      scene.traverse((object: any) => {
        if (object instanceof THREE.Camera && object.name === "CamerarbACK") {
          console.log('Found camera:', object.name);
          cameraBackRef.current = object;
          // Capture the initial camera position and rotation
          if (!initialCameraRef.current) {
            initialCameraRef.current = {
              position: object.position.clone(),
              rotation: object.rotation.clone()
            };
            console.log('Initial camera position saved:', initialCameraRef.current.position);
          }
        }
      });
      // Log animation clips detected in the glb for debugging
      if (animations && animations.length) {
        console.log('[House2] GLB animations found:', animations.map((a: any) => a.name));
      } else {
        console.log('[House2] No animations found in GLB');
      }
      setIsLoaded(true);
    }
  }, [scene, animations]);

  // Handle camera animations
  useEffect(() => {
    // Start animation only when triggerSignal changes (guard against mount and duplicates)
    if (!mountedRef.current) {
      mountedRef.current = true;
    }

  if (!isLoaded) return;
  console.log('[House2] triggerSignal changed ->', triggerSignal);

    // require a triggerSignal value and run only when it changes
    if (triggerSignal === undefined || triggerSignal === null) return;
    if (prevTriggerRef.current !== undefined && prevTriggerRef.current === triggerSignal) return;
    prevTriggerRef.current = triggerSignal;

    const targetCamera = cameraBackRef.current;

    if (targetCamera) {
      // Play camera animation if CamerarbACK is triggered
      let cameraAnimationDuration = 2000; // default 2 seconds
      let animationFrameCount = 0;

  if (mixer && animations && animations.length > 0) {
        // Prefer any animation that references the camera node, fallback to first clip
        const cameraAnim = animations.find((clip: any) =>
          Array.isArray(clip.tracks) && clip.tracks.some((t: any) => typeof t.name === 'string' && (t.name.includes('CamerarbACK') || /camera/i.test(t.name)))
        ) || animations[0];

        if (cameraAnim) {
          animationInProgressRef.current = true;
          const action = mixer.clipAction(cameraAnim);
          // Ensure the action starts cleanly from frame 0
          try {
            action.reset();
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
            // ensure full weight/timeScale
            if (typeof action.setEffectiveTimeScale === 'function') action.setEffectiveTimeScale(1);
            if (typeof action.setEffectiveWeight === 'function') action.setEffectiveWeight(1);
            action.enabled = true as any;
            action.play();
            // keep reference so reset can control it
            currentActionRef.current = action;
          } catch (e) {
            console.warn('[House2] Failed to play camera action cleanly', e);
          }
          // Calculate duration based on animation clip
          cameraAnimationDuration = (cameraAnim.duration * 1000) || 2000;
          animationFrameCount = cameraAnim.tracks?.[0]?.times?.length || 60;
          console.log('[House2] Playing camera clip:', cameraAnim.name, 'duration(ms):', cameraAnimationDuration, 'frames:', animationFrameCount);
        }
      } else {
        if (debug) console.log('[House2] No camera animation found or not triggered.');
  }

      // Disable orbit controls during transition
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = false;
      }

      // Smooth camera transition (will interpolate to camera node transform while clip plays)
      const startPosition = camera.position.clone();
      const startRotation = camera.rotation.clone();
      const startQuaternion = camera.quaternion.clone();
      const targetPosition = targetCamera.position.clone();
      const targetQuaternion = targetCamera.quaternion.clone();
      
      const duration = cameraAnimationDuration;
      const startTime = Date.now();
      let frameCount = 0;

      const animateCamera = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        frameCount++;
        
        // Smooth easing function
        const ease = progress < 0.5 
          ? 2 * progress * progress 
          : -1 + (4 - 2 * progress) * progress;

        // Interpolate position
        camera.position.lerpVectors(startPosition, targetPosition, ease);
        
        // Interpolate rotation using quaternions for smooth rotation
        camera.quaternion.slerpQuaternions(startQuaternion, targetQuaternion, ease);
        
        camera.updateProjectionMatrix();

        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        } else {
          // Ensure animation completes all frames
          console.log('[House2] Animation frames rendered:', frameCount);
          animationInProgressRef.current = false;
          
          // Re-enable controls after transition
          if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = true;
            orbitControlsRef.current.update();
          }
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }
      };

      animateCamera();
    }
  }, [isLoaded, triggerSignal, animations, mixer, camera, orbitControlsRef, onAnimationComplete, debug]);

  // Handle camera reset
  useEffect(() => {
    if (!resetSignal || !isLoaded || !initialCameraRef.current) return;

    // Strict reset: rewind any camera animation to its first frame and stop it there
    try {
      // Reset and stop any currently referenced action
      if (currentActionRef.current) {
        try {
          currentActionRef.current.reset();
          currentActionRef.current.stop();
          // pause and disable to avoid implicit replay
          (currentActionRef.current as any).paused = true;
          (currentActionRef.current as any).enabled = false;
        } catch (e) {
          console.warn('[House2] Failed to reset current action', e);
        }
        currentActionRef.current = null;
      }

      // Reset all actions created from clips to ensure next play starts at frame 0
      if (animations && animations.length && mixer) {
        animations.forEach((clip: any) => {
          const a = mixer.existingAction(clip) || mixer.clipAction(clip);
          if (a) {
            try {
              a.reset();
              a.stop();
              (a as any).paused = true;
              (a as any).enabled = false;
              if (typeof a.setEffectiveWeight === 'function') a.setEffectiveWeight(0);
            } catch (e) {
              console.warn('[House2] Failed to reset action for clip', clip.name, e);
            }
          }
        });
      }

      // Rewind mixer time to start
      if (mixer && typeof (mixer as any).setTime === 'function') {
        try { (mixer as any).setTime(0); } catch (e) { /* ignore */ }
      }
      if (mixer) mixer.stopAllAction();
    } catch (e) {
      console.warn('[House2] Error during strict reset', e);
    }
    animationInProgressRef.current = false;

    // Smooth reset to initial position
    const startPosition = camera.position.clone();
    const startRotation = camera.rotation.clone();
    const initialPosition = initialCameraRef.current.position.clone();
    const initialRotation = initialCameraRef.current.rotation.clone();
    
    const duration = 1500;
    const startTime = Date.now();

    const resetCamera = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;

      camera.position.lerpVectors(startPosition, initialPosition, ease);
      
      camera.rotation.x = THREE.MathUtils.lerp(startRotation.x, initialRotation.x, ease);
      camera.rotation.y = THREE.MathUtils.lerp(startRotation.y, initialRotation.y, ease);
      camera.rotation.z = THREE.MathUtils.lerp(startRotation.z, initialRotation.z, ease);
      
      camera.updateProjectionMatrix();

      if (progress < 1) {
        requestAnimationFrame(resetCamera);
      } else {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = true;
          orbitControlsRef.current.reset();
          orbitControlsRef.current.update();
        }
      }
    };

    resetCamera();
  }, [resetSignal, isLoaded, camera, mixer, orbitControlsRef, animations]);

  // Handle animation state
  const animationInProgressRef = useRef(false);
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);

  // Update animation mixer
  useFrame((_, delta) => {
    if (mixer && animationInProgressRef.current) {
      mixer.update(delta);
    }
  });

  // Scale and position the scene
  useEffect(() => {
    if (group.current) {
      group.current.scale.set(scale, scale, scale);
    }
  }, [scale]);

  if (!isLoaded) {
    return null;
  }

  return (
     <group ref={group}  dispose={null}>
      <group name="Scene">
        <group name="Empty" position={[0, 1.224, 0]}>
          <group name="pCube2" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh001"
              castShadow
              receiveShadow
              geometry={nodes.Mesh001.geometry}
              material={materials.yelow}
            />
            <mesh
              name="Mesh001_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh001_1.geometry}
              material={materials.Metal}
            />
            <mesh
              name="Mesh001_2"
              castShadow
              receiveShadow
              geometry={nodes.Mesh001_2.geometry}
              material={materials.lambert1}
            />
            <mesh
              name="Mesh001_3"
              castShadow
              receiveShadow
              geometry={nodes.Mesh001_3.geometry}
              material={materials.black}
            />
          </group>
          <group name="pCube2001" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh009"
              castShadow
              receiveShadow
              geometry={nodes.Mesh009.geometry}
              material={materials.yelow}
            />
            <mesh
              name="Mesh009_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh009_1.geometry}
              material={materials.Metal}
            />
            <mesh
              name="Mesh009_2"
              castShadow
              receiveShadow
              geometry={nodes.Mesh009_2.geometry}
              material={materials.lambert1}
            />
            <mesh
              name="Mesh009_3"
              castShadow
              receiveShadow
              geometry={nodes.Mesh009_3.geometry}
              material={materials.black}
            />
          </group>
          <group name="pCube2002" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh011"
              castShadow
              receiveShadow
              geometry={nodes.Mesh011.geometry}
              material={materials.yelow}
            />
            <mesh
              name="Mesh011_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh011_1.geometry}
              material={materials.Metal}
            />
            <mesh
              name="Mesh011_2"
              castShadow
              receiveShadow
              geometry={nodes.Mesh011_2.geometry}
              material={materials.lambert1}
            />
            <mesh
              name="Mesh011_3"
              castShadow
              receiveShadow
              geometry={nodes.Mesh011_3.geometry}
              material={materials.black}
            />
          </group>
          <group name="pCube2003" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh013"
              castShadow
              receiveShadow
              geometry={nodes.Mesh013.geometry}
              material={materials.yelow}
            />
            <mesh
              name="Mesh013_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh013_1.geometry}
              material={materials.Metal}
            />
            <mesh
              name="Mesh013_2"
              castShadow
              receiveShadow
              geometry={nodes.Mesh013_2.geometry}
              material={materials.lambert1}
            />
            <mesh
              name="Mesh013_3"
              castShadow
              receiveShadow
              geometry={nodes.Mesh013_3.geometry}
              material={materials.black}
            />
          </group>
          <group name="pCube2004" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh015"
              castShadow
              receiveShadow
              geometry={nodes.Mesh015.geometry}
              material={materials.yelow}
            />
            <mesh
              name="Mesh015_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh015_1.geometry}
              material={materials.Metal}
            />
            <mesh
              name="Mesh015_2"
              castShadow
              receiveShadow
              geometry={nodes.Mesh015_2.geometry}
              material={materials.lambert1}
            />
            <mesh
              name="Mesh015_3"
              castShadow
              receiveShadow
              geometry={nodes.Mesh015_3.geometry}
              material={materials.black}
            />
          </group>
          <group name="pCube2005" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh017"
              castShadow
              receiveShadow
              geometry={nodes.Mesh017.geometry}
              material={materials.yelow}
            />
            <mesh
              name="Mesh017_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh017_1.geometry}
              material={materials.Metal}
            />
            <mesh
              name="Mesh017_2"
              castShadow
              receiveShadow
              geometry={nodes.Mesh017_2.geometry}
              material={materials.lambert1}
            />
            <mesh
              name="Mesh017_3"
              castShadow
              receiveShadow
              geometry={nodes.Mesh017_3.geometry}
              material={materials.black}
            />
          </group>
          <group name="pCube2006" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh019"
              castShadow
              receiveShadow
              geometry={nodes.Mesh019.geometry}
              material={materials.yelow}
            />
            <mesh
              name="Mesh019_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh019_1.geometry}
              material={materials.Metal}
            />
            <mesh
              name="Mesh019_2"
              castShadow
              receiveShadow
              geometry={nodes.Mesh019_2.geometry}
              material={materials.lambert1}
            />
            <mesh
              name="Mesh019_3"
              castShadow
              receiveShadow
              geometry={nodes.Mesh019_3.geometry}
              material={materials.black}
            />
          </group>
          <group name="pCube2007" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh021"
              castShadow
              receiveShadow
              geometry={nodes.Mesh021.geometry}
              material={materials.yelow}
            />
            <mesh
              name="Mesh021_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh021_1.geometry}
              material={materials.Metal}
            />
            <mesh
              name="Mesh021_2"
              castShadow
              receiveShadow
              geometry={nodes.Mesh021_2.geometry}
              material={materials.lambert1}
            />
            <mesh
              name="Mesh021_3"
              castShadow
              receiveShadow
              geometry={nodes.Mesh021_3.geometry}
              material={materials.black}
            />
          </group>
          <group name="pCube2008" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh023"
              castShadow
              receiveShadow
              geometry={nodes.Mesh023.geometry}
              material={materials.yelow}
            />
            <mesh
              name="Mesh023_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh023_1.geometry}
              material={materials.Metal}
            />
            <mesh
              name="Mesh023_2"
              castShadow
              receiveShadow
              geometry={nodes.Mesh023_2.geometry}
              material={materials.lambert1}
            />
            <mesh
              name="Mesh023_3"
              castShadow
              receiveShadow
              geometry={nodes.Mesh023_3.geometry}
              material={materials.black}
            />
          </group>
          <group name="pCube6" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh004"
              castShadow
              receiveShadow
              geometry={nodes.Mesh004.geometry}
              material={materials.solar_}
            />
            <mesh
              name="Mesh004_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh004_1.geometry}
              material={materials.Metal}
            />
          </group>
          <group name="pCube6001" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh010"
              castShadow
              receiveShadow
              geometry={nodes.Mesh010.geometry}
              material={materials.solar_}
            />
            <mesh
              name="Mesh010_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh010_1.geometry}
              material={materials.Metal}
            />
          </group>
          <group name="pCube6002" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh012"
              castShadow
              receiveShadow
              geometry={nodes.Mesh012.geometry}
              material={materials.solar_}
            />
            <mesh
              name="Mesh012_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh012_1.geometry}
              material={materials.Metal}
            />
          </group>
          <group name="pCube6003" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh014"
              castShadow
              receiveShadow
              geometry={nodes.Mesh014.geometry}
              material={materials.solar_}
            />
            <mesh
              name="Mesh014_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh014_1.geometry}
              material={materials.Metal}
            />
          </group>
          <group name="pCube6004" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh016"
              castShadow
              receiveShadow
              geometry={nodes.Mesh016.geometry}
              material={materials.solar_}
            />
            <mesh
              name="Mesh016_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh016_1.geometry}
              material={materials.Metal}
            />
          </group>
          <group name="pCube6005" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh018"
              castShadow
              receiveShadow
              geometry={nodes.Mesh018.geometry}
              material={materials.solar_}
            />
            <mesh
              name="Mesh018_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh018_1.geometry}
              material={materials.Metal}
            />
          </group>
          <group name="pCube6006" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh020"
              castShadow
              receiveShadow
              geometry={nodes.Mesh020.geometry}
              material={materials.solar_}
            />
            <mesh
              name="Mesh020_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh020_1.geometry}
              material={materials.Metal}
            />
          </group>
          <group name="pCube6007" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh022"
              castShadow
              receiveShadow
              geometry={nodes.Mesh022.geometry}
              material={materials.solar_}
            />
            <mesh
              name="Mesh022_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh022_1.geometry}
              material={materials.Metal}
            />
          </group>
          <group name="pCube6008" position={[0, -0.406, 0]}>
            <mesh
              name="Mesh024"
              castShadow
              receiveShadow
              geometry={nodes.Mesh024.geometry}
              material={materials.solar_}
            />
            <mesh
              name="Mesh024_1"
              castShadow
              receiveShadow
              geometry={nodes.Mesh024_1.geometry}
              material={materials.Metal}
            />
          </group>
        </group>
        <mesh
          name="Cube001"
          castShadow
          receiveShadow
          geometry={nodes.Cube001.geometry}
          material={materials['Material.037']}
          position={[0.29, 0.817, 0.484]}
          scale={6.407}
        />
        <mesh
          name="Cube002"
          castShadow
          receiveShadow
          geometry={nodes.Cube002.geometry}
          material={materials.CHÃO}
          position={[0.29, 1.404, 0.484]}
          scale={6.066}
        />
        <group name="andar_de_baixo001" position={[0, 0.201, 0]}>
          <mesh
            name="Cube006"
            castShadow
            receiveShadow
            geometry={nodes.Cube006.geometry}
            material={materials['Paredes branca.001']}
          />
          <mesh
            name="Cube006_1"
            castShadow
            receiveShadow
            geometry={nodes.Cube006_1.geometry}
            material={materials['Paredes preta.001']}
          />
        </group>
        <group name="andar_de_baixo_2001" position={[0, 0.874, 0]}>
          <mesh
            name="Cube007"
            castShadow
            receiveShadow
            geometry={nodes.Cube007.geometry}
            material={materials['Paredes branca.001']}
          />
          <mesh
            name="Cube007_1"
            castShadow
            receiveShadow
            geometry={nodes.Cube007_1.geometry}
            material={materials['Material.003']}
          />
          <mesh
            name="Cube007_2"
            castShadow
            receiveShadow
            geometry={nodes.Cube007_2.geometry}
            material={materials['Paredes preta.001']}
          />
        </group>
        <mesh
          name="andar_de_cima_2001"
          castShadow
          receiveShadow
          geometry={nodes.andar_de_cima_2001.geometry}
          material={materials['Paredes preta.001']}
          position={[0, 0.201, 0]}
        />
        <mesh
          name="batente_porta001"
          castShadow
          receiveShadow
          geometry={nodes.batente_porta001.geometry}
          material={materials['Material.004']}
          position={[0, 0.201, 0]}
        />
        <mesh
          name="escadinha001"
          castShadow
          receiveShadow
          geometry={nodes.escadinha001.geometry}
          material={materials['escadinha.001']}
          position={[0, 0.948, 0]}
        />
        <mesh
          name="Guarda_corpo001"
          castShadow
          receiveShadow
          geometry={nodes.Guarda_corpo001.geometry}
          material={materials['Guarda corpo.001']}
          position={[0, 0.201, 0]}
        />
        <mesh
          name="MarcosVentanas"
          castShadow
          receiveShadow
          geometry={nodes.MarcosVentanas.geometry}
          material={materials['batentes preto.001']}
          morphTargetDictionary={nodes.MarcosVentanas.morphTargetDictionary}
          morphTargetInfluences={nodes.MarcosVentanas.morphTargetInfluences}
          position={[0, 0.201, 0]}
        />
        <mesh
          name="Madeira002"
          castShadow
          receiveShadow
          geometry={nodes.Madeira002.geometry}
          material={materials['Material.004']}
          position={[0, 0.201, 0]}
        />
        <mesh
          name="Madeira003"
          castShadow
          receiveShadow
          geometry={nodes.Madeira003.geometry}
          material={materials['Material.004']}
          position={[0, 0.201, 0]}
        />
        <group name="Porta001" position={[0, 0.201, 0]}>
          <mesh
            name="Cube030"
            castShadow
            receiveShadow
            geometry={nodes.Cube030.geometry}
            material={materials['Material.038']}
          />
          <mesh
            name="Cube030_1"
            castShadow
            receiveShadow
            geometry={nodes.Cube030_1.geometry}
            material={materials['Maçaneta.001']}
          />
        </group>
        <mesh
          name="andar_de_cima002"
          castShadow
          receiveShadow
          geometry={nodes.andar_de_cima002.geometry}
          material={materials['Paredes preta.001']}
          position={[0, 0.925, 0]}
        />
        <mesh
          name="VentanasGlass"
          castShadow
          receiveShadow
          geometry={nodes.VentanasGlass.geometry}
          material={materials['Vidro.001']}
          morphTargetDictionary={nodes.VentanasGlass.morphTargetDictionary}
          morphTargetInfluences={nodes.VentanasGlass.morphTargetInfluences}
          position={[0, 0.201, 0]}
        />
        <mesh
          name="fondo001"
          castShadow
          receiveShadow
          geometry={nodes.fondo001.geometry}
          material={materials['batentes preto.001']}
          position={[0, 0.201, 0]}
        />
        <mesh
          name="MARCO02002"
          castShadow
          receiveShadow
          geometry={nodes.MARCO02002.geometry}
          material={materials['batentes preto.001']}
          morphTargetDictionary={nodes.MARCO02002.morphTargetDictionary}
          morphTargetInfluences={nodes.MARCO02002.morphTargetInfluences}
          position={[0, 0.201, 0]}
        />
        <mesh
          name="MARCO03001"
          castShadow
          receiveShadow
          geometry={nodes.MARCO03001.geometry}
          material={materials['batentes preto.001']}
          position={[0, 0.201, 0]}
        />
        <mesh
          name="andar_de_baixo_2002"
          castShadow
          receiveShadow
          geometry={nodes.andar_de_baixo_2002.geometry}
          material={materials['Paredes branca.001']}
          position={[0, 0.874, 0]}
        />
        <mesh
          name="andar_de_baixo_2003"
          castShadow
          receiveShadow
          geometry={nodes.andar_de_baixo_2003.geometry}
          material={materials['Paredes branca.001']}
          position={[0, 0.201, 0]}
        />
        <mesh
          name="MarcosVentanas001"
          castShadow
          receiveShadow
          geometry={nodes.MarcosVentanas001.geometry}
          material={materials['Guarda corpo.001']}
          morphTargetDictionary={nodes.MarcosVentanas001.morphTargetDictionary}
          morphTargetInfluences={nodes.MarcosVentanas001.morphTargetInfluences}
          position={[0, 0.201, 0]}
        />
        <group
          name="Sketchfab_model"
          position={[-3.678, -2.815, 1.631]}
          rotation={[Math.PI, -1.39, Math.PI]}>
          <group name="root" position={[0.047, 0, -0.658]} rotation={[0, 0.422, 0]}>
            <group
              name="GLTF_SceneRootNode"
              position={[-0.087, 0, 0.189]}
              rotation={[0, -0.083, 0]}>
              <group name="30K001_3" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_6"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_6.geometry}
                  material={materials['Material.023']}
                  position={[-4.028, 5.318, -0.517]}
                />
              </group>
              <group name="30K002_4" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_8"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_8.geometry}
                  material={materials['Material.024']}
                  position={[-3.931, 4.42, -0.643]}
                />
              </group>
              <group name="30K003_5" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_10"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_10.geometry}
                  material={materials['Material.022']}
                  position={[-3.731, 4.473, -0.531]}
                />
              </group>
              <group name="30K004_6" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_12"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_12.geometry}
                  material={materials['Material.025']}
                  position={[-4.034, 5.1, -0.519]}
                />
              </group>
              <group name="30K005_8" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_16"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_16.geometry}
                  material={materials['Material.027']}
                  position={[-3.943, 4.454, -0.135]}
                />
              </group>
              <group name="30K006_9" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_18"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_18.geometry}
                  material={materials['Material.028']}
                  position={[-3.831, 4.361, -0.519]}
                />
              </group>
              <group name="30K007_10" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_20"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_20.geometry}
                  material={materials['Material.029']}
                  position={[-3.942, 4.436, -0.135]}
                />
              </group>
              <group name="30K008_13" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_26"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_26.geometry}
                  material={materials['Material.031']}
                  position={[-4.033, 5.076, -0.519]}
                />
              </group>
              <group name="30K009_14" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_28"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_28.geometry}
                  material={materials['Material.032']}
                  position={[-3.831, 4.452, -0.574]}
                />
              </group>
              <group name="30K010_16" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_32"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_32.geometry}
                  material={materials['Material.022']}
                  position={[-3.831, 5.815, -0.519]}
                />
              </group>
              <group name="30K011_2" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_4"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_4.geometry}
                  material={materials['Material.027']}
                  position={[-3.746, 5.145, -0.529]}
                />
              </group>
              <group name="30K012_7" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_14"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_14.geometry}
                  material={materials['Material.026']}
                  position={[-4.02, 5.592, -0.519]}
                />
              </group>
              <group name="30K013_11" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_22"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_22.geometry}
                  material={materials['Material.030']}
                  position={[-4.031, 5.071, -0.519]}
                />
              </group>
              <group name="30K014_12" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_24"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_24.geometry}
                  material={materials['Material.026']}
                  position={[-4.02, 4.611, -0.519]}
                />
              </group>
              <group name="30K_15" position={[0.233, 0, -0.522]} rotation={[0, -0.136, 0]}>
                <mesh
                  name="Object_30"
                  castShadow
                  receiveShadow
                  geometry={nodes.Object_30.geometry}
                  material={materials['Material.033']}
                  position={[-4.029, 5.315, -0.527]}
                />
              </group>
            </group>
          </group>
        </group>
        <mesh
          name="Cube016"
          castShadow
          receiveShadow
          geometry={nodes.Cube016.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-4.861, 7.302, -4.95]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <group
          name="Cube017"
          position={[-5.104, 8.18, -6.441]}
          rotation={[Math.PI, -0.222, Math.PI]}>
          <mesh
            name="Cube045"
            castShadow
            receiveShadow
            geometry={nodes.Cube045.geometry}
            material={materials['Metal Simple Marked.001']}
          />
          <mesh
            name="Cube045_1"
            castShadow
            receiveShadow
            geometry={nodes.Cube045_1.geometry}
            material={materials['Glass.001']}
          />
        </group>
        <mesh
          name="Cube018"
          castShadow
          receiveShadow
          geometry={nodes.Cube018.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-4.967, 7.876, -4.992]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cube019"
          castShadow
          receiveShadow
          geometry={nodes.Cube019.geometry}
          material={materials['MADEIRA.001']}
          position={[-4.967, 7.982, -4.89]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cube020"
          castShadow
          receiveShadow
          geometry={nodes.Cube020.geometry}
          material={materials['MADEIRA.001']}
          position={[-4.951, 9.277, -4.893]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cube021"
          castShadow
          receiveShadow
          geometry={nodes.Cube021.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-4.951, 9.171, -4.994]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cube022"
          castShadow
          receiveShadow
          geometry={nodes.Cube022.geometry}
          material={materials['CONECTORES.001']}
          position={[-4.995, 8.034, -5.062]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cube023"
          castShadow
          receiveShadow
          geometry={nodes.Cube023.geometry}
          material={materials['CONECTORES.001']}
          position={[-4.979, 9.329, -5.074]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cube024"
          castShadow
          receiveShadow
          geometry={nodes.Cube024.geometry}
          material={materials['METAL TRANSFORMADOR.001']}
          position={[-4.658, 8.498, -4.853]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cube025"
          castShadow
          receiveShadow
          geometry={nodes.Cube025.geometry}
          material={materials['METAL TRANSFORMADOR.001']}
          position={[-4.658, 8.497, -4.853]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cube026"
          castShadow
          receiveShadow
          geometry={nodes.Cube026.geometry}
          material={materials['CONECTORES.001']}
          position={[-4.599, 8.745, -4.743]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cube027"
          castShadow
          receiveShadow
          geometry={nodes.Cube027.geometry}
          material={materials['CONECTORES.001']}
          position={[-4.815, 7.223, -4.927]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cube028"
          castShadow
          receiveShadow
          geometry={nodes.Cube028.geometry}
          material={materials['CONECTORES.001']}
          position={[-4.867, 7.061, -4.942]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cylinder010"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder010.geometry}
          material={materials['Concreto Poste.001']}
          position={[-4.84, 7.173, -4.819]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cylinder011"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder011.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-4.84, 7.289, -4.819]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cylinder012"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder012.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-5.018, 7.929, -5.911]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cylinder013"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder013.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-4.84, 7.76, -4.819]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cylinder014"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder014.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-4.84, 9.046, -4.819]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cylinder015"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder015.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-4.84, 8.454, -4.819]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cylinder016"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder016.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-4.776, 8.454, -4.911]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cylinder017"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder017.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-4.84, 7.026, -4.819]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cylinder018"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder018.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-4.865, 7.027, -4.932]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Cylinder019"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder019.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-4.867, 7.027, -4.942]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="fios_transformador001"
          castShadow
          receiveShadow
          geometry={nodes.fios_transformador001.geometry}
          material={materials['FIOS.001']}
          position={[-4.734, 8.71, -4.866]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Nut004"
          castShadow
          receiveShadow
          geometry={nodes.Nut004.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-4.804, 7.989, -5.185]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Nut005"
          castShadow
          receiveShadow
          geometry={nodes.Nut005.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-4.82, 9.284, -5.183]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Nut006"
          castShadow
          receiveShadow
          geometry={nodes.Nut006.geometry}
          material={nodes.Nut006.material}
          position={[-4.928, 9.056, -4.831]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Nut007"
          castShadow
          receiveShadow
          geometry={nodes.Nut007.geometry}
          material={materials['Metal Simple Marked.001']}
          position={[-4.945, 7.761, -4.828]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <mesh
          name="Plane002"
          castShadow
          receiveShadow
          geometry={nodes.Plane002.geometry}
          material={materials['METAL TRANSFORMADOR.001']}
          position={[-4.553, 8.498, -4.872]}
          rotation={[Math.PI, -0.222, Math.PI]}
        />
        <group
          name="Sphere001"
          position={[-5.101, 8.195, -6.421]}
          rotation={[Math.PI, -0.222, Math.PI]}>
          <mesh
            name="Sphere001_1"
            castShadow
            receiveShadow
            geometry={nodes.Sphere001_1.geometry}
            material={materials['Luz.001']}
          />
          <mesh
            name="Sphere001_2"
            castShadow
            receiveShadow
            geometry={nodes.Sphere001_2.geometry}
            material={materials['Metal Simple Marked.001']}
          />
        </group>
        <mesh
          name="tree_1"
          castShadow
          receiveShadow
          geometry={nodes.tree_1.geometry}
          material={materials['Material.034']}
          position={[5.847, 0.529, -4.025]}
          scale={0.448}>
          <mesh
            name="tree_1001"
            castShadow
            receiveShadow
            geometry={nodes.tree_1001.geometry}
            material={materials['leaf color']}
          />
          <mesh
            name="tree_1004"
            castShadow
            receiveShadow
            geometry={nodes.tree_1004.geometry}
            material={materials['leaf color']}
          />
          <mesh
            name="tree_1006"
            castShadow
            receiveShadow
            geometry={nodes.tree_1006.geometry}
            material={materials['leaf color']}
          />
          <mesh
            name="tree_1008"
            castShadow
            receiveShadow
            geometry={nodes.tree_1008.geometry}
            material={materials['leaf color']}
          />
        </mesh>
        <mesh
          name="tree_4"
          castShadow
          receiveShadow
          geometry={nodes.tree_4.geometry}
          material={materials['Material.034']}
          position={[5.996, 0.651, 4.608]}
          scale={0.404}>
          <mesh
            name="Sphere002"
            castShadow
            receiveShadow
            geometry={nodes.Sphere002.geometry}
            material={materials['leaf color']}
            position={[0.324, 11.378, 0.606]}
            scale={[3.167, 2.552, 3.167]}
          />
        </mesh>
        <mesh
          name="13468_12_Volt_Economy_Battery_v1_L3"
          castShadow
          receiveShadow
          geometry={nodes['13468_12_Volt_Economy_Battery_v1_L3'].geometry}
          material={materials['12_Volt_Economy_Battery']}
          position={[2.596, 1.943, -1.88]}
          rotation={[0, Math.PI / 2, 0]}
          scale={0.047}
        />
        <mesh
          name="13468_12_Volt_Economy_Battery_v1_L3001"
          castShadow
          receiveShadow
          geometry={nodes['13468_12_Volt_Economy_Battery_v1_L3001'].geometry}
          material={materials['12_Volt_Economy_Battery']}
          position={[2.596, 1.943, -1.88]}
          rotation={[0, Math.PI / 2, 0]}
          scale={0.047}
        />
        <mesh
          name="13468_12_Volt_Economy_Battery_v1_L3002"
          castShadow
          receiveShadow
          geometry={nodes['13468_12_Volt_Economy_Battery_v1_L3002'].geometry}
          material={materials['12_Volt_Economy_Battery']}
          position={[2, 1.943, -1.88]}
          rotation={[0, Math.PI / 2, 0]}
          scale={0.047}
        />
        <mesh
          name="13468_12_Volt_Economy_Battery_v1_L3003"
          castShadow
          receiveShadow
          geometry={nodes['13468_12_Volt_Economy_Battery_v1_L3003'].geometry}
          material={materials['12_Volt_Economy_Battery']}
          position={[1.401, 1.943, -1.88]}
          rotation={[0, Math.PI / 2, 0]}
          scale={0.047}
        />
        <mesh
          name="13468_12_Volt_Economy_Battery_v1_L3004"
          castShadow
          receiveShadow
          geometry={nodes['13468_12_Volt_Economy_Battery_v1_L3004'].geometry}
          material={materials['12_Volt_Economy_Battery']}
          position={[0.789, 1.943, -1.88]}
          rotation={[0, Math.PI / 2, 0]}
          scale={0.047}
        />
        <mesh
          name="ElectricPanel001"
          castShadow
          receiveShadow
          geometry={nodes.ElectricPanel001.geometry}
          material={nodes.ElectricPanel001.material}
          position={[-0.85, 2.121, -1.787]}
          rotation={[0, Math.PI / 2, 0]}
          scale={1.034}
        />
        <mesh
          name="ElectricPanel002"
          castShadow
          receiveShadow
          geometry={nodes.ElectricPanel002.geometry}
          material={materials['escadinha.001']}
          position={[-2.53, 6.336, -2.314]}
          rotation={[0, Math.PI / 2, 0]}
          scale={1.034}
        />
        <mesh
          name="NurbsPath"
          castShadow
          receiveShadow
          geometry={nodes.NurbsPath.geometry}
          material={materials['fallback Material.002']}
          position={[-1.551, 5.58, -1.936]}
        />
        <mesh
          name="NurbsPath001"
          castShadow
          receiveShadow
          geometry={nodes.NurbsPath001.geometry}
          material={materials['fallback Material.002']}
          position={[0.352, 2.377, -1.934]}
          rotation={[-Math.PI, 0, -Math.PI]}
          scale={[-1, -0.11, -0.269]}
        />
        <mesh
          name="NurbsPath002"
          castShadow
          receiveShadow
          geometry={nodes.NurbsPath002.geometry}
          material={materials['fallback Material.002']}
          position={[-3.684, 7.349, -3.052]}
        />
        <group name="Plane003">
          <mesh
            name="Plane002_1"
            castShadow
            receiveShadow
            geometry={nodes.Plane002_1.geometry}
            material={materials['CONECTORES.001']}
          />
          <mesh
            name="Plane002_2"
            castShadow
            receiveShadow
            geometry={nodes.Plane002_2.geometry}
            material={materials['Material.027']}
          />
          <mesh
            name="Plane002_3"
            castShadow
            receiveShadow
            geometry={nodes.Plane002_3.geometry}
            material={materials.Maçaneta}
          />
        </group>
        <group name="Paneles_Solares001">
          <mesh
            name="Paneles_Solares001_1"
            castShadow
            receiveShadow
            geometry={nodes.Paneles_Solares001_1.geometry}
            material={materials.Maçaneta}
          />
          <mesh
            name="Paneles_Solares001_2"
            castShadow
            receiveShadow
            geometry={nodes.Paneles_Solares001_2.geometry}
            material={materials['CONECTORES.001']}
          />
          <mesh
            name="Paneles_Solares001_3"
            castShadow
            receiveShadow
            geometry={nodes.Paneles_Solares001_3.geometry}
            material={materials['Material.027']}
          />
        </group>
        <group name="Paneles_Solares002">
          <mesh
            name="Paneles_Solares002_1"
            castShadow
            receiveShadow
            geometry={nodes.Paneles_Solares002_1.geometry}
            material={materials.Maçaneta}
          />
          <mesh
            name="Paneles_Solares002_2"
            castShadow
            receiveShadow
            geometry={nodes.Paneles_Solares002_2.geometry}
            material={materials['CONECTORES.001']}
          />
          <mesh
            name="Paneles_Solares002_3"
            castShadow
            receiveShadow
            geometry={nodes.Paneles_Solares002_3.geometry}
            material={materials['Material.027']}
          />
        </group>
        <group
          name="Plane004"
          position={[-1.72, 7.029, 1.726]}
          rotation={[-0.032, 0, Math.PI]}
          scale={0.944}>
          <mesh
            name="Plane010"
            castShadow
            receiveShadow
            geometry={nodes.Plane010.geometry}
            material={materials['CONECTORES.001']}
          />
          <mesh
            name="Plane010_1"
            castShadow
            receiveShadow
            geometry={nodes.Plane010_1.geometry}
            material={materials['Material.027']}
          />
          <mesh
            name="Plane010_2"
            castShadow
            receiveShadow
            geometry={nodes.Plane010_2.geometry}
            material={materials.Maçaneta}
          />
        </group>
        <group
          name="Paneles_Solares003"
          position={[-2.305, 3.188, -2.389]}
          rotation={[1.538, 0, Math.PI]}
          scale={0.196}>
          <mesh
            name="Paneles_Solares003_1"
            castShadow
            receiveShadow
            geometry={nodes.Paneles_Solares003_1.geometry}
            material={materials.Maçaneta}
          />
          <mesh
            name="Paneles_Solares003_2"
            castShadow
            receiveShadow
            geometry={nodes.Paneles_Solares003_2.geometry}
            material={materials['CONECTORES.001']}
          />
          <mesh
            name="Paneles_Solares003_3"
            castShadow
            receiveShadow
            geometry={nodes.Paneles_Solares003_3.geometry}
            material={materials['Material.027']}
          />
        </group>
        <group
          name="Paneles_Solares004"
          position={[-1.511, 6.421, -2.348]}
          rotation={[1.538, 0, Math.PI]}
          scale={0.217}>
          <mesh
            name="Paneles_Solares004_1"
            castShadow
            receiveShadow
            geometry={nodes.Paneles_Solares004_1.geometry}
            material={materials.Maçaneta}
          />
          <mesh
            name="Paneles_Solares004_2"
            castShadow
            receiveShadow
            geometry={nodes.Paneles_Solares004_2.geometry}
            material={materials['CONECTORES.001']}
          />
          <mesh
            name="Paneles_Solares004_3"
            castShadow
            receiveShadow
            geometry={nodes.Paneles_Solares004_3.geometry}
            material={materials['Material.027']}
          />
        </group>
        <mesh
          name="Cylinder020"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder020.geometry}
          material={materials.CONECTORES}
          position={[-1.808, 6.938, 1.264]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={-0.034}
        />
        <PerspectiveCamera
          name="CamerarbACK"
          makeDefault={false}
          far={1000}
          near={0.1}
          fov={32.269}
          position={[3.395, 3.838, 17.766]}
          rotation={[-0.058, 0.199, 0.011]}
          scale={3.706}
        />
        <group name="housTrack" position={[-0.244, 2.785, -0.291]} />
        <group name="CAMERAtRACKtOBACK" position={[0.803, 6.515, 20.095]} />
      </group>
    </group>
  )
}


useGLTF.preload('/projectHouse09-02.glb')
export default House2;
