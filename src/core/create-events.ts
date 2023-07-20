import { Events, RenderProps, RootState, createEvents as createFiberEvents } from "@react-three/fiber";
import { PerspectiveCamera } from "three";
import { UseBoundStore } from "zustand";

type DomEvent = PointerEvent | MouseEvent | WheelEvent;

const DOM_EVENTS = {
  onClick: ["click", false],
  onContextMenu: ["contextmenu", false],
  onDoubleClick: ["dblclick", false],
  onWheel: ["wheel", true],
  onPointerDown: ["pointerdown", true],
  onPointerUp: ["pointerup", true],
  onPointerLeave: ["pointerleave", true],
  onPointerMove: ["pointermove", true],
  onPointerCancel: ["pointercancel", true],
  onLostPointerCapture: ["lostpointercapture", true],
} as const;

const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

/** ThreeLayer event manager for MapLibre and Mapbox */
export function createEvents(): RenderProps<HTMLCanvasElement>["events"] {
  return (store: UseBoundStore<RootState>) => {
    const { handlePointer } = createFiberEvents(store);
    const rayCamera = new PerspectiveCamera();
    rayCamera.position.z = 5
    rayCamera.matrixAutoUpdate = false;
    rayCamera.matrixWorldAutoUpdate = false;
    rayCamera.lookAt(0, 0, 0)

    return {
      priority: 1,
      enabled: true,
      compute(event: DomEvent, state: RootState) {
        state.size.width = state.gl.domElement.width / window.devicePixelRatio;
        state.size.height = state.gl.domElement.height / window.devicePixelRatio;
        state.pointer.x = (event.offsetX / state.size.width) * 2 - 1;
        state.pointer.y = 1 - (event.offsetY / state.size.height) * 2;

        rayCamera.copy(state.camera as PerspectiveCamera);

        const projByViewInv = rayCamera.userData.projByViewInv || identity;

        rayCamera.matrix.identity();
        rayCamera.matrixWorld.identity();
        rayCamera.matrixWorldInverse.copy(rayCamera.matrixWorld).invert();
        rayCamera.projectionMatrixInverse.fromArray(projByViewInv)
        rayCamera.projectionMatrix.fromArray(rayCamera.userData.projByView)

        state.raycaster.camera = state.camera;
        state.raycaster.ray.origin.setScalar(0).applyMatrix4(rayCamera.projectionMatrixInverse);
        state.raycaster.ray.direction
          .set(state.pointer.x, state.pointer.y, 1)
          .applyMatrix4(rayCamera.projectionMatrixInverse)
          .sub(state.raycaster.ray.origin)
          .normalize();
      },
      connected: undefined,
      handlers: Object.keys(DOM_EVENTS).reduce(
        (acc, key) => ({ ...acc, [key]: handlePointer(key) }),
        {}
      ) as unknown as Events,
      update: () => {
        const { events, internal } = store.getState();
        if (internal.lastEvent?.current && events.handlers) {
          events.handlers.onPointerMove(internal.lastEvent.current);
        }
      },
      connect: (target: HTMLElement) => {
        const { set, events } = store.getState();
        events.disconnect?.();
        set((state) => ({ events: { ...state.events, connected: target.parentNode } }));
        Object.entries(events.handlers ?? []).forEach(([name, event]) => {
          const [eventName, passive] = DOM_EVENTS[name as keyof typeof DOM_EVENTS];
          target.addEventListener(eventName, event, { passive });
        });
      },
      disconnect: () => {
        const { set, events } = store.getState();
        if (events.connected) {
          Object.entries(events.handlers ?? []).forEach(([name, event]) => {
            if (events && events.connected instanceof HTMLElement) {
              const [eventName] = DOM_EVENTS[name as keyof typeof DOM_EVENTS];
              events.connected.removeEventListener(eventName, event);
            }
          });
          set((state) => ({ events: { ...state.events, connected: undefined } }));
        }
      },
    };
  };
}
