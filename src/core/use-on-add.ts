import { RenderProps, _roots, createRoot } from "@react-three/fiber";
import { useState } from "react";
import { createEvents } from "./create-events";
import { FromLngLat, MapInstance } from "./generic-map";
import { StateRef } from "./state-ref";
import { R3mStore } from "./store";
import { useFunction } from "./use-function";

export function useOnAdd(
  ref: StateRef,
  fromLngLat: FromLngLat,
  { frameloop, ...renderProps }: RenderProps<HTMLCanvasElement>
) {

  const [mounted, setMounted] = useState(false);

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

        if (frameloop === 'demand') {
          state.set({
            frameloop,
            invalidate: () => {
              map.triggerRepaint();
            },
          })
        }

        ref.current = {
          state,
          map,
          root,
        }

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        state.gl.forceContextLoss = () => { };

      },
      camera: {
        matrixAutoUpdate: false,
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

    const r3m: R3mStore = {
      state: ref,
      fromLngLat,
      map,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.setState({ r3m } as any);

    ref.current = {
      map,
      root,
    }

    map.on('resize', onResize)

    setTimeout(() => setMounted(true));

  })

  const onResize = useFunction(() => {
    if (!ref.current?.state) return;
    const state = ref.current.state;
    const map = ref.current.map;
    const canvas = map.getCanvas();
    state.setSize(canvas.width, canvas.height);
  })

  const onRemove = useFunction((map: MapInstance) => {
    setTimeout(() => {
      if (!ref.current) return;
      ref.current.root.unmount();
      map.off('resize', onResize)
    })
  })

  return { onAdd, onRemove, mounted };
}