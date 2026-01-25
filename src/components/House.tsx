"use client";
import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import type { Group } from "three";

interface HouseGLTF extends GLTF {
  nodes: any;
  materials: any;
}

const House = ({ scale = 2, onLoaded }: { scale?: number; onLoaded?: () => void }) => {
  const group = useRef<Group>(null);
  const { nodes, materials } = useGLTF("/house3.glb") as HouseGLTF;

  useEffect(() => {
    if (nodes && materials && onLoaded) {
      onLoaded();
    }
  }, [nodes, materials, onLoaded]);

  if (!nodes || !materials) {
    return null;
  }

  return (
    <group ref={group} dispose={null} scale={scale} rotation={[0, 0.6, 0]} >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Gram_Floor?.geometry}
        material={materials["Material.004"]}
        position={[0.341, 0.074, 1.106]}
      />
      <group position={[0.341, 0.308, 0.518]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube001?.geometry}
          material={materials.glass}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube001_1?.geometry}
          material={materials["Material.002"]}
        />
      </group>
      <group
        position={[0.441, 0.592, 0.611]}
        rotation={[0.445, 0, 0]}
        scale={0.091}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane011?.geometry}
          material={materials["Material.003"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane011_1?.geometry}
          material={materials["Material.009"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane011_2?.geometry}
          material={materials["Material.001"]}
        />
      </group>
    </group>
  );
};

export default House;