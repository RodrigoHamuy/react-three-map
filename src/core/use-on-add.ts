import { RenderProps, _roots, createRoot } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { createEvents } from "./create-events";
import { FromLngLat, MapInstance } from "./generic-map";
import { R3mStore } from "./store";
import { useFunction } from "./use-function";

export function useOnAdd(
  fromLngLat: FromLngLat,
  { frameloop, ...renderProps }: RenderProps<HTMLCanvasElement>
) {

  const [mounted, setMounted] = useState(false);

  const r3mRef = useRef<R3mStore>({ fromLngLat }); 

  const onAdd = useFunction((map: MapInstance, gl: WebGLRenderingContext) => {
    
    const canvas = map.getCanvas();
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

    map.on('resize', onResize)

    setTimeout(() => setMounted(true));

  })

  const onResize = useFunction(() => {
    if (!r3mRef.current.map) return;
    if (!r3mRef.current.state) return;
    const canvas = r3mRef.current.map.getCanvas();
    r3mRef.current.state.setSize(canvas.width, canvas.height);
  })

  const onRemove = useFunction(() => {
    if (!r3mRef.current.root) return;
    r3mRef.current.root.unmount();
    r3mRef.current.root = undefined;
    if (!r3mRef.current.map) return;
    r3mRef.current.map.off('resize', onResize)
  })

  // on unmount
  useEffect(() => () => onRemove(), [onRemove])

  return { onAdd, onRemove, mounted, r3mRef };
}