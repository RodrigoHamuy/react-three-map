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

    const { onAdd, onRemove, mounted, r3mRef } = useOnAdd(fromLngLat, map, { frameloop, ...props });

    useEffect(() => {
      if (!mounted) return;
      if (!r3mRef.current.root) return;
      r3mRef.current.root.render(<>
        {props.children}
      </>);
    }, [r3mRef, mounted, props.children])
  
    const render = useRender(origin, r3mRef, frameloop);
  
    return {
      id: props.id || id,
      onAdd,
      onRemove,
      render
    }

}