import { Vector3Tuple } from "three";
import { Coords } from "./coords";

export function Vector3ToCoords(position: Vector3Tuple, origin: Coords): Coords {
  const [x, y, z] = position;
  const latitude = origin.latitude + (z / 6378137) * (180 / Math.PI);
  const longitude = origin.longitude + (x / 6378137) * (180 / Math.PI) / Math.cos(origin.latitude * Math.PI / 180);
  const altitude = origin.altitude || 0 + y;
  const coords: Coords = { latitude, longitude, altitude };
  return coords;
}