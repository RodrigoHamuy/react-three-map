import { MathUtils, Vector3Tuple } from 'three';
import { Coords } from './coords';
import { earthRadius } from "../core/earth-radius";


const mercatorScaleLookup: { [key: number]: number } = {};

function getMercatorScale(lat: number): number {
  const index = Math.round(lat * 1000);
  if (mercatorScaleLookup[index] === undefined) {
    mercatorScaleLookup[index] = 1 / Math.cos(lat * MathUtils.DEG2RAD);
  }
  return mercatorScaleLookup[index];
}

export function averageMercatorScale(originLat: number, pointLat: number, steps = 10): number {
  let totalScale = 0;
  const latStep = (pointLat - originLat) / steps;
  for (let i = 0; i <= steps; i++) {
    const lat = originLat + latStep * i;
    totalScale += getMercatorScale(lat);
  }
  return totalScale / (steps + 1);
}

export function coordsToVector3(point: Coords, origin: Coords): Vector3Tuple {
  const latitudeDiff = (point.latitude - origin.latitude) * MathUtils.DEG2RAD;
  const longitudeDiff = (point.longitude - origin.longitude) * MathUtils.DEG2RAD;
  const altitudeDiff = (point.altitude || 0) - (origin.altitude || 0);

  const x = longitudeDiff * earthRadius * Math.cos(origin.latitude * MathUtils.DEG2RAD);
  const y = altitudeDiff;

  // dynamic step size based on latitude difference. calculate the mercator unit scale at origin
  // and the scale average along the line to the point for better accuracy far from origin
  const steps = Math.ceil(Math.abs(point.latitude - origin.latitude)) * 100 + 1;
  const avgScale = averageMercatorScale(origin.latitude, point.latitude, steps);

  const z = ((-latitudeDiff * earthRadius) / getMercatorScale(origin.latitude)) * avgScale;
  return [x, y, z] as Vector3Tuple;
}