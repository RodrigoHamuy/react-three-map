import { extend } from "@react-three/fiber";
import { MercatorCoordinate } from "maplibre-gl";
import { memo } from "react";
import { Layer } from "react-map-gl/maplibre";
import * as THREE from "three";
import { useCanvas } from "../core/use-canvas";
import { CanvasProps } from "../api/canvas-props";

extend(THREE);

const fromLngLat = MercatorCoordinate.fromLngLat

/** react`-three-fiber` canvas inside `MapLibre` */
export const Canvas = memo<CanvasProps>((props) => {

  const { id, onAdd, onRemove, render } = useCanvas({ ...props, fromLngLat });

  return <Layer
    id={props.id ?? id}
    type="custom"
    renderingMode="3d"
    onAdd={onAdd}
    onRemove={onRemove}
    render={render}
    beforeId={props.beforeId}
  />
})
