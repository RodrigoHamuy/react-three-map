import { Matrix4, Matrix4Tuple, Object3D, PerspectiveCamera, Vector3 } from "three";

const originMx = new Matrix4();
const projByView = new Matrix4();
const projByViewInv = new Matrix4();
const fwd = new Vector3();
const up = new Vector3();
const pos = new Vector3();


export function syncCamera(camera: PerspectiveCamera, origin: Matrix4Tuple, mapCamMx: Matrix4Tuple) {

  projByView
    .fromArray(mapCamMx)
    .multiply(originMx.fromArray(origin));
  projByViewInv
    .copy(projByView)
    .invert();

  updateCamera(camera, projByViewInv);
  camera.updateMatrix();
  camera.updateMatrixWorld(true);  

  camera.projectionMatrix
    .copy(camera.matrix)
    .premultiply(projByView);
  camera.projectionMatrixInverse
    .copy(camera.projectionMatrix)
    .invert();

  camera.far = calculateFar(
    camera.matrix.elements[10],
    camera.matrix.elements[14],
    camera.near
  )

  camera.userData.projByView = projByView.toArray();
  camera.userData.projByViewInv = projByViewInv.toArray();

}

const updateCamera = (target: Object3D, projByViewInv: Matrix4) => {

  target.position
    .setScalar(0)
    .applyMatrix4(projByViewInv)

  up.set(0, -1, 0)
    .applyMatrix4(projByViewInv)
    .sub(target.position)
    .normalize();
  target.up.copy(up);

  fwd
    .set(0, 0, 1)
    .applyMatrix4(projByViewInv)
    .sub(target.position)
    .normalize();
  
  pos.copy(target.position).add(fwd);
  target.lookAt(pos);
}

function calculateFar(c: number, d: number, near: number): number {
  const numerator = d * (c - 1);
  const denominator = c * near + near;
  return numerator / denominator;
}