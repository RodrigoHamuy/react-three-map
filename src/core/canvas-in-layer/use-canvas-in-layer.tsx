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

  const { overlayCanvas } = useMemo(() => {
    if (!overlay) return {};
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.style.position = 'absolute';
    overlayCanvas.style.top = '0';
    overlayCanvas.style.bottom = '0';
    overlayCanvas.style.left = '0';
    overlayCanvas.style.right = '0';
    overlayCanvas.style.pointerEvents = 'none';
    return { overlayCanvas }
  }, [overlay])

  const { latitude, longitude, altitude, frameloop } = props;

  const origin = useCoordsToMatrix({
    latitude, longitude, altitude, fromLngLat,
  });

  const { onRemove, useThree, r3m } = useRoot(fromLngLat, map, props, overlayCanvas);

  const render = useRender({ origin, frameloop, useThree, map, r3m });

  useEffect(() => {
    if (!overlayCanvas) return;
    const parent = map.getCanvas().parentElement!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    parent.appendChild(overlayCanvas);
    return () => {
      parent.removeChild(overlayCanvas);
    }
  }, [overlayCanvas]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    id: props.id,
    beforeId: props.beforeId,
    onRemove,
    render,
    type: 'custom',
    renderingMode: '3d',
    canvas: overlayCanvas,
  } as const

}