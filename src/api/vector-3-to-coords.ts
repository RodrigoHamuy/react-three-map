import { MathUtils, Vector3Tuple } from "three";
import { Coords } from "./coords";
import { earthRadius } from "../core/earth-radius";

export function vector3ToCoords(position: Vector3Tuple, origin: Coords): Coords {
  const [x, y, z] = position;
  const latitude = origin.latitude + (-z / earthRadius) * MathUtils.RAD2DEG;
  const longitude = origin.longitude + (x / earthRadius) * MathUtils.RAD2DEG / Math.cos(origin.latitude * MathUtils.DEG2RAD);
  const altitude = (origin.altitude || 0) + y;
  const coords: Coords = { latitude, longitude, altitude };
  return coords;
}