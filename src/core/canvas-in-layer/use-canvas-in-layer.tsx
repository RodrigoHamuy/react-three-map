import { useEffect, useId } from "react";
import { CanvasProps } from "../../api/canvas-props";
import { FromLngLat, MapInstance } from "../generic-map";
import { useCoords } from "../use-coords";
import { useRender } from "../use-render";
import { useOnAdd } from "./use-on-add";

export function useCanvasInLayer({
  longitude, latitude, altitude = 0,
  frameloop = 'always',
  ...props}: CanvasProps,fromLngLat: FromLngLat, map: MapInstance) {

    const id = useId(); 

    const origin = useCoords({
      latitude, longitude, altitude, fromLngLat,
    });

    const { onRemove, r3mRef, root } = useOnAdd(fromLngLat, map, { frameloop, ...props });

    useEffect(() => {
      root.render(<>
        {props.children}
      </>);
    }, [props.children])
  
    const render = useRender(origin, r3mRef, frameloop);
  
    return {
      id: props.id || id,
      onRemove,
      render
    }

}