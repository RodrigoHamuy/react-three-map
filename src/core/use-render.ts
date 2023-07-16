import { MutableRefObject } from "react";
import { Matrix4Tuple, PerspectiveCamera } from "three";
import { R3mStore } from "./store";
import { syncCamera } from "./sync-camera";
import { useFunction } from "./use-function";

export function useRender(
  origin: Matrix4Tuple, r3mRef: MutableRefObject<R3mStore>, frameloop: 'always' | 'demand'
) {

  const render = useFunction((_gl: WebGL2RenderingContext, mapCamMx: number[]) => {
    const r3m = r3mRef.current;
    if (!r3m.state || !r3m.map) return;
    const camera = r3m.state.camera;
    const gl = r3m.state.gl;
    const advance = r3m.state.advance;
    r3m.mapCamMx = mapCamMx as Matrix4Tuple;
    syncCamera(camera as PerspectiveCamera, origin, mapCamMx as Matrix4Tuple);
    gl.resetState();
    advance(Date.now() * 0.001, true);
    if (frameloop === 'always') r3m.map.triggerRepaint();
  })

  return render;

}