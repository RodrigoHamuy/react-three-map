import { RenderProps } from "@react-three/fiber";
import { PropsWithChildren } from "react";

export interface CanvasProps extends Omit<RenderProps<HTMLCanvasElement>, 'frameloop'>, PropsWithChildren {
  longitude: number,
  latitude: number,
  altitude?: number,
  frameloop?: 'always' | 'demand',
}