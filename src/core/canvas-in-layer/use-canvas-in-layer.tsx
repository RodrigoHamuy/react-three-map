import { useEffect } from "react";
import { CanvasProps } from "../../api/canvas-props";
import { FromLngLat, MapInstance } from "../generic-map";
import { useCoords } from "../use-coords";
import { useRender } from "./use-render";
import { useRoot } from "./use-root";

/** get all the properties that you need to render as a map `<Layer>` */
export function useCanvasInLayer(props: CanvasProps,fromLngLat: FromLngLat, map: MapInstance) {

  const {latitude, longitude, altitude, frameloop } = props;

    const origin = useCoords({
      latitude, longitude, altitude, fromLngLat,
    });

    const { onRemove, root, useThree, r3m } = useRoot(fromLngLat, map, props);

    useEffect(() => {
      root.render(<>
        {props.children}
      </>);
    }, [props.children]) // eslint-disable-line react-hooks/exhaustive-deps
  
    const render = useRender({origin, frameloop, useThree, map, r3m});
  
    return {
      id: props.id,
      beforeId: props.beforeId,
      onRemove,
      render,
      type: 'custom',
      renderingMode: '3d'
    } as const

}