import { RenderProps } from "@react-three/fiber";
import { PropsWithChildren, useEffect, useId, useRef } from "react";
import { Matrix4Tuple } from "three";
import { StateRef } from "./state-ref";
import { useOnAdd } from "./use-on-add";
import { useRender } from "./use-render";

export interface useCanvasProps extends Omit<RenderProps<HTMLCanvasElement>, 'frameloop'>, PropsWithChildren {
  frameloop: 'always' | 'demand',
  m4: Matrix4Tuple;
}

export const useCanvas = (({
  m4, children, frameloop, ...renderProps
}: useCanvasProps) => {
  const id = useId();

  const stateRef: StateRef = useRef();

  const { onAdd, onRemove, mounted } = useOnAdd(stateRef, { frameloop, ...renderProps });

  const render = useRender(m4, stateRef, frameloop);

  useEffect(() => {
    if (!mounted) return;
    if (!stateRef.current) return;
    stateRef.current.root.render(<>{children}</>);
  }, [stateRef, mounted, children])

  return { id, onAdd, onRemove, render }
})