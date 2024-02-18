import { useFrame, useThree } from "@react-three/fiber";
import { memo, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Matrix4Tuple, PerspectiveCamera } from "three";
import { Coords } from "../../api/coords";
import { MapInstance } from "../generic-map";
import { syncCamera } from "../sync-camera";
import { useCoordsToMatrix } from "../use-coords-to-matrix";
import { useFunction } from "../use-function";
import { useR3M } from "../use-r3m";

interface SyncCameraFCProps extends Coords {
  setOnRender?: (callback: () => (mx: Matrix4Tuple) => void) => void,
  /** on `useFrame` it will manually render (used by `<Coordinates>`) */
  manualRender?: boolean,
  onReady?: () => void,
  map: MapInstance,
}

/** React Component (FC) to sync the Three camera with the map provider */
export const SyncCameraFC = memo<SyncCameraFCProps>(({
  latitude, longitude, altitude = 0, setOnRender, manualRender, onReady, map
}) => {

  const mapCanvas = map.getCanvas();

  const r3m = useR3M();

  const camRef = useRef<PerspectiveCamera>(null);

  const camera = useThree(s => s.camera) as PerspectiveCamera;
  const gl = useThree(s => s.gl);
  const threeCanvas = useThree(s => s.gl.domElement);
  const scene = useThree(s => s.scene);
  const advance = useThree(s => s.advance);
  const setSize = useThree(s => s.setSize);
  const set = useThree(s => s.set);

  const origin = useCoordsToMatrix({ latitude, longitude, altitude, fromLngLat: r3m.fromLngLat });

  const ready = useRef(false);

  const triggerRepaint = useMemo(() => map.triggerRepaint, [map]);
  const mapPaintRequests = useRef(0);
  const triggerRepaintOff = useFunction(() => {
    mapPaintRequests.current++;
  })

  useFrame(() => {
    syncCamera(camera, origin, r3m.viewProjMx)

    if (manualRender) gl.render(scene, camera);

    map.triggerRepaint = triggerRepaint;
    if (mapPaintRequests.current > 0) {
      mapPaintRequests.current = 0;
      map.triggerRepaint();
    }
  }, -Infinity)

  const onRender = useFunction((viewProjMx: Matrix4Tuple) => {
    map.triggerRepaint = triggerRepaintOff;

    if (threeCanvas.width !== mapCanvas.width || threeCanvas.height !== mapCanvas.height) {
      setSize(
        mapCanvas.clientWidth,
        mapCanvas.clientHeight,
        true,
        mapCanvas.offsetTop,
        mapCanvas.offsetLeft,
      );
    }

    r3m.viewProjMx = viewProjMx;
    if (!ready.current && onReady) {
      ready.current = true;
      onReady();
    }
    advance(Date.now() * .001, true);
  })

  useEffect(() => {
    setOnRender && setOnRender(() => onRender)
  }, [setOnRender, onRender])

  useLayoutEffect(() => {
    if (!manualRender) return;
    set({ camera: camRef.current! }); // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <>
    {manualRender && <perspectiveCamera
      ref={camRef}
      matrixAutoUpdate={false}
      matrixWorldAutoUpdate={false}
    />}
  </>
})

SyncCameraFC.displayName = 'SyncCameraFC';