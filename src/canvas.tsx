import { CustomLayerInterface, Map, MercatorCoordinate } from "maplibre-gl";
import { PropsWithChildren, memo, useEffect, useId } from "react";
import { useMap } from "react-map-gl/maplibre";
import { Vector2Tuple, PerspectiveCamera, Scene, WebGLRenderer, DirectionalLight, Mesh, BoxGeometry, MeshLambertMaterial, Matrix4, Vector3 } from "three";

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
  const map = useMap();

  useEffect(()=>{
    if(!map.current) return;
    init({map: map.current.getMap(), latitude, longitude, altitude, id});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])
  return <></>
})

function init({id, map, latitude, longitude, altitude }: {
  id: string, map: Map, longitude: number, latitude: number, altitude: number
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
  let renderer : WebGLRenderer;

  // configuration of the custom layer for a 3D model per the CustomLayerInterface
  const customLayer : CustomLayerInterface = {
    id,
    type: 'custom',
    renderingMode: '3d',
    onAdd: function (map, gl) {

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
    },
    render: function (_gl, matrix) {
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
      map.triggerRepaint();
    }
  };

  map.on('style.load', function () {
    map.addLayer(customLayer);
  });
}