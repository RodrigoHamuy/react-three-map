import { RenderProps, _roots, createRoot } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { createEvents } from "../create-events";
import { FromLngLat, MapInstance } from "../generic-map";
import { R3mStore } from "../store";
import { useFunction } from "../use-function";

export function useOnAdd(
  fromLngLat: FromLngLat,
  map: MapInstance,
  { frameloop, ...renderProps }: RenderProps<HTMLCanvasElement>
) {

  const r3mRef = useRef<R3mStore>({ fromLngLat });

  const [mounted, setMounted] = useState(true);

  const onAdd = useFunction(() => {

    setTimeout(() => setMounted(true));

  })

  const [{root, useThree, canvas }] = useState(()=>{
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

    r3mRef.current.map = map;
    r3mRef.current.root = root;
    r3mRef.current.state = store.getState();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.setState({ r3m: r3mRef.current } as any);

    if (frameloop === 'demand') {
      store.setState({
        frameloop,
        invalidate: () => {
          map.triggerRepaint();
        },
      })
    }

    return { root, useThree: store, map, canvas }

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

  return { onAdd, onRemove, mounted, r3mRef };
}