import { memo, useLayoutEffect, useMemo, useRef } from "react";
import { OverpassElement, getBuildingsData } from "./get-buildings-data";
import { Vector3Tuple, Shape, ExtrudeGeometry, Matrix4, BatchedMesh, MathUtils } from "three";
import { Coords, coordsToVector3 } from "react-three-map";
import { extend, Object3DNode } from "@react-three/fiber";
import { BatchedStandardMaterial } from "./batched-standard-material/batched-standard-material";
import { suspend } from "suspend-react";

extend({ BatchedStandardMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    batchedMesh: Object3DNode<BatchedMesh, typeof BatchedMesh>,
    batchedStandardMaterial: Object3DNode<BatchedStandardMaterial, typeof BatchedStandardMaterial>,
  }
}

const m4 = new Matrix4();

interface BatchedBuildingsProps {
  buildingsCenter: Coords;
  origin: Coords;
}
export const BatchedBuildings = memo<BatchedBuildingsProps>(({ buildingsCenter, origin }) => {
  const buildings = suspend(() => {
    const start = { ...buildingsCenter };
    start.latitude -= .01;
    start.longitude -= .01;
    const end = { ...buildingsCenter };
    end.latitude += .01;
    end.longitude += .01;
    return getBuildingsData({ start, end });
  }, [buildingsCenter]);
  
  const { data, vertexCount, indexCount } = useMemo(() => {
    const data = buildings.map(element => {
      const geometry = geoElementToGeometry(element, origin);
      return {
        element,
        geometry,
        vertexCount: geometry.attributes.position.count,
        indexCount: geometry.index?.count || 0,
      }
    });
    const vertexCount = data.reduce((acc, d) => acc + d.vertexCount, 0);
    const indexCount = data.reduce((acc, d) => acc + d.indexCount, 0);
    return { data, vertexCount, indexCount };
  }, [origin, buildings])

  const ref = useRef<BatchedMesh>(null);

  useLayoutEffect(() => {
    if(!ref.current) return;
    const mesh = ref.current;
    for (let i = 0; i < data.length; i++) {
      const id= mesh.addGeometry(data[i].geometry);
      mesh.setMatrixAt(id, m4);
    }
  }, [data]);

  return <batchedMesh
    ref={ref}
    args={[data.length, vertexCount, indexCount]}
    rotation={[-90 * MathUtils.DEG2RAD, 0, -90 * MathUtils.DEG2RAD]}
    onClick={e=>console.log(data[e.batchId||0])}
  >
    <meshLambertMaterial attach="material" color="yellow" />
  </batchedMesh>;
})

BatchedBuildings.displayName = 'BatchedBuildings';

function geoElementToGeometry(element: OverpassElement, origin: Coords) {
  const poly = geoPolyToVectorPoly(element.geometry || [], origin);
  let height = parseFloat(element.tags?.height || '0');
  if(!height) height = parseFloat(element.tags?.['building:levels'] || '1') * 3;
  const base = parseFloat(element.tags?.min_height || '0');
  const geo = polygonToExtrudeGeo(poly, height, base);
  return geo;
}

function geoPolyToVectorPoly(poly: { lat: number, lon: number }[], origin: Coords): Vector3Tuple[] {
  return poly.map(p => {
    const point = { latitude: p.lat, longitude: p.lon };
    return coordsToVector3(point, origin);
  });
}

function polygonToExtrudeGeo(poly: Vector3Tuple[], height: number, base: number) {
  const shape = new Shape();
  shape.moveTo(poly[0][2], poly[0][0]);
  for (let i = 1; i < poly.length; i++) {
    shape.lineTo(poly[i][2], poly[i][0]);
  }
  shape.closePath();
  const geo = new ExtrudeGeometry(shape, { depth: height - base, bevelEnabled: false });
  geo.translate(0, 0, base);
  return geo;
}