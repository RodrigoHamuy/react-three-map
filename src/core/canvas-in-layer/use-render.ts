import { RootState } from "@react-three/fiber";
import { Matrix4Tuple, PerspectiveCamera } from "three";
import { UseBoundStore } from "zustand";
import { MapInstance } from "../generic-map";
import { syncCamera } from "../sync-camera";
import { useFunction } from "../use-function";

export function useRender({
  map, origin, useThree, frameloop
} :{
  map: MapInstance,
  origin: Matrix4Tuple,
  useThree: UseBoundStore<RootState>,
  frameloop: 'always' | 'demand',
}) {
  const render = useFunction((_gl: WebGL2RenderingContext, projViewMx: number[]) => {
    const state = useThree.getState();
    const camera = state.camera as PerspectiveCamera;
    const {gl, advance} = state;
    syncCamera(camera as PerspectiveCamera, origin, projViewMx as Matrix4Tuple);
    gl.resetState();
    advance(Date.now() * 0.001, true);
    if (frameloop === 'always') map.triggerRepaint();
  })
  return render;
}