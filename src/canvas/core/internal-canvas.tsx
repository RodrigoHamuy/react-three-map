import { RenderProps } from "@react-three/fiber";
import { PropsWithChildren, memo, useEffect, useId, useRef } from "react";
import { Layer } from "react-map-gl";
import { Matrix4Tuple } from "three";
import { StateRef } from "./state-ref";
import { useOnAdd } from "./use-on-add";
import { useRender } from "./use-render";

export interface InternalCanvasProps extends Omit<RenderProps<HTMLCanvasElement>, 'frameloop'>, PropsWithChildren {
  frameloop: 'always' | 'demand',
  m4: Matrix4Tuple;
}

export const InternalCanvas = memo<InternalCanvasProps>(({
  m4, children, frameloop, ...renderProps
}) => {
  const id = useId();

  const stateRef: StateRef = useRef();

  const { onAdd, onRemove, mounted } = useOnAdd(stateRef, { frameloop, ...renderProps });

  const render = useRender(m4, stateRef, frameloop);

  useEffect(() => {
    if (!mounted) return;
    if (!stateRef.current) return;
    stateRef.current.root.render(<>{children}</>);
  }, [stateRef, mounted, children])

  return <Layer
    id={id}
    type="custom"
    renderingMode="3d"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAdd={onAdd as any}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRemove={onRemove as any}
    render={render}
  />
})

InternalCanvas.displayName = 'InternalCanvas';