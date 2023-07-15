import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { PropsWithChildren, memo, useContext, useLayoutEffect, useRef, useState } from "react";
import { Matrix4Tuple, PerspectiveCamera, Scene } from "three";
import { CanvasContext } from "../core/context";
import { StateRef } from "../core/state-ref";
import { syncCamera } from "../core/sync-camera";
import { useCoords } from "../core/use-coords";

export interface CoordinatesProps extends PropsWithChildren {
  longitude: number,
  latitude: number,
  altitude?: number,
}

export const Coordinates = memo<CoordinatesProps>(({
  latitude, longitude, altitude = 0, children
}) => {

  const [scene] = useState(() => new Scene())

  const { stateRef, fromLngLat } = useContext(CanvasContext);

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
  origin: Matrix4Tuple
}

function RenderAtCoords({ stateRef, origin }: RenderAtCoordsProps) {

  const { gl, scene, set } = useThree()

  const cameraRef = useRef<PerspectiveCamera>(null)

  useFrame(() => {
    if (!stateRef.current?.mapCamMx) return;
    if (!cameraRef.current) return;
    syncCamera(cameraRef.current, origin, stateRef.current.mapCamMx);
    gl.render(scene, cameraRef.current);
  })

  useLayoutEffect(() => {
    if (!cameraRef.current) return;
    set({
      invalidate: () => {
        if (!stateRef.current) return;
        stateRef.current.map.triggerRepaint();
      },
      camera: cameraRef.current,
    });
  }, [set, stateRef])

  return <perspectiveCamera ref={cameraRef} />
}