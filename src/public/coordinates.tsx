import { PerspectiveCamera as DreiPerspectiveCamera } from "@react-three/drei";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { PropsWithChildren, memo, useContext, useLayoutEffect, useState } from "react";
import { Matrix4Tuple, PerspectiveCamera, Scene } from "three";
import { canvasContext } from "../core/context";
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

  const { stateRef, fromLngLat } = useContext(canvasContext);

  const origin = useCoords({
    latitude, longitude, altitude, fromLngLat,
  });


  return <>{createPortal(<>
    <RenderAtCoords stateRef={stateRef} origin={origin} />
    <DreiPerspectiveCamera makeDefault matrixAutoUpdate={false} />
    {children}
  </>, scene, { events: { priority: 2 } })}</>
})

Coordinates.displayName = 'Coordinates';

interface RenderAtCoordsProps {
  stateRef: StateRef,
  origin: Matrix4Tuple
}

function RenderAtCoords({ stateRef, origin }: RenderAtCoordsProps) {

  const { gl, scene, camera, set } = useThree()

  useFrame(() => {
    if (!stateRef.current?.mapCamMx) return;
    syncCamera(camera as PerspectiveCamera, origin, stateRef.current.mapCamMx);
    gl.render(scene, camera);
  })

  useLayoutEffect(() => {
    set({
      invalidate: () => {
        if (!stateRef.current) return;
        stateRef.current.map.triggerRepaint();
      }
    })
  }, [set, stateRef])

  return <></>
}