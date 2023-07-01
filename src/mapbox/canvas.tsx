import { RenderProps, extend } from "@react-three/fiber";
import { MercatorCoordinate } from "mapbox-gl";
import { PropsWithChildren, memo, useMemo } from "react";
import { Layer } from "react-map-gl";
import * as THREE from "three";
import { coordsToMatrix } from "../core/coords-to-matrix";
import { useCanvas } from "../core/use-canvas";

extend(THREE);

export interface CanvasProps extends Omit<RenderProps<HTMLCanvasElement>, 'frameloop'>, PropsWithChildren {
  longitude: number,
  latitude: number,
  altitude?: number,
  frameloop?: 'always' | 'demand',
}

/** react`-three-fiber` canvas inside `MapLibre` */
export const Canvas = memo<CanvasProps>(({
  longitude, latitude, altitude = 0,
  frameloop = 'always', ...renderProps
}) => {

  const m4 = useMemo(() => coordsToMatrix({
    latitude, longitude, altitude, fromLngLat: MercatorCoordinate.fromLngLat,
  }), [latitude, longitude, altitude]);

  const { id, onAdd, onRemove, render } = useCanvas({ m4, frameloop, ...renderProps });

  return <Layer
    id={id}
    type="custom"
    renderingMode="3d"
    onAdd={onAdd}
    onRemove={onRemove}
    render={render}
  />
})