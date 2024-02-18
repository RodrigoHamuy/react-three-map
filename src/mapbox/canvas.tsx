/* eslint-disable @typescript-eslint/ban-ts-comment */
import { extend } from "@react-three/fiber";
import { MercatorCoordinate } from "mapbox-gl";
import { memo, useState } from "react";
import { Layer, useMap } from "react-map-gl";
import * as THREE from "three";
import { Matrix4Tuple } from "three";
import { CanvasProps } from "../api/canvas-props";
import { useCanvasInLayer } from "../core/canvas-in-layer/use-canvas-in-layer";
import { InitCanvasFC } from "../core/canvas-overlay/init-canvas-fc";
import { Render } from "../core/canvas-overlay/render";
import { MapInstance } from "../core/generic-map";
import { useFunction } from "../core/use-function";

extend(THREE);

const fromLngLat = MercatorCoordinate.fromLngLat

/** react`-three-fiber` canvas inside `Mapbox` */
export const Canvas = memo<CanvasProps>(({ overlay, ...props }) => {

  const map = useMap().current!.getMap(); // eslint-disable-line @typescript-eslint/no-non-null-assertion

  return <>
    {overlay && <CanvasOverlay map={map} {...props} />}
    {!overlay && <CanvasInLayer map={map} {...props} />}
  </>
})
Canvas.displayName = 'Canvas'

interface CanvasPropsAndMap extends CanvasProps {
  map: MapInstance;
}

const CanvasInLayer = memo<CanvasPropsAndMap>(({ map, ...props }) => {
  const layerProps = useCanvasInLayer(props, fromLngLat, map);
  /* @ts-ignore */ // eslint-disable-line @typescript-eslint/ban-ts-comment
  return <Layer {...layerProps} />
})
CanvasInLayer.displayName = 'CanvasInLayer';

const CanvasOverlay = memo<CanvasPropsAndMap>(({ map, id, beforeId, ...props }) => {
  const [onRender, setOnRender] = useState<(mx: Matrix4Tuple) => void>();

  const render = useFunction<Render>((_gl, mx) => {
    if (!onRender) return;
    onRender(mx as Matrix4Tuple);
  })

  return <>
    {/* @ts-ignore  */}
    <Layer id={id} beforeId={beforeId} type="custom" render={render} />
    <InitCanvasFC {...props}
      setOnRender={setOnRender}
      map={map}
      fromLngLat={fromLngLat}
    />
  </>
})
CanvasInLayer.displayName = 'CanvasInLayer';