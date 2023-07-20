import { Euler, MathUtils, Matrix4, Matrix4Tuple, PerspectiveCamera, Quaternion, Vector3 } from "three";

const mx = new Matrix4();

const q = new Quaternion().setFromEuler(new Euler(180*MathUtils.DEG2RAD,0,0))


export function syncCamera(camera: PerspectiveCamera, origin: Matrix4Tuple, mapCamMx: Matrix4Tuple) {
  camera.projectionMatrix.fromArray(mapCamMx).multiply(mx.fromArray(origin));
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  // const dir = projInvMxToDirection(camera.projectionMatrixInverse);
  // camera.quaternion.matr4
  // dirToQuaternion(dir,camera.quaternion);
  // camera.projectionMatrixInverse.decompose(camera.position, camera.quaternion, camera.scale);
  // camera.quaternion.multiply(q)

  // console.log(camera.position.toArray())
}

const origin = new Vector3();
const dir = new Vector3();

/** from a projection matrix, return a direction vector in world coords */
function projInvMxToDirection(invProj: Matrix4) {
  origin.setScalar(0).applyMatrix4(invProj);
  dir.set(0,0,1)
  .applyMatrix4(invProj)
  .sub(origin)
  .normalize();
  return dir;
}

const up = new Vector3(0,1,0);

/** receive a direction vector and use it to create a Quaternion that will make an object look at that direction */
function dirToQuaternion(dir: Vector3, quat: Quaternion) {
  quat.identity();
  quat.setFromUnitVectors(up, dir);
  return quat;
}