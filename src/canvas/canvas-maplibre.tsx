import { RenderProps, extend } from "@react-three/fiber";
import { MercatorCoordinate } from "maplibre-gl";
import { PropsWithChildren, memo, useMemo } from "react";
import * as THREE from "three";
import { coordsToMatrix } from "./core/coords-to-matrix";
import { InternalCanvas } from "./core/internal-canvas";

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
  }), [latitude, longitude, altitude])

  return <InternalCanvas
    frameloop={frameloop}
    m4={m4}
    {...renderProps}
  />
})