import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { PropsWithChildren, memo, useLayoutEffect, useRef, useState } from "react";
import { Matrix4Tuple, PerspectiveCamera, Scene } from "three";
import { syncCamera } from "../core/sync-camera";
import { useCoordsToMatrix } from "../core/use-coords-to-matrix";
import { R3M, useR3M } from "../core/use-r3m";

export interface CoordinatesProps extends PropsWithChildren {
  longitude: number,
  latitude: number,
  altitude?: number,
}

export const Coordinates = memo<CoordinatesProps>(({
  latitude, longitude, altitude = 0, children
}) => {

  const [scene] = useState(() => new Scene())

  const r3m = useR3M();

  const origin = useCoordsToMatrix({
    latitude, longitude, altitude, fromLngLat: r3m.fromLngLat,
  });


  return <>{createPortal(<>
    <RenderAtCoords r3m={r3m} origin={origin} />
    {children}
  </>, scene, { events: { priority: 2 } })}</>
})

Coordinates.displayName = 'Coordinates';

interface RenderAtCoordsProps {
  r3m: R3M,
  origin: Matrix4Tuple
}

function RenderAtCoords({ r3m, origin }: RenderAtCoordsProps) {

  const { gl, scene, set } = useThree()

  const cameraRef = useRef<PerspectiveCamera>(null)

  useFrame(() => {
    if (!cameraRef.current) return;
    syncCamera(cameraRef.current, origin, r3m.viewProjMx);
    gl.render(scene, cameraRef.current);
  })

  useLayoutEffect(() => {
    if (!cameraRef.current) return;
    set({
      invalidate: () => {
        if (!r3m.map) return;
        r3m.map.triggerRepaint();
      },
      camera: cameraRef.current,
    });
  }, [set, r3m])

  return <perspectiveCamera ref={cameraRef} />
}