import { Matrix4Tuple, PerspectiveCamera } from "three";
import { StateRef } from "./state-ref";
import { syncCamera } from "./sync-camera";
import { useFunction } from "./use-function";

export function useRender(
  origin: Matrix4Tuple, stateRef: StateRef, frameloop: 'always' | 'demand'
) {

  const render = useFunction((_gl: WebGL2RenderingContext, mapCamMx: number[]) => {
    if (!stateRef.current?.state) return;
    const camera = stateRef.current.state.camera;
    const gl = stateRef.current.state.gl;
    const advance = stateRef.current.state.advance;
    stateRef.current.mapCamMx = mapCamMx as Matrix4Tuple;
    syncCamera(camera as PerspectiveCamera, origin, mapCamMx as Matrix4Tuple);
    gl.resetState();
    advance(Date.now() * 0.001, true);
    if (frameloop === 'always') stateRef.current.map.triggerRepaint();
  })

  return render;

}