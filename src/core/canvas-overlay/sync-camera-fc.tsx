import { useFrame, useThree } from "@react-three/fiber";
import { memo, useEffect, useLayoutEffect, useRef } from "react";
import { Matrix4Tuple, PerspectiveCamera } from "three";
import { syncCamera } from "../sync-camera";
import { useCoordsToMatrix } from "../use-coords-to-matrix";
import { useFunction } from "../use-function";
import { useR3M } from "../use-r3m";
import { Coords } from "../use-coords";

interface SyncCameraFCProps extends Coords {
  setOnRender?: (callback: () => (mx: Matrix4Tuple) => void) => void,
  /** on `useFrame` it will manually render (used by `<Coordinates>`) */
  manualRender?: boolean,
  onReady?: () => void,
}

/** React Component (FC) to sync the Three camera with the map provider */
export const SyncCameraFC = memo<SyncCameraFCProps>(({
  latitude, longitude, altitude = 0, setOnRender, manualRender, onReady
}) => {

  const r3m = useR3M();

  const camRef = useRef<PerspectiveCamera>(null);

  const camera = useThree(s => s.camera) as PerspectiveCamera;
  const gl = useThree(s => s.gl);
  const scene = useThree(s => s.scene);
  const advance = useThree(s => s.advance);
  const set = useThree(s => s.set);

  const origin = useCoordsToMatrix({ latitude, longitude, altitude, fromLngLat: r3m.fromLngLat });

  const ready = useRef(false);

  useFrame(() => {
    syncCamera(camera, origin, r3m.viewProjMx)
    if (!manualRender) return;
    gl.render(scene, camera);
  }, -Infinity)

  const onRender = useFunction((viewProjMx: Matrix4Tuple) => {
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