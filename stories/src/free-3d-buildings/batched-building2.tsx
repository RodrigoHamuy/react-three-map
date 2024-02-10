import { Object3DNode, extend } from "@react-three/fiber";
import { memo, useLayoutEffect, useRef } from "react";
import { Coords } from "react-three-map";
import { suspend } from "suspend-react";
import { BatchedMesh, BufferGeometry, Float32BufferAttribute, MathUtils } from "three";
import arrays_RAW from "./geometries.json";
import { BatchedStandardMaterial } from "./batched-standard-material/batched-standard-material";

const arrays = arrays_RAW as number[][][];

extend({ BatchedStandardMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    batchedMesh: Object3DNode<BatchedMesh, typeof BatchedMesh>,
    batchedStandardMaterial: Object3DNode<BatchedStandardMaterial, typeof BatchedStandardMaterial>,
  }
}

interface BatchedBuildingsProps {
  buildingsCenter: Coords;
  origin: Coords;
}
export const BatchedBuildings2 = memo<BatchedBuildingsProps>(({ buildingsCenter, origin }) => {
  const {geos} = suspend(() => {
    return new Promise<{geos: BufferGeometry[]}>(resolve => {
      setTimeout(()=>{
        const geos : BufferGeometry[] = [];
        for (const item of arrays) {
          const geo = new BufferGeometry();
          const vertices = new Float32Array(item[0]);
          const normals = new Float32Array(item[1]);
          geo.setAttribute('position', new Float32BufferAttribute(vertices, 3));
          geo.setAttribute('normal', new Float32BufferAttribute(normals, 3));
          geos.push(geo);
        }
        resolve({geos})
      }, 3000)
    })
  }, [buildingsCenter.latitude, buildingsCenter.longitude]);

  const ref = useRef<BatchedMesh>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const mesh = ref.current;
    for (const geometry of geos) {
      mesh.addGeometry(geometry);
    }
  }, [geos]);

  return <batchedMesh
    ref={ref}
    args={[geos.length, 523224, 0]}
    rotation={[-90 * MathUtils.DEG2RAD, 0, -90 * MathUtils.DEG2RAD]}
    // onClick={e => console.log(data[e.batchId || 0])}
  >
    <meshLambertMaterial attach="material" color="yellow" />
  </batchedMesh>;
})

BatchedBuildings2.displayName = 'BatchedBuildings';