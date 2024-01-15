import { bearing, distance } from "@turf/turf";
import { MathUtils, Vector3Tuple } from "three";
import { Coords } from "./coords";

/** converts geo coordinates `point` to a `Vector3Tuple` (represented in meters) using `origin` as the origin. */
export function coordsToVector3(point: Coords, origin: Coords) {
  const originCoords: Vector3Tuple = [origin.longitude, origin.latitude, origin.altitude || 0];
  const pointCoords: Vector3Tuple = [point.longitude, point.latitude, point.altitude || 0];

  // Calculate distance in meters
  const dist = distance(originCoords, pointCoords, { units: "meters" });

  // Calculate bearing angle
  const angle = bearing(originCoords, pointCoords);

  // Adjust the bearing to match the coordinate system
  // (e.g., if the positive X-axis corresponds to East and positive Z-axis to North)
  const adjustedAngle = angle - 90; 

  // Convert angle and distance to 3D position
  const x = dist * Math.cos(adjustedAngle * MathUtils.DEG2RAD);
  const y = (point.altitude || 0) - (origin.altitude||0);
  const z = dist * Math.sin(adjustedAngle * MathUtils.DEG2RAD);

  const v3 : Vector3Tuple = [x, y, z];

  return v3;
}