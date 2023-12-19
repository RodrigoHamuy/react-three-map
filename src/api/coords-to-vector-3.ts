import { bearing, distance } from "@turf/turf";
import { Euler, MathUtils, Vector3, Vector3Tuple } from "three";
import { Coords } from "../core/coords";

const _euler = new Euler();
const _pos = new Vector3();

/** converts geo coordinates `point` to a `Vector3Tuple` (represented in meters) using `origin` as the origin */
export function coordsToVector3(point: Coords, origin: Coords) {
  const originCoords: Vector3Tuple = [origin.longitude, origin.latitude, origin.altitude || 0];
  const pointCoords: Vector3Tuple = [point.longitude, point.latitude, point.altitude || 0];
  const dist = distance(originCoords, pointCoords, { units: "meters" });
  const angle = bearing(originCoords, pointCoords);
  _euler.set(0, (90 - angle) * MathUtils.DEG2RAD, 0);
  _pos.set(1, 0, 0);
  return _pos.applyEuler(_euler).multiplyScalar(dist).toArray();
}
