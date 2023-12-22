import { bearing, distance } from "@turf/turf";
import { MathUtils, Vector3Tuple } from "three";
import { Coords } from "./coords";

/** Similar to `coordsToVector3`, but maps coordinates for extrusion by aligning them directly on the XY plane. */
export function coordsToShapePoints(point: Coords, origin: Coords) {
  const originCoords = [origin.longitude, origin.latitude, origin.altitude || 0];
  const pointCoords = [point.longitude, point.latitude, point.altitude || 0];
  
  // Calculate distance in meters
  const dist = distance(originCoords, pointCoords, { units: "meters" });

  // Calculate bearing angle
  const angle = bearing(originCoords, pointCoords);

  // Convert angle and distance to 3D position
  const x = dist * Math.sin(angle * MathUtils.DEG2RAD);
  const y = (point.altitude || 0) - (origin.altitude||0);
  const z = dist * Math.cos(angle * MathUtils.DEG2RAD);

  const v3 : Vector3Tuple = [x, y, z];

  return v3;
}