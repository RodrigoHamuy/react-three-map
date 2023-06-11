import { RenderProps, createRoot } from "@react-three/fiber";
import { MapInstance } from "react-map-gl";
import { createEvents } from "../create-events";
import { StateRef } from "./state-ref";
import { useFunction } from "./use-function";
import { useState } from "react";

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
        debugger;
        ref.current = {
          state,
          map,
          root,
        }
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

    setTimeout(()=>setMounted(true));
    
  })

  const onRemove = useFunction(()=>{
    setTimeout(()=>{
      if(!ref.current) return;
      ref.current.root.unmount();
    })
  })

  return {onAdd, onRemove, mounted};
}