import { Matrix4, Matrix4Tuple } from "three";
import { StateRef } from "./state-ref";
import { useFunction } from "./use-function";

const mx = new Matrix4();

export function useRender(
  m4: Matrix4Tuple, stateRef: StateRef, frameloop: 'always' | 'demand'
) {

  const render = useFunction((_gl: WebGL2RenderingContext, matrix: number[]) => {
    if (!stateRef.current?.state) return;
    const camera = stateRef.current.state.camera;
    const gl = stateRef.current.state.gl;
    const advance = stateRef.current.state.advance;
    camera.projectionMatrix.fromArray(matrix).multiply(mx.fromArray(m4));
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    gl.resetState();
    advance(Date.now() * 0.001, true);
    if (frameloop === 'always') stateRef.current.map.triggerRepaint();
  })

  return render;

}