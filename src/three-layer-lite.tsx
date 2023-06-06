import { ReconcilerRoot, RenderProps, createRoot } from "@react-three/fiber";
import { MercatorCoordinate } from "maplibre-gl";
import { PropsWithChildren, memo, useEffect, useId, useMemo, useRef, useState } from "react";
import { Layer, useMap } from "react-map-gl/maplibre";
import { Euler, Matrix4, Matrix4Tuple, Quaternion, Scene, Vector3, WebGLRenderer } from "three";
import { createEvents } from "./create-events";
import { SyncLayer } from "./sync-layer";
import { useStore } from "./use-store";
import { useFunction } from "./use-function";

export interface ThreeLayerLiteProps extends RenderProps<HTMLCanvasElement>, PropsWithChildren {
  longitude: number,
  latitude: number,
  altitude?: number
}

export const ThreeLayerLite = memo<ThreeLayerLiteProps>(({
  longitude, latitude, altitude=0, children, ...renderProps
}) => {
  const id = useId();
  const coordsMx = useCoordsToMx({ longitude, latitude, altitude });
  const state = useRef<{ gl: WebGLRenderer, scene: Scene }>();
  const store = useStore();

  const [root, setRoot] = useState<ReconcilerRoot<HTMLCanvasElement>>();
  const map = useMap();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const render = useFunction((_: any, baseCamMx: Matrix4Tuple) => {
    if (!state.current) return;
    if (!map.current) return;
    store.setState({ timestamp: Date.now(), baseCamMx });
  });

  const onAdd = useFunction(async (map: mapboxgl.Map) => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const canvas = map.getCanvas();
    const context = canvas.getContext("webgl");
    if (!context) return;
    const root = createRoot(canvas);
    root.configure({
      frameloop: "never",
      dpr: window.devicePixelRatio,
      shadows: true,
      events: createEvents(),
      ...renderProps,
      gl: {
        context,
        depth: true,
        autoClear: false,
        antialias: true,
        ...renderProps?.gl,
      },
      onCreated: ({ gl, scene }) => {
        state.current = { gl, scene };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        gl.forceContextLoss = () => { };
      },
      camera: {
        matrixAutoUpdate: false,
      },
      size: {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        top: 0,
        left: 0,
        ...renderProps?.size,
      },
    });

    setRoot(root);
  });

  useEffect(() => {
    if (!root) return;
    root.render(<>
      <SyncLayer
        coordsMx={coordsMx}
        store={store}
        />
      {children}
    </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map.current, children, root, coordsMx, store]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => root?.unmount(), [map, root]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => root?.unmount(), []);
  
  return <Layer id={id} type="custom" renderingMode="3d" render={render} onAdd={onAdd} />;
})

ThreeLayerLite.displayName = "TreeLayer";

/** calculate Matrix4 from coordinates */
const useCoordsToMx = ({ longitude, latitude, altitude }: {
  longitude: number, latitude: number, altitude: number
}) => {
  const m4 = useMemo(()=>{
    const center = MercatorCoordinate.fromLngLat([longitude, latitude], altitude);
    const scaleUnit = center.meterInMercatorCoordinateUnits();
    const pos = new Vector3(center.x, center.y, center.z || 0);
    const scale = new Vector3(scaleUnit, -scaleUnit, scaleUnit);
    const quat = new Quaternion().setFromEuler(new Euler(-Math.PI * .5, 0, 0));
    return new Matrix4().compose(pos, quat, scale);
  }, [longitude, latitude, altitude])
  return m4;
};
