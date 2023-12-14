import { Canvas, events as fiberEvents } from "@react-three/fiber";
import { Matrix4 } from "three";

/** projection * view matrix inverted */
const projViewInv = new Matrix4()

type Events = Parameters<typeof Canvas>[0]['events'];

export const events: Events = (store) => {
  const originalEvents = fiberEvents(store);
  return {
    ...originalEvents,
    connect: target => {
      if (!originalEvents.connect) return;
      originalEvents.connect(target.parentElement!);  // eslint-disable-line @typescript-eslint/no-non-null-assertion
    },
    compute: (event, state) => {

      state.pointer.x = (event.offsetX / state.size.width) * 2 - 1;
      state.pointer.y = 1 - (event.offsetY / state.size.height) * 2;

      if (state.camera.userData.projByViewInv) projViewInv.fromArray(state.camera.userData.projByViewInv);

      state.raycaster.camera = state.camera;
      state.raycaster.ray.origin.setScalar(0).applyMatrix4(projViewInv);
      state.raycaster.ray.direction
        .set(state.pointer.x, state.pointer.y, 1)
        .applyMatrix4(projViewInv)
        .sub(state.raycaster.ray.origin)
        .normalize();

    },
  };
};