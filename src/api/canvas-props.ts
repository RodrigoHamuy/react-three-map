import { RenderProps } from "@react-three/fiber";
import { PropsWithChildren } from "react";

export interface CanvasProps extends Omit<RenderProps<HTMLCanvasElement>, 'frameloop'>, PropsWithChildren {
  id?: string;
  beforeId?: string;
  longitude: number,
  latitude: number,
  altitude?: number,
  frameloop?: 'always' | 'demand',
  /** render on a separated `<canvas>` that sits on top of the map provider */
  overlay?: boolean,
}
