"use client";
import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import type { Group } from "three";

interface BuildingGLTF extends GLTF {
  nodes: any;
  materials: any;
}

const Building = ({ scale = 1, onLoaded }: { scale?: number; onLoaded?: () => void }) => {
  const group = useRef<Group>(null);
  const { nodes, materials } = useGLTF("/modern_residential_building.glb") as BuildingGLTF;

  useEffect(() => {
    if (nodes && materials && onLoaded) {
      onLoaded();
    }
  }, [nodes, materials, onLoaded]);

  if (!nodes || !materials) {
    return null;
  }

  return (
      <group ref={group} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 2]}>
        <lineSegments geometry={nodes.Object_2.geometry} material={materials.Mat2} />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_3.geometry}
          material={materials.Mat1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          material={materials.Mat2}
        />
      </group>
    </group>
  );
};
useGLTF.preload('/modern_residential_building.glb')
export default Building;