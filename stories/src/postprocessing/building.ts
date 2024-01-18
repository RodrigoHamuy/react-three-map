import { ExtrudeGeometry, Vector2Tuple, Vector3Tuple } from "three";

/** 3D building data */
export interface Building {
  featureId: string|number;
  /** Used to determine when the building was set */
  updateIndex: number;
  geometryId?: number;
  height: number;
  coords: Vector2Tuple[];
  polygon: Vector3Tuple[];
  geometry: ExtrudeGeometry;
  vertexCount: number;
  indexCount: number;
}