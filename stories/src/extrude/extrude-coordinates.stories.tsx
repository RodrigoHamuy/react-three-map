import { Environment, Extrude, Html } from "@react-three/drei";
import { useMemo } from "react";
import { Coords, coordsToShapePoints, coordsToVector3 } from "react-three-map";
import { MathUtils, Shape, Vector2Tuple } from "three";
import { StoryMap } from "../story-map";
import { Chaillot } from "./chaillot";

const origin : Coords = {
  longitude: 2.289449241104535,
  latitude: 48.861422672242895,
}

export function ExtrudeCoordinates() {

  return <StoryMap
    zoom={16.5}
    {...origin}
    bearing={-48}
    pitch={59}
  >
    {Chaillot.map((points, i) => <ExtrudePoints
      key={i}
      points={points}
      origin={origin}
    />)}
    <hemisphereLight
      args={["#ffffff", "#60666C"]}
      position={[1, 4.5, 3]}
      intensity={Math.PI}
    />
    <object3D position={coordsToVector3({
      longitude: Chaillot[0][0][0],
      latitude: Chaillot[0][0][1]
    }, origin)}>
      <Html position={[0,50,0]} style={{
        color: '#f38630', fontSize: 20, fontWeight: 'bold'
        }}>
        Palais de Chaillot
      </Html>
    </object3D>
    <Environment preset="sunset" />
  </StoryMap>

}

function ExtrudePoints({ points, origin }: { points: Vector2Tuple[], origin: Coords }) {
  const points2D = useMemo(() => {
    const points3D = points.map(p => coordsToShapePoints({ longitude: p[0], latitude: p[1] }, origin))
    return points3D;
  }, [origin, points])
  const shape = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(points2D[0][0], points2D[0][2]);
    for (let i = 1; i < points2D.length; i++) {
      shape.lineTo(points2D[i][0], points2D[i][2]);
    }
    shape.closePath();
    return shape;
  }, [points2D])

  return <Extrude
    rotation={[-90 * MathUtils.DEG2RAD, 0, 0]}
  >
    <extrudeGeometry args={[shape, { depth: 30 }]} />
    <meshStandardMaterial color="#e0e4cc" metalness={1} roughness={.2} />
  </Extrude>
}