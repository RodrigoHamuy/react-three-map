import { Camera } from "@react-three/fiber";
import { MapRendererRef } from "./map-renderer-ref";
import { useFunction } from "./use-function";
import { Matrix4, Scene } from "three";

export function useRender(
  camera: Camera, scene: Scene, m4: Matrix4, ref: MapRendererRef
  ) {

  const render = useFunction((_gl: WebGL2RenderingContext, matrix: number[])=>{
    if(!ref.current) return;
    camera.projectionMatrix.fromArray(matrix).multiply(m4);
    ref.current.renderer.resetState();
    ref.current.renderer.render(scene, camera);
    ref.current.map.triggerRepaint();
  })

  return render;

}