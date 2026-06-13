import { Matrix4, PerspectiveCamera, Ray, Vector3 } from "three";
import { expect, it } from "vitest";
import { computeRay } from "../core/compute-ray";

/**
 * For a perspective camera every pointer ray must pass through the camera eye.
 * `computeRay` satisfies this for any cursor position by deriving the origin
 * from the pointer; the previous fixed origin (`setScalar(0)`) only did so at
 * the dead centre of the view, which is the hover/raycast offset bug.
 */
it("computeRay builds a ray that passes through the perspective camera eye", () => {
  const camera = new PerspectiveCamera(60, 1.5, 0.1, 100);
  camera.position.set(3, 4, 5);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();

  // projection * view, inverted — the matrix events.ts unprojects through
  const projViewInv = new Matrix4()
    .multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    .invert();

  const ray = new Ray();
  // an off-centre pointer, where the old fixed origin was wrong
  computeRay(ray, 0.6, -0.3, projViewInv);

  // direction is unit length
  expect(ray.direction.length()).toBeCloseTo(1, 6);

  // eye is collinear with the ray: (eye - origin) is parallel to direction
  const eye = camera.position.clone();
  const toEye = eye.clone().sub(ray.origin).normalize();
  expect(Math.abs(toEye.dot(ray.direction))).toBeCloseTo(1, 5);

  // regression guard: the old origin (unprojected NDC centre) is NOT on the
  // ray, so it produced a skewed ray that missed the eye.
  const oldOrigin = new Vector3().setScalar(0).applyMatrix4(projViewInv);
  const toEyeOld = eye.clone().sub(oldOrigin).normalize();
  expect(Math.abs(toEyeOld.dot(ray.direction))).toBeLessThan(0.999);
});
