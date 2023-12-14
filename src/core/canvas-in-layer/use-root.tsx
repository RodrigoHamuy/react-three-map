import { RenderProps, _roots, createRoot } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { createEvents } from "../create-events";
import { FromLngLat, MapInstance } from "../generic-map";
import { useFunction } from "../use-function";
import { initR3M } from "../use-r3m";

export function useRoot(
  fromLngLat: FromLngLat,
  map: MapInstance,
  { frameloop, ...renderProps }: RenderProps<HTMLCanvasElement>
) {

  const [{root, useThree, canvas, r3m }] = useState(()=>{
    const canvas = map.getCanvas();
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext;

    const root = createRoot(canvas);
    root.configure({
      dpr: window.devicePixelRatio,
      events: createEvents(),
      ...renderProps,
      frameloop: 'never',
      gl: {
        context: gl,
        depth: true,
        autoClear: false,
        antialias: true,
        ...renderProps?.gl,
      },
      onCreated: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        state.gl.forceContextLoss = () => { };
      },
      camera: {
        matrixAutoUpdate: false,
        near: 0,
      },
      size: {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        top: 0,
        left: 0,
        updateStyle: false,
        ...renderProps?.size,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const store = _roots.get(canvas)!.store;

    const r3m = initR3M(map, fromLngLat, store);

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

    const {setDpr, setSize} = useThree.getState();

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

  useEffect(()=>{
    map.on('resize', onResize);
    return () => {
      map.off('resize', onResize)
    }
  }, [])

  return { root, onRemove, useThree, r3m };
}