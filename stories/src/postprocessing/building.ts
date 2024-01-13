import { ExtrudeGeometry, Vector2Tuple, Vector3Tuple } from "three";

/** 3D building data */
export interface Building {
  id: string|number;
  tileX: number;
  tileY: number;
  height: number;
  coords: Vector2Tuple[];
  polygon: Vector3Tuple[];
  geometry: ExtrudeGeometry;
}