import { Object3DNode, extend } from "@react-three/fiber";
import { FC, useEffect, useRef } from "react";
import { useMap } from "react-three-map";
import { BatchedMesh, MathUtils } from "three";
import { BatchedStandardMaterial } from "./batched-standard-material/batched-standard-material";
import { BuildingStore } from "./building-store";

extend({ BatchedStandardMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    batchedMesh: Object3DNode<BatchedMesh, typeof BatchedMesh>,
    batchedStandardMaterial: Object3DNode<BatchedStandardMaterial, typeof BatchedStandardMaterial>,
  }
}

const maxGeometryCount = 3000;
const maxVertexCount = 8192;
const maxIndexCount = 0;

export const Buildings3D: FC<{
  origin: { longitude: number, latitude: number }
}> = ({ origin }) => {

  const ref = useRef<BatchedMesh>(null)
  const map = useMap();

  useEffect(() => {
    if (!ref.current) return;
    const store = new BuildingStore(origin, ref.current, maxGeometryCount, maxVertexCount, maxIndexCount, map);
    return () => {
      store.dispose();
    }
  }, [])

  return <batchedMesh
    ref={ref}
    args={[maxGeometryCount, maxGeometryCount * maxVertexCount, maxGeometryCount * maxIndexCount]}
    rotation={[-90 * MathUtils.DEG2RAD, 0, -90 * MathUtils.DEG2RAD]}
  >
    <batchedStandardMaterial attach="material"
      // metalness diffuse roughness emissive
      args={[maxGeometryCount]}
    />
    {/* <meshPhongMaterial attach="material" color="#656565" shininess={100} /> */}
  </batchedMesh>
}