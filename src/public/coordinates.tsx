import { PropsWithChildren, memo, useContext, useState } from "react";
import { canvasContext } from "../core/context";
import { useCoords } from "../core/use-coords";
import { Matrix4Tuple, PerspectiveCamera, Scene } from "three";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { StateRef } from "../core/state-ref";
import { syncCamera } from "../core/sync-camera";

export interface CoordinatesProps extends PropsWithChildren {
  longitude: number,
  latitude: number,
  altitude?: number,
}

export const Coordinates = memo<CoordinatesProps>(({
  latitude, longitude, altitude = 0, children
}) => {

  const [scene] = useState(() => new Scene())

  const { stateRef, fromLngLat } = useContext(canvasContext);

  const origin = useCoords({
    latitude, longitude, altitude, fromLngLat,
  });


  return <>{createPortal(<>
    <RenderAtCoords stateRef={stateRef} origin={origin} />
    {children}
  </>, scene, { events: { priority: 2 } })}</>
})

Coordinates.displayName = 'Coordinates';

interface RenderAtCoordsProps {
  stateRef: StateRef,
  origin: Matrix4Tuple,
}

function RenderAtCoords({ stateRef, origin }: RenderAtCoordsProps) {

  const { gl, scene } = useThree()

  const [camera] = useState(() => {
    const cam = new PerspectiveCamera();
    cam.matrixAutoUpdate = false;
    return cam;
  });

  useFrame(() => {
    if (!stateRef.current?.mapCamMx) return;
    syncCamera(camera, origin, stateRef.current.mapCamMx);
    gl.clearDepth();
    gl.render(scene, camera);
  })

  return <></>
}