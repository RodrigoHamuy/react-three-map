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
  longitude, latitude, altitude, fromLngLat
}: Coords & { fromLngLat: FromLngLat }) {
  const center = fromLngLat([longitude, latitude], altitude);
  const scaleUnit = center.meterInMercatorCoordinateUnits();
  pos.set(center.x, center.y, center.z || 0);
  scale.set(scaleUnit, -scaleUnit, scaleUnit);
  quat.setFromEuler(euler.set(-Math.PI * .5, 0, 0));
  return m4.compose(pos, quat, scale).toArray();
}
