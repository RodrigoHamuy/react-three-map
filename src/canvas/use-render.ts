import { Matrix4 } from "three";
import { StateRef } from "./state-ref";
import { useFunction } from "./use-function";

export function useRender(
  m4: Matrix4, ref: StateRef
  ) {

  const render = useFunction((_gl: WebGL2RenderingContext, matrix: number[])=>{
    if(!ref.current?.state) return;
    const camera = ref.current.state.camera;
    const gl = ref.current.state.gl;
    const advance = ref.current.state.advance;
    camera.projectionMatrix.fromArray(matrix).multiply(m4);
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    gl.resetState();
    advance(Date.now(), true);
  })

  return render;

}