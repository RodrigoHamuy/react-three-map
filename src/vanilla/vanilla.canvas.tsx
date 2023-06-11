import { MercatorCoordinate } from "maplibre-gl";
import { PropsWithChildren, memo, useId, useMemo } from "react";
import { Layer, MapInstance, useMap } from "react-map-gl/maplibre";
import { BoxGeometry, DirectionalLight, Matrix4, Matrix4Tuple, Mesh, MeshLambertMaterial, PerspectiveCamera, Scene, Vector2Tuple, Vector3, WebGLRenderer } from "three";
import { useFunction } from "../use-function";

export interface CanvasProps extends PropsWithChildren {
  longitude: number,
  latitude: number,
  altitude?: number
}

/** temp react`-three-fiber` canvas inside `MapLibre` */
export const Canvas = memo<CanvasProps>(({
  longitude, latitude, altitude = 0
})=>{
  const id = useId();
  const map = useMap();

  let renderer : WebGLRenderer;

  const {scene, modelTransform, camera} = useMemo(()=>init({latitude, longitude, altitude}), [latitude, longitude, altitude])

  const onAdd = useFunction((map: MapInstance, gl: WebGLRenderingContext)=>{

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

    // use the MapLibre GL JS map canvas for three.js
    renderer = new WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true
    });

    renderer.autoClear = false;
  })

  const render = useFunction((_gl: WebGL2RenderingContext, matrix: Matrix4Tuple)=>{
    if(!map.current) return;
    const rotationX = new Matrix4().makeRotationAxis(
      new Vector3(1, 0, 0),
      modelTransform.rotateX
    );
    const rotationY = new Matrix4().makeRotationAxis(
      new Vector3(0, 1, 0),
      modelTransform.rotateY
    );
    const rotationZ = new Matrix4().makeRotationAxis(
      new Vector3(0, 0, 1),
      modelTransform.rotateZ
    );

    const m = new Matrix4().fromArray(matrix);
    const l = new Matrix4()
      .makeTranslation(
        modelTransform.translateX,
        modelTransform.translateY,
        modelTransform.translateZ
      )
      .scale(
        new Vector3(
          modelTransform.scale,
          -modelTransform.scale,
          modelTransform.scale
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);

    camera.projectionMatrix = m.multiply(l);
    renderer.resetState();
    renderer.render(scene, camera);
    map.current.getMap().triggerRepaint();
  })
  return <Layer
    id={id}
    type="custom"
    renderingMode="3d"
    onAdd={onAdd}
    render={render}
  />
})
function init({latitude, longitude, altitude }: {
  longitude: number, latitude: number, altitude: number
}) {

  // parameters to ensure the model is georeferenced correctly on the map
  const modelOrigin : Vector2Tuple = [longitude, latitude];
  const modelRotate = [Math.PI / 2, 0, 0];

  const modelAsMercatorCoordinate = MercatorCoordinate.fromLngLat(
    modelOrigin,
    altitude
  );

  // transformation parameters to position, rotate and scale the 3D model onto the map
  const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    /* Since our 3D model is in real world meters, a scale transform needs to be
    * applied since the CustomLayerInterface expects units in MercatorCoordinates.
    */
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
  };
  
  const camera = new PerspectiveCamera();
  const scene = new Scene();

  return {scene, modelTransform, camera}

}