import { RenderProps } from "@react-three/fiber";
import { PropsWithChildren, useEffect, useId, useRef, useState } from "react";
import { canvasContext } from "./context";
import { FromLngLat } from "./generic-map";
import { StateRef } from "./state-ref";
import { useOnAdd } from "./use-on-add";

export interface useCanvasProps extends Omit<RenderProps<HTMLCanvasElement>, 'frameloop'>, PropsWithChildren {
  frameloop: 'always' | 'demand',
  fromLngLat: FromLngLat
}

export const useCreateRoot = (({
  children, frameloop, fromLngLat, ...renderProps
}: useCanvasProps) => {
  
  const id = useId();

  const stateRef: StateRef = useRef();

  const [contextValue] = useState(()=>({stateRef, fromLngLat}))

  const { onAdd, onRemove, mounted } = useOnAdd(stateRef, { frameloop, ...renderProps });

  useEffect(() => {
    if (!mounted) return;
    if (!stateRef.current) return;
    stateRef.current.root.render(<canvasContext.Provider value={contextValue}>
      {children}
    </canvasContext.Provider>);
  }, [stateRef, mounted, children, contextValue])

  return { id, onAdd, onRemove, stateRef }
})