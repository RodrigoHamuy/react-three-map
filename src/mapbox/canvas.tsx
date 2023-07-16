import { extend } from "@react-three/fiber";
import { MercatorCoordinate } from "mapbox-gl";
import { memo } from "react";
import { Layer } from "react-map-gl";
import * as THREE from "three";
import { CanvasProps } from "../api/canvas-props";
import { useCanvas } from "../core/use-canvas";

extend(THREE);

const fromLngLat = MercatorCoordinate.fromLngLat

/** react`-three-fiber` canvas inside `Mapbox` */
export const Canvas = memo<CanvasProps>((props) => {

  const { id, onAdd, onRemove, render } = useCanvas({ ...props, fromLngLat });

  return <Layer
    id={id}
    type="custom"
    renderingMode="3d"
    onAdd={onAdd}
    onRemove={onRemove}
    render={render}
  />
})