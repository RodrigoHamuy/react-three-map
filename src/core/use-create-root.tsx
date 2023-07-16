import { RenderProps } from "@react-three/fiber";
import { PropsWithChildren, useEffect, useId, useRef } from "react";
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

  const { onAdd, onRemove, mounted } = useOnAdd(stateRef, fromLngLat, { frameloop, ...renderProps });

  useEffect(() => {
    if (!mounted) return;
    if (!stateRef.current) return;
    stateRef.current.root.render(<>
      {children}
    </>);
  }, [stateRef, mounted, children])

  return { id, onAdd, onRemove, stateRef }
})