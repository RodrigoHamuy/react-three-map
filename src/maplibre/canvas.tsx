import { extend } from "@react-three/fiber";
import { MercatorCoordinate } from "maplibre-gl";
import { FC, memo } from "react";
import { Layer, useMap } from "react-map-gl/maplibre";
import * as THREE from "three";
import { CanvasProps } from "../api/canvas-props";
import { useCanvasInLayer } from "../core/canvas-in-layer/use-canvas-in-layer";

extend(THREE);

const fromLngLat = MercatorCoordinate.fromLngLat

/** react`-three-fiber` canvas inside `MapLibre` */
export const Canvas = memo<CanvasProps>(props => {
  // we use a key to remount everything from scratch when `overlay` changes
  return <CanvasWithKey key={props.overlay ? 0 : 1} {...props} />
})
Canvas.displayName = 'Canvas'

export const CanvasWithKey : FC<CanvasProps> = (props) => {

  const map = useMap().current!.getMap(); // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const layerProps = useCanvasInLayer(props, fromLngLat, map);

  return <Layer {...layerProps} />

}