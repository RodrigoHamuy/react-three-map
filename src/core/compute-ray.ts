import { Matrix4, Ray } from "three";

/**
 * Builds a raycaster ray from the pointer position by unprojecting NDC points
 * through the inverted projection*view matrix.
 *
 * Both the origin (near plane) and direction (towards the far plane) are derived
 * from the pointer, so the resulting ray is the geometrically correct line
 * through the camera eye for any cursor position — the same near→far scheme
 * three.js uses in `Raycaster.setFromCamera`.
 */
export function computeRay(ray: Ray, pointerX: number, pointerY: number, projViewInv: Matrix4) {
  ray.origin.set(pointerX, pointerY, -1).applyMatrix4(projViewInv);
  ray.direction
    .set(pointerX, pointerY, 1)
    .applyMatrix4(projViewInv)
    .sub(ray.origin)
    .normalize();
}
