import { Canvas } from "@react-three/fiber";
import { memo, useState } from "react";
import { Matrix4Tuple } from "three";
import { CanvasProps } from "../../api/canvas-props";
import { events } from "../events";
import { FromLngLat, MapInstance } from "../generic-map";
import { useFunction } from "../use-function";
import { InitR3M } from "./init-r3m";
import { SyncCameraFC } from "./sync-camera-fc";

interface CanvasPortalProps extends CanvasProps {
  setOnRender: (callback: () => (mx: Matrix4Tuple) => void) => void,
  map: MapInstance,
  fromLngLat: FromLngLat,
}

export const CanvasPortal = memo<CanvasPortalProps>(({
  children, latitude, longitude, altitude,
  setOnRender, map, fromLngLat, ...props
}) => {

  const mapCanvas = map.getCanvas();
  const eventSource = mapCanvas.parentElement!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const [ready, setReady] = useState(false);

  const onReady = useFunction(() => {
    setReady(true);
  })

  return <Canvas
    camera={{
      matrixAutoUpdate: false,
      matrixWorldAutoUpdate: false,
    }}
    events={events}
    eventSource={eventSource}
    {...props}
    gl={{ autoClear: false, ...props.gl }}
  >
    <InitR3M
      map={map}
      fromLngLat={fromLngLat}
      latitude={latitude}
      longitude={longitude}
      altitude={altitude}
    />
    <SyncCameraFC
      latitude={latitude}
      longitude={longitude}
      altitude={altitude}
      setOnRender={setOnRender}
      onReady={onReady}
      map={map}
    />
    {ready && children}
  </Canvas>
})
CanvasPortal.displayName = 'CanvasPortal';
