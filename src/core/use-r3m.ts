import { RootState, _roots, useThree } from "@react-three/fiber"
import { Matrix4, Matrix4Tuple } from "three";
import { FromLngLat, MapInstance } from "./generic-map";
import { useMap } from "../api/use-map";
import { UseBoundStore } from 'zustand';
import { Coords } from "./coords";

export interface R3M<T extends MapInstance = MapInstance> extends Coords {
  /** Map provider */
  map: T,
  /** view projection matrix coming from the map provider */
  viewProjMx: Matrix4Tuple,
  fromLngLat: FromLngLat,
}

export function useR3M<T extends MapInstance> () {
  const r3m = useThree(s=>(s as any).r3m) as R3M<T>; // eslint-disable-line @typescript-eslint/no-explicit-any
  return r3m;
}

/** init `useR3M` hook */
export function useInitR3M<T extends MapInstance>(props: Coords & {
  map: T; fromLngLat: FromLngLat;
}) {
  const canvas = useThree(s => s.gl.domElement);
  const store = _roots.get(canvas)!.store; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const prevMap = useMap<MapInstance>();
  if(prevMap !== props.map) initR3M({...props, store});
}

export function initR3M<T extends MapInstance>({store, ...props}: Coords & {
  map: T;
  fromLngLat: FromLngLat;
  store: UseBoundStore<RootState>;
}) {
  const viewProjMx = new Matrix4().identity().toArray();
  const r3m : R3M<T> = {
    ...props,
    viewProjMx
  };
  store.setState({r3m} as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  return r3m;
}