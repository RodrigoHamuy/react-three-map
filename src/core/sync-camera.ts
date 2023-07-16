import { Matrix4, Matrix4Tuple, PerspectiveCamera } from "three";

const mx = new Matrix4();

export function syncCamera(camera: PerspectiveCamera, origin: Matrix4Tuple, mapCamMx: Matrix4Tuple) {
  camera.projectionMatrix.fromArray(mapCamMx).multiply(mx.fromArray(origin));
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
}