import { _roots, createRoot } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { CanvasProps } from "../../api/canvas-props";
import { events } from "../events";
import { FromLngLat, MapInstance } from "../generic-map";
import { setCoords, useSetRootCoords } from "../use-coords";
import { useFunction } from "../use-function";
import { initR3M } from "../use-r3m";

export function useRoot(
  fromLngLat: FromLngLat,
  map: MapInstance,
  { frameloop, longitude, latitude, altitude, ...props }: CanvasProps
) {

  const [{ root, useThree, canvas, r3m }] = useState(() => {
    const canvas = map.getCanvas();
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext;

    const root = createRoot(canvas);
    root.configure({
      dpr: window.devicePixelRatio,
      events,
      ...props,
      frameloop: 'never',
      gl: {
        context: gl,
        autoClear: false,
        antialias: true,
        ...props?.gl,
      },
      onCreated: (state) => {
        state.gl.forceContextLoss = () => { }; // eslint-disable-line @typescript-eslint/no-empty-function
      },
      camera: {
        matrixAutoUpdate: false,
        near: 0,
      },
      size: {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        top: canvas.offsetTop,
        left: canvas.offsetLeft,
        updateStyle: false,
        ...props?.size,
      },
    });

    const store = _roots.get(canvas)!.store; // eslint-disable-line @typescript-eslint/no-non-null-assertion

    const r3m = initR3M({ map, fromLngLat, store });
    setCoords(store, {longitude, latitude, altitude});

    if (frameloop === 'demand') {
      store.setState({
        frameloop,
        invalidate: () => {
          map.triggerRepaint();
        },
      })
    }

    return { root, useThree: store, map, canvas, r3m }

  })

  const onResize = useFunction(() => {

    const { setDpr, setSize } = useThree.getState();

    setDpr(window.devicePixelRatio);

    setSize(
      canvas.clientWidth,
      canvas.clientHeight,
      false,
      canvas.offsetTop,
      canvas.offsetLeft,
    );

  })

  const onRemove = useFunction(() => {
    root.unmount();
  })

  useSetRootCoords(useThree, {longitude, latitude, altitude});

  // on `frameloop` change
  useEffect(() => {
    if (frameloop !== 'demand') return;
    const setState = useThree.setState;
    const { invalidate } = useThree.getState();
    setState({
      frameloop,
      invalidate: () => {
        map.triggerRepaint();
      }
    });
    return () => {
      setState({ frameloop: 'never', invalidate })
    }
  }, [frameloop]) // eslint-disable-line react-hooks/exhaustive-deps

  // on mount / unmount
  useEffect(() => {
    map.on('resize', onResize);
    return () => {
      map.off('resize', onResize)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // root.render
  useEffect(() => {
    root.render(<>
      {props.children}
    </>);
  }, [props.children]) // eslint-disable-line react-hooks/exhaustive-deps

  return { onRemove, useThree, r3m };
}