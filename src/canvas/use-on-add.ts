import { MapInstance } from "react-map-gl";
import { BoxGeometry, DirectionalLight, Mesh, MeshLambertMaterial, Scene, WebGLRenderer } from "three";
import { MapRendererRef } from "./map-renderer-ref";
import { useFunction } from "./use-function";

export function useOnAdd (scene: Scene, ref: MapRendererRef) {

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

  return onAdd;

}


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