import { MapControls } from "@react-three/drei";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import { useControls } from "leva";
import { MyScene } from "./my-scene";
import { StoryMap } from "./story-map";

export function WithMap() {
  const showCamHelper = useShowCamHelper()
  const {animate} = useControls({animate: true});
  return <StoryMap
    latitude={51.5073218}
    longitude={-0.1276473}
    zoom={18}
    pitch={60}
    canvas={{ shadows: true }}
  >
    <MyScene showCamHelper={showCamHelper} animate={animate} />
  </StoryMap>
}

export const WithoutMap = () => {
  const showCamHelper = useShowCamHelper()
  const {animate} = useControls({animate: true});
  return <div style={{ height: '100vh' }}>
    <FiberCanvas camera={{ position: [100, 100, 100] }} shadows="variance">
      <MyScene showCamHelper={showCamHelper} animate={animate} />
      <MapControls makeDefault />
    </FiberCanvas>
  </div>
}

const useShowCamHelper = () => {
  const { showCamHelper } = useControls({
    showCamHelper: {
      value: false,
      label: 'show camera helper'
    }
  });
  return showCamHelper
}