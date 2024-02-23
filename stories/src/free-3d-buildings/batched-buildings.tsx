import { Object3DNode, extend, useFrame } from "@react-three/fiber";
import { memo, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Coords, coordsToVector3 } from "react-three-map";
import { suspend } from "suspend-react";
import { BatchedMesh, Color, ExtrudeGeometry, MathUtils, Shape, Vector3Tuple } from "three";
import { BatchedStandardMaterial } from "./batched-standard-material/batched-standard-material";
import { OverpassElement, getBuildingsData } from "./get-buildings-data";

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

const _color = new Color();

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

  const [hovered, hover] = useState<number>()

  const { data, vertexCount, indexCount, key } = useMemo(() => {
    // lights
    const c00 = _color.set('#f0c505').getHSL({ h: 0, s: 0, l: 0 });
    const c01 = _color.set('#f38630').getHSL({ h: 0, s: 0, l: 0 });
    // darks
    const c10 = _color.set('#001449').getHSL({ h: 0, s: 0, l: 0 });
    const c11 = _color.set('#49007e').getHSL({ h: 0, s: 0, l: 0 });

    const data = buildings.map((element, i) => {
      const { poly, height, base } = getElementPolygon(element, origin);
      const geometry = polygonToExtrudeGeo(poly, height, base);
      const c0 = new Color().setHSL(rand(c00.h, c01.h), rand(c00.s, c01.s), rand(c00.l, c01.l));
      const c1 = new Color().setHSL(rand(c10.h, c11.h), rand(c10.s, c11.s), rand(c10.l, c11.l));
      const emissiveIntensity = rand(0, 1) < 0.05 ? 3.5 : 0;
      const roughness = rand(0, 0.5);
      const metalness = rand(0, 1);
      const offset = rand(0, 2 * Math.PI);
      const speed = rand(1, 2);
      const value = offset;
      return {
        i,
        value,
        c0,
        c1,
        speed,
        emissiveIntensity, roughness, metalness,
        element,
        geometry,
        vertexCount: geometry.attributes.position.count,
        indexCount: geometry.index?.count || 0,
      }
    });
    const vertexCount = data.reduce((acc, d) => acc + d.vertexCount, 0);
    const indexCount = data.reduce((acc, d) => acc + d.indexCount, 0);
    const key = MathUtils.generateUUID();
    return { data, vertexCount, indexCount, key };
  }, [origin, buildings])

  const meshRef = useRef<BatchedMesh>(null);
  const matRef = useRef<BatchedStandardMaterial>(null);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const material = matRef.current;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const { c0, c1, emissiveIntensity, roughness, metalness, speed } = item;
      item.value += delta * speed;
      const sinValue = Math.abs(Math.sin(item.value))

      const color = _color.lerpColors(c0, c1, sinValue);
      material.setValue(item.i, 'diffuse', ...color);

      color.multiplyScalar(hovered === i ? 20 : emissiveIntensity);
      material.setValue(item.i, 'emissive', ...color);

      material.setValue(item.i, 'roughness', roughness);
      material.setValue(item.i, 'metalness', metalness);
    }
  })

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    for (let i = 0; i < data.length; i++) {
      mesh.addGeometry(data[i].geometry);
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return <batchedMesh
    key={key}
    ref={meshRef}
    args={[data.length, vertexCount, indexCount]}
    rotation={[-90 * MathUtils.DEG2RAD, 0, -90 * MathUtils.DEG2RAD]}
    onPointerMove={e => (e.stopPropagation(), hover(e.batchId))}
    onPointerOut={() => hover(undefined)}
  >
    <batchedStandardMaterial ref={matRef} args={[data.length]} />
  </batchedMesh>;
})

BatchedBuildings.displayName = 'BatchedBuildings';

function getElementPolygon(element: OverpassElement, origin: Coords) {
  const poly = geoPolyToVectorPoly(element.geometry || [], origin);
  let height = parseFloat(element.tags?.height || '0');
  if (!height) height = parseFloat(element.tags?.['building:levels'] || '1') * 3;
  const base = parseFloat(element.tags?.min_height || '0');
  return { poly, height, base };
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

function rand(min: number, max: number) {
  const delta = max - min
  return min + Math.random() * delta
}