import { useEffect, useId } from "react";
import { CanvasProps } from "../../api/canvas-props";
import { FromLngLat, MapInstance } from "../generic-map";
import { useCoords } from "../use-coords";
import { useRoot } from "./use-root";
import { useRender } from "./use-render";

export function useCanvasInLayer({
  longitude, latitude, altitude = 0,
  frameloop = 'always',
  ...props}: CanvasProps,fromLngLat: FromLngLat, map: MapInstance) {

    const id = useId(); 

    const origin = useCoords({
      latitude, longitude, altitude, fromLngLat,
    });

    const { onRemove, root, useThree, r3m } = useRoot(fromLngLat, map, { frameloop, ...props });

    useEffect(() => {
      root.render(<>
        {props.children}
      </>);
    }, [props.children])
  
    const render = useRender({origin, frameloop, useThree, map, r3m});
  
    return {
      id: props.id || id,
      onRemove,
      render
    }

}