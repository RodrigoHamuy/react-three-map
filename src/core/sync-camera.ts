import { Matrix4, Matrix4Tuple, Object3D, PerspectiveCamera, Quaternion, Vector3 } from "three";

const mx = new Matrix4();

/** projection * view matrix  */
const projByView = new Matrix4();
/** projection * view matrix inverted */
const projByViewInv = new Matrix4();

/** forward */
const fwd = new Vector3();

const obj = new Object3D();


export function syncCamera(camera: PerspectiveCamera, origin: Matrix4Tuple, mapCamMx: Matrix4Tuple) {
  // camera.projectionMatrix.fromArray(mapCamMx).multiply(mx.fromArray(origin));
  // camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();

  projByView
    .fromArray(mapCamMx)
    .multiply(mx.fromArray(origin));
  projByViewInv
    .copy(projByView)
    .invert();

  // camera.projectionMatrix.copy(projByView);
  // camera.projectionMatrixInverse.copy(projByViewInv);

  updateCamera(camera, projByViewInv);
  camera.updateMatrix();
  camera.updateMatrixWorld(true);

  // camera.projectionMatrix.copy(camera.matrixWorldInverse).premultiply(projByView)
  // camera.projectionMatrix.copy(camera.matrixWorldInverse).multiply(projByView)
  // camera.projectionMatrix.copy(projByView).premultiply(camera.matrixWorldInverse)
  // camera.projectionMatrix.copy(projByView).multiply(camera.matrixWorldInverse)
  // camera.projectionMatrix.copy(projByViewInv).premultiply(camera.matrixWorld);
  // camera.projectionMatrix.copy(projByViewInv).multiply(camera.matrixWorld);
  

  camera.projectionMatrix.copy(camera.matrix).premultiply(projByView);
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  
  // camera.projectionMatrix.copy(camera.matrixWorld).premultiply(projByViewInv)
  // camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();

  // console.log(camera.projectionMatrix.clone().multiply(camera.matrix).equals(projByView))
  // console.log(camera.projectionMatrixInverse.clone().premultiply(camera.matrix).equals(projByView))
  // matrix * projectionMatrix = projByView
  // projectionMatrix = 

  // camera.matrix.compose(camera.position, camera.quaternion, camera.scale);
  // camera.matrixWorld.copy(camera.matrix);
  // camera.matrixWorldInverse.copy(camera.matrix)


}

export const updateCamera = (target: Object3D, projByViewInv: Matrix4) => {

  target.position
    .setScalar(0)
    .applyMatrix4(projByViewInv)

  target.up
    .set(0, -1, 0)
    .applyMatrix4(projByViewInv)
    .negate()
    .add(target.position)
    .normalize()

  fwd
    .set(0, 0, 1)
    .applyMatrix4(projByViewInv)

  target.lookAt(fwd);

}