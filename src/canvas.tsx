import { PropsWithChildren, memo, useId, useMemo, useRef, useState } from "react";
import { Layer, MapInstance } from "react-map-gl/maplibre";
import { BoxGeometry, DirectionalLight, Mesh, MeshLambertMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { coordsToMatrix } from "./coords-to-matrix";
import { useFunction } from "./use-function";

export interface CanvasProps extends PropsWithChildren {
  longitude: number,
  latitude: number,
  altitude?: number
}

/** react`-three-fiber` canvas inside `MapLibre` */
export const Canvas = memo<CanvasProps>(({
  longitude, latitude, altitude = 0
})=>{
  const id = useId();
  
  const ref = useRef<{renderer: WebGLRenderer, map: MapInstance}>()

  const [{scene, camera}] = useState(()=>({
    scene: new Scene,
    camera: new PerspectiveCamera,
  }))
  const m4 = useMemo(()=>coordsToMatrix({latitude, longitude, altitude}), [latitude, longitude, altitude])

  const onAdd = useFunction((map: MapInstance, gl: WebGLRenderingContext)=>{
    addStuff(scene);
    // use the MapLibre GL JS map canvas for three.js
    const renderer = new WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true
    });

    renderer.autoClear = false;

    ref.current = {
      renderer,
      map,
    }
  })

  const render = useFunction((_gl: WebGL2RenderingContext, matrix: number[])=>{
    if(!ref.current) return;
    camera.projectionMatrix.fromArray(matrix).multiply(m4);
    ref.current.renderer.resetState();
    ref.current.renderer.render(scene, camera);
    ref.current.map.triggerRepaint();
  })

  return <Layer
    id={id}
    type="custom"
    renderingMode="3d"
    onAdd={onAdd}
    render={render}
  />
})

function addStuff(scene: Scene) {
  // create two three.js lights to illuminate the model
  const directionalLight = new DirectionalLight(0xffffff);
  directionalLight.position.set(0, -70, 100).normalize();
  scene.add(directionalLight);

  const directionalLight2 = new DirectionalLight(0xffffff);
  directionalLight2.position.set(0, 70, 100).normalize();
  scene.add(directionalLight2);

  const box = new Mesh(
    new BoxGeometry(100,500,100),
    new MeshLambertMaterial({color: 'orange'})
  );
  scene.add(box);

}