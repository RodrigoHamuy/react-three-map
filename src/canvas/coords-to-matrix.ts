import { MercatorCoordinate } from "maplibre-gl";
import { Euler, Matrix4, Quaternion, Vector3 } from "three";

const quat = new Quaternion();
const euler = new Euler();
const pos = new Vector3();
const scale = new Vector3();
const mx = new Matrix4();

/** calculate Matrix4 from coordinates */
export function coordsToMatrix ({ longitude, latitude, altitude }: {
  longitude: number, latitude: number, altitude: number
}) {
  const center = MercatorCoordinate.fromLngLat([longitude, latitude], altitude);
  const scaleUnit = center.meterInMercatorCoordinateUnits();
  pos.set(center.x, center.y, center.z || 0);
  scale.set(scaleUnit, -scaleUnit, scaleUnit);
  quat.setFromEuler(euler.set(-Math.PI * .5, 0, 0));  
  return mx.compose(pos, quat, scale);
};
