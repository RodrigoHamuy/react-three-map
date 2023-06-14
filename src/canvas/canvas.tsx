import { RenderProps, extend } from "@react-three/fiber";
import { PropsWithChildren, memo, useEffect, useId, useMemo, useRef } from "react";
import { Layer } from "react-map-gl/maplibre";
import * as THREE from "three";
import { coordsToMatrix } from "./coords-to-matrix";
import { StateRef } from "./state-ref";
import { useOnAdd } from "./use-on-add";
import { useRender } from "./use-render";

extend(THREE);

export interface CanvasProps extends RenderProps<HTMLCanvasElement>, PropsWithChildren {
  longitude: number,
  latitude: number,
  altitude?: number
}

/** react`-three-fiber` canvas inside `MapLibre` */
export const Canvas = memo<CanvasProps>(({
  longitude, latitude, altitude = 0,
  children, ...renderProps
})=>{
  const id = useId();
  
  const ref : StateRef = useRef();

  const m4 = useMemo(()=>coordsToMatrix({
    latitude, longitude, altitude
  }), [latitude, longitude, altitude])

  const {onAdd, onRemove, mounted} = useOnAdd(ref, renderProps);

  const render = useRender(m4, ref);

  useEffect(()=>{
    if(!mounted) return;
    if(!ref.current) return;
    ref.current.root.render(<>{children}</>);
  }, [ref, mounted, children])

  return <Layer
    id={id}
    type="custom"
    renderingMode="3d"
    onAdd={onAdd}
    onRemove={onRemove}
    render={render}
  />
})