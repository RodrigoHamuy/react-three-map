import { MathUtils, Vector3Tuple } from 'three';
import { Coords } from './coords';
import { earthRadius } from "../core/earth-radius";

export function coordsToVector3(point: Coords, origin: Coords): Vector3Tuple {
  const latitudeDiff = (point.latitude - origin.latitude) * MathUtils.DEG2RAD;
  const longitudeDiff = (point.longitude - origin.longitude) * MathUtils.DEG2RAD;
  const altitudeDiff = (point.altitude || 0) - (origin.altitude || 0);

  const x = longitudeDiff * earthRadius * Math.cos(origin.latitude * MathUtils.DEG2RAD);
  const y = altitudeDiff;
  const z = -latitudeDiff * earthRadius;

  return [x, y, z] as Vector3Tuple;
}
