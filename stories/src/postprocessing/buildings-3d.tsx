import { FC, useEffect, useRef, useState } from "react";
import { MapboxGeoJSONFeature } from "react-map-gl";
import { coordsToVector3, useMap } from "react-three-map";
import { BatchedMesh, ExtrudeGeometry, MathUtils, Matrix4, Shape, Vector2Tuple, Vector3Tuple } from "three";
import { useFunction } from "../../../src/core/use-function";
import { Building } from "./building";
import { Object3DNode } from "@react-three/fiber";

declare module '@react-three/fiber' {
  interface ThreeElements {
    batchedMesh: Object3DNode<BatchedMesh, typeof BatchedMesh>
  }
}

export const Buildings3D: FC<{
  origin: { longitude: number, latitude: number }
}> = ({ origin }) => {
  const ref = useRef<BatchedMesh>(null)

  const [buildings, setBuildings] = useState<Building[]>([]);

  useBuildings(origin, setBuildings);

  useEffect(() => {
    if (!ref.current) return;
    const mesh = ref.current;
    const mx = new Matrix4();
    const ids : number[] = []
    for (const building of buildings) {
      const id = mesh.addGeometry(building.geometry);
      ids.push(id);
      mesh.setMatrixAt(id, mx);
    }
    return () => {
      for (const id of ids) {
        mesh.deleteGeometry(id)
      }
    }
  }, [buildings])

  return <batchedMesh
    ref={ref}
    args={[buildings.length, buildings.length * 512, buildings.length * 1024]}
    rotation={[-90 * MathUtils.DEG2RAD, 0, -90 * MathUtils.DEG2RAD]}
  >
    <meshPhongMaterial attach="material" color="#656565" shininess={100} />
  </batchedMesh>
}

function useBuildings(origin: { longitude: number, latitude: number }, setBuildings: (buildings: Building[]) => void) {
  const map = useMap();

  const getBuildings = useFunction(() => {
    const buildings: Building[] = [];
    const features = map.querySourceFeatures('composite', {
      sourceLayer: 'building'
    }) as (MapboxGeoJSONFeature & { tile: { x: number; y: number; }; })[];

    for (const feat of features) {
      if (feat.geometry.type !== 'Polygon' && feat.geometry.type !== 'MultiPolygon') continue;
      if (feat.id === undefined) continue;
      let coordsList: Vector2Tuple[][];
      if (feat.geometry.type === 'Polygon') {
        coordsList = feat.geometry.coordinates as Vector2Tuple[][];
      } else { // MultiPolygon
        coordsList = feat.geometry.coordinates.flat() as Vector2Tuple[][];
      }
      for (const coords of coordsList) {
        const polygon = coords.map(c => coordsToVector3({ longitude: c[0], latitude: c[1] }, origin));
        const height = feat.properties?.height ?? 1;
        const geometry = polygonToExtrudeGeo(polygon, height);
        buildings.push({
          id: feat.id,
          height,
          tileX: feat.tile.x,
          tileY: feat.tile.y,
          coords,
          polygon,
          geometry
        })
      }
    }
    console.log(buildings.length);

    setBuildings(buildings);
  })

  useEffect(() => {
    // const callback = (e: MapSourceDataEvent & EventData) => {
    //   console.log(e.sourceId);
    // };
    getBuildings();
    // map.on('sourcedataloading', callback);
    // map.on('sourcedata', getBuildings);
    // return () => {
    //   map.off('sourcedata', getBuildings);
    //   map.off('sourcedataloading', callback);
    // };
  }, [])
}

function polygonToExtrudeGeo(poly: Vector3Tuple[], height: number) {
  const shape = new Shape();
  shape.moveTo(poly[0][2], poly[0][0]);
  for (let i = 1; i < poly.length; i++) {
    shape.lineTo(poly[i][2], poly[i][0]);
  }
  shape.closePath();
  const geo = new ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
  return geo;
}