import { useMemo } from "react";
import { ExtrudeGeometry, MathUtils, MeshPhongMaterial, Shape, Vector3Tuple } from "three";
import { mergeBufferGeometries } from "three-stdlib";

const mat = new MeshPhongMaterial({ color: '#656565', shininess: 100 });

export function Tile({ tile }: {
  tile: {
    height: number;
    polys: Vector3Tuple[][];
  }[];
}) {
  const geometry = useMemo(() => {
    const geometries = [];
    for (const { height, polys } of tile) {
      for (const poly of polys) {
        const shape = new Shape();
        shape.moveTo(poly[0][2], poly[0][0]);
        for (let i = 1; i < poly.length; i++) {
          shape.lineTo(poly[i][2], poly[i][0]);
        }
        shape.closePath();
        const geo = new ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
        geometries.push(geo);
      }
    }
    return mergeBufferGeometries(geometries)!;
  }, [tile]);
  return <mesh
    geometry={geometry}
    rotation={[-90 * MathUtils.DEG2RAD, 0, -90 * MathUtils.DEG2RAD]}
    material={mat}
  >
  </mesh>;
}
