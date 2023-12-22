import { _roots, createRoot } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { CanvasProps } from "../../api/canvas-props";
import { events } from "../events";
import { FromLngLat, MapInstance } from "../generic-map";
import { setCoords, useSetRootCoords } from "../use-coords";
import { useFunction } from "../use-function";
import { initR3M } from "../use-r3m";

export function useRoot(
  fromLngLat: FromLngLat,
  map: MapInstance,
  { frameloop, longitude, latitude, altitude, ...props }: CanvasProps,
  overlayCanvas?: HTMLCanvasElement,
) {

  const [{ root, useThree, mapCanvas, r3m }] = useState(() => {
    const mapCanvas = map.getCanvas();
    const threeCanvas = overlayCanvas || mapCanvas;
    const gl = (threeCanvas.getContext('webgl2') || threeCanvas.getContext('webgl')) as WebGLRenderingContext;

    const root = createRoot(threeCanvas);
    root.configure({
      dpr: window.devicePixelRatio,
      events: events(mapCanvas.parentElement!), // eslint-disable-line @typescript-eslint/no-non-null-assertion
      ...props,
      frameloop: 'never',
      gl: {
        context: gl,
        autoClear: !overlayCanvas,
        antialias: true,
        ...props?.gl,
      },
      onCreated: (state) => {
        state.gl.forceContextLoss = () => { }; // eslint-disable-line @typescript-eslint/no-empty-function
      },
      camera: {
        matrixAutoUpdate: false,
        near: 0,
      },
      size: {
        width: threeCanvas.clientWidth,
        height: threeCanvas.clientHeight,
        top: threeCanvas.offsetTop,
        left: threeCanvas.offsetLeft,
        updateStyle: false,
        ...props?.size,
      },
    });

    const store = _roots.get(threeCanvas)!.store; // eslint-disable-line @typescript-eslint/no-non-null-assertion

    const r3m = initR3M({ map, fromLngLat, store });
    setCoords(store, {longitude, latitude, altitude});

    if (frameloop === 'demand') {
      store.setState({
        frameloop,
        invalidate: () => {
          map.triggerRepaint();
        },
      })
    }

    return { root, useThree: store, map, threeCanvas, mapCanvas, r3m }

  })

  const onResize = useFunction(() => {

    const { setDpr, setSize } = useThree.getState();

    setDpr(window.devicePixelRatio);

    setSize(
      mapCanvas.clientWidth,
      mapCanvas.clientHeight,
      !!overlayCanvas,
      mapCanvas.offsetTop,
      mapCanvas.offsetLeft,
    );

  })

  const onRemove = useFunction(() => {
    root.unmount();
  })

  useSetRootCoords(useThree, {longitude, latitude, altitude});

  // on `frameloop` change
  useEffect(() => {
    if (frameloop !== 'demand') return;
    const setState = useThree.setState;
    const { invalidate } = useThree.getState();
    setState({
      frameloop,
      invalidate: () => {
        map.triggerRepaint();
      }
    });
    return () => {
      setState({ frameloop: 'never', invalidate })
    }
  }, [frameloop]) // eslint-disable-line react-hooks/exhaustive-deps

  // on mount / unmount
  useEffect(() => {
    map.on('resize', onResize);
    onResize();
    return () => {
      map.off('resize', onResize)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // root.render
  useEffect(() => {
    root.render(<>
      {props.children}
    </>);
  }, [props.children]) // eslint-disable-line react-hooks/exhaustive-deps

  return { onRemove, useThree, r3m };
}