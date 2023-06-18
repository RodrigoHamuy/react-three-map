import { Matrix4 } from "three";
import { StateRef } from "./state-ref";
import { useFunction } from "./use-function";

export function useRender(
  m4: Matrix4, stateRef: StateRef, frameloop: 'always'|'demand'
  ) {

  const render = useFunction((_gl: WebGL2RenderingContext, matrix: number[])=>{    
    if(!stateRef.current?.state) return;
    const camera = stateRef.current.state.camera;
    const gl = stateRef.current.state.gl;
    const advance = stateRef.current.state.advance;
    camera.projectionMatrix.fromArray(matrix).multiply(m4);
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    gl.resetState();
    advance(Date.now() * 0.001, true);
    if(frameloop === 'always') stateRef.current.map.triggerRepaint();
  })

  return render;

}