import { Euler, Matrix4, Quaternion, Vector3 } from "three";
import { FromLngLat } from "./generic-map";
import { Coords } from "../api/coords";

const quat = new Quaternion();
const euler = new Euler();
const pos = new Vector3();
const scale = new Vector3();
const m4 = new Matrix4();

/** calculate Matrix4 from coordinates */
export function coordsToMatrix({
  longitude, latitude, altitude = 0, fromLngLat
}: Coords & { fromLngLat: FromLngLat }) {
  // Get Mercator coordinate for the given position
  const center = fromLngLat([longitude, latitude], altitude);
  
  // Calculate scale factor - this represents how many meters one unit represents
  const scaleUnit = center.meterInMercatorCoordinateUnits();
  
  // Set position from Mercator coordinates
  pos.set(
    center.x,
    center.y + (altitude * scaleUnit), // Apply altitude scaling
    0
  );
  
  // Apply uniform scale while preserving orientation
  scale.set(scaleUnit, -scaleUnit, scaleUnit);
  
  // Apply rotation to align with map coordinates
  // The -PI/2 rotation aligns the Y-up coordinate system with the map's coordinate system
  quat.setFromEuler(euler.set(-Math.PI * 0.5, 0, 0));
  
  // Compose the final transformation matrix
  return m4
    .makeScale(scale.x, scale.y, scale.z)
    .multiply(new Matrix4().makeRotationFromQuaternion(quat))
    .setPosition(pos)
    .toArray();
}
