import { RenderProps } from "@react-three/fiber";
import { PropsWithChildren, useEffect, useId } from "react";
import { FromLngLat } from "./generic-map";
import { useOnAdd } from "./use-on-add";

export interface useCanvasProps extends Omit<RenderProps<HTMLCanvasElement>, 'frameloop'>, PropsWithChildren {
  frameloop: 'always' | 'demand',
  fromLngLat: FromLngLat
}

export const useCreateRoot = (({
  children, frameloop, fromLngLat, ...renderProps
}: useCanvasProps) => {

  const id = useId();

  const { onAdd, onRemove, mounted, r3mRef } = useOnAdd(fromLngLat, { frameloop, ...renderProps });

  useEffect(() => {
    if (!mounted) return;
    if (!r3mRef.current.root) return;
    r3mRef.current.root.render(<>
      {children}
    </>);
  }, [r3mRef, mounted, children])

  return { id, onAdd, onRemove, r3mRef }
})