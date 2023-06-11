import { PropsWithChildren, memo, useId, useMemo, useRef, useState } from "react";
import { Layer, MapInstance } from "react-map-gl/maplibre";
import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { coordsToMatrix } from "./coords-to-matrix";
import { useOnAdd } from "./use-on-add";
import { useRender } from "./use-render";

export interface CanvasProps extends PropsWithChildren {
  longitude: number,
  latitude: number,
  altitude?: number
}

/** react`-three-fiber` canvas inside `MapLibre` */
export const Canvas = memo<CanvasProps>(({
  longitude, latitude, altitude = 0
})=>{
  const id = useId();
  
  const ref = useRef<{renderer: WebGLRenderer, map: MapInstance}>()

  const [{scene, camera}] = useState(()=>({
    scene: new Scene,
    camera: new PerspectiveCamera,
  }))
  const m4 = useMemo(()=>coordsToMatrix({latitude, longitude, altitude}), [latitude, longitude, altitude])

  const onAdd = useOnAdd(scene, ref);

  const render = useRender(camera, scene, m4, ref);

  return <Layer
    id={id}
    type="custom"
    renderingMode="3d"
    onAdd={onAdd}
    render={render}
  />
})