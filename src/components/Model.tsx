import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { Group } from "three";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { GLTF } from "three-stdlib";

interface ModelGLTF extends GLTF {
  nodes: any;
  materials: any;
  animations: any;
  scene: any;
}

export default function Model({ gltfPath }: { gltfPath: string }) {
  const group = useRef<Group>(null);
  const { nodes, materials, animations, scene } = useGLTF(gltfPath) as ModelGLTF;
  const { actions, clips } = useAnimations(animations, scene);
  const scroll = useScroll();

  useEffect(() => {
    if (actions && actions['Armature|Attack1']) {
      actions['Armature|Attack1'].play().paused = true;
    }
  }, [actions]);

  useFrame(() => {
    const attackAction = actions['Armature|Attack1'];
    if (
      attackAction &&
      typeof attackAction.getClip === 'function' &&
      scroll &&
      typeof scroll.offset === 'number'
    ) {
      attackAction.time = (attackAction.getClip().duration * scroll.offset) / 3;
    }
  });

  return (
    <group ref={group} scale={[2, 2, 2]} position={[0, -1, 2]}>
      <primitive object={scene} />
    </group>
  );
}