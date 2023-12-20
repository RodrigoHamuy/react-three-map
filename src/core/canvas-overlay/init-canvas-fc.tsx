import { memo, useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import { Matrix4Tuple } from "three";
import { CanvasProps } from "../../api/canvas-props";
import { FromLngLat, MapInstance } from "../generic-map";
import { CanvasPortal } from "./canvas-portal";

interface InitCanvasFCProps extends CanvasProps {
  map: MapInstance,
  setOnRender: (callback: () => (mx: Matrix4Tuple) => void) => void,
  frameloop?: 'always' | 'demand',
  fromLngLat: FromLngLat,
}
export const InitCanvasFC = memo<InitCanvasFCProps>((props) => {
  const canvas = props.map.getCanvas() // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const [el] = useState(() => {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.top = '0';
    el.style.bottom = '0';
    el.style.left = '0';
    el.style.right = '0';
    el.style.pointerEvents = 'none';
    return el
  })

  useEffect(() => {
    const parent = canvas.parentElement!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    parent.appendChild(el);
    return () => {
      parent.removeChild(el);
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return <>
    {createPortal((
      <CanvasPortal {...props} />
    ), el)}
  </>
})
InitCanvasFC.displayName = 'InitCanvasFC';
