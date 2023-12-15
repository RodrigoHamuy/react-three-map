import { Canvas } from "@react-three/fiber";
import { PropsWithChildren, memo, useState } from "react";
import { Matrix4Tuple } from "three";
import { events } from "../events";
import { FromLngLat, MapInstance } from "../generic-map";
import { useFunction } from "../use-function";
import { InitR3M } from "./init-r3m";
import { SyncCameraFC } from "./sync-camera-fc";

interface CanvasPortalProps extends PropsWithChildren {
  latitude: number,
  longitude: number,
  altitude?: number,
  setOnRender: (callback: () => (mx: Matrix4Tuple) => void) => void,
  map: MapInstance,
  frameloop?: 'always' | 'demand',
  fromLngLat: FromLngLat,
}

export const CanvasPortal = memo<CanvasPortalProps>(({
  children, latitude, longitude, altitude = 0,
  setOnRender, map, frameloop, fromLngLat
}) => {

  const eventSource = map.getCanvas().parentElement!;  // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const [ready, setReady] = useState(false);

  const onReady = useFunction(()=>{
    setReady(true);
  })

  return <Canvas
    frameloop={frameloop}
    camera={{
      matrixAutoUpdate: false,
      matrixWorldAutoUpdate: false,
    }}
    gl={{autoClear: false}}
    events={events}
    eventSource={eventSource}
  >
    <InitR3M
      map={map}
      fromLngLat={fromLngLat}
    />
    <SyncCameraFC
      latitude={latitude}
      longitude={longitude}
      altitude={altitude}
      setOnRender={setOnRender}
      onReady={onReady}
    />
    {ready && children}
  </Canvas>
})
CanvasPortal.displayName = 'CanvasPortal';
