import { MathUtils, Vector3Tuple } from 'three';
import { Coords } from './coords';
import { earthRadius } from "../core/earth-radius";


const mercatorScaleLookup: number[] = [];

// Populate the lookup table. Using a lookup table is faster then calculating the scale for each point.
for (let i = 0; i <= 90000; i++) {  // 0.001 degree steps
  const lat = i * 0.001;
  mercatorScaleLookup[i] = 1 / Math.cos(lat * MathUtils.DEG2RAD);
}

export function mercatorScale(lat: number): number {
  const index = Math.round(lat * 1000);  // lat is rounded to nearest 0.001
  return mercatorScaleLookup[index];
}

export function averageMercatorScale(originLat: number, pointLat: number, steps = 10): number {
  let totalScale = 0;
  const latStep = (pointLat - originLat) / steps;

  for (let i = 0; i <= steps; i++) {
      const lat = originLat + latStep * i;
      const index = Math.round(lat * 1000);
      totalScale += mercatorScaleLookup[index];
  }
  return totalScale / (steps + 1);
}

export function coordsToVector3(point: Coords, origin: Coords): Vector3Tuple {
  const latitudeDiff = (point.latitude - origin.latitude) * MathUtils.DEG2RAD;
  const longitudeDiff = (point.longitude - origin.longitude) * MathUtils.DEG2RAD;
  const altitudeDiff = (point.altitude || 0) - (origin.altitude || 0);

  const x = longitudeDiff * earthRadius * Math.cos(origin.latitude * MathUtils.DEG2RAD);
  const y = altitudeDiff;
  const zOld = -latitudeDiff * earthRadius;

  // dynamic step size based on latitude difference. calculate the mercator unit scale at origin
  // and the scale average along the line to the point for better accuracy far from origin
  const steps = Math.ceil(Math.abs(point.latitude - origin.latitude)) * 100 + 1;
  const absOriginLat = Math.abs(origin.latitude); // use abs values for scale calculation (same scale for north and south)
  const absPointLat = Math.abs(point.latitude);
  const avgScale = averageMercatorScale(absOriginLat, absPointLat, steps);
  const z = zOld / mercatorScale(absOriginLat) * avgScale;

  return [x, y, z] as Vector3Tuple;
}
