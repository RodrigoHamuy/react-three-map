import { RenderProps, createRoot } from "@react-three/fiber";
import { useState } from "react";
import { MapInstance } from "react-map-gl";
import { createEvents } from "./create-events";
import { StateRef } from "./state-ref";
import { useFunction } from "./use-function";

export function useOnAdd (ref: StateRef, renderProps: RenderProps<HTMLCanvasElement>) {

  const [mounted, setMounted] = useState(false);

  const onAdd = useFunction((map: MapInstance, gl: WebGLRenderingContext)=>{
   
    const canvas = map.getCanvas();
    const root = createRoot(canvas);
    root.configure({
      frameloop: "never",
      dpr: window.devicePixelRatio,
      shadows: true,
      events: createEvents(),
      ...renderProps,
      gl: {
        context: gl,
        depth: true,
        autoClear: false,
        antialias: true,
        ...renderProps?.gl,
      },
      onCreated: (state) => {
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

    ref.current = {
      map,
      root,
    }

    map.on('resize', onResize)

    setTimeout(()=>setMounted(true));
    
  })

  const onResize = useFunction(()=>{
    if(!ref.current?.state) return;
    const state = ref.current.state;
    const map = ref.current.map;
    const canvas = map.getCanvas();
    state.setSize(canvas.width, canvas.height);
  })

  const onRemove = useFunction((map: MapInstance)=>{
    setTimeout(()=>{
      if(!ref.current) return;
      ref.current.root.unmount();
      map.off(onRemove);
    })
  })

  return {onAdd, onRemove, mounted};
}