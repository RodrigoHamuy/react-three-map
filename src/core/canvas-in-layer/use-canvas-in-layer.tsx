import { useEffect, useMemo } from "react";
import { CanvasProps } from "../../api/canvas-props";
import { FromLngLat, MapInstance } from "../generic-map";
import { useCoordsToMatrix } from "../use-coords-to-matrix";
import { useRender } from "./use-render";
import { useRoot } from "./use-root";

/** get all the properties that you need to render as a map `<Layer>` */
export function useCanvasInLayer(
  { overlay, ...props }: CanvasProps,
  fromLngLat: FromLngLat,
  map: MapInstance,
) {

  const { overlayCanvas, div } = useMemo(() => {
    if (!overlay) return {};

    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = '0';
    div.style.bottom = '0';
    div.style.left = '0';
    div.style.right = '0';
    div.style.pointerEvents = 'none';

    const overlayCanvas = document.createElement('canvas');
    div.appendChild(overlayCanvas);

    return { overlayCanvas, div }
  }, [overlay])

  const { latitude, longitude, altitude, frameloop } = props;

  const origin = useCoordsToMatrix({
    latitude, longitude, altitude, fromLngLat,
  });

  const { onRemove, useThree, r3m } = useRoot(fromLngLat, map, props, overlayCanvas);

  const render = useRender({ origin, frameloop, useThree, map, r3m });

  useEffect(() => {
    if (!div) return;
    const parent = map.getCanvas().parentElement!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    parent.appendChild(div);
    return () => {
      parent.removeChild(div);
    }
  }, [div]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    id: props.id,
    beforeId: props.beforeId,
    onRemove,
    render,
    type: 'custom',
    renderingMode: '3d',
  } as const

}