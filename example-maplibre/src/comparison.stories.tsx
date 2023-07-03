import { MapControls } from "@react-three/drei";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import { useControls } from "leva";
import { Canvas } from "react-three-map/maplibre";
import { MyScene } from "./my-scene";
import { StoryMap } from "./story-map";

export function WithMap() {
  const showCamHelper = useShowCamHelper()
  return <StoryMap latitude={51.5073218} longitude={-0.1276473} zoom={18}>
    <Canvas latitude={51.5073218} longitude={-0.1276473} shadows="variance">
      <MyScene showCamHelper={showCamHelper} />
    </Canvas>
  </StoryMap>
}

export const WithoutMap = () => {
  const showCamHelper = useShowCamHelper()
  return <div style={{ height: '100vh' }}>
    <FiberCanvas camera={{ position: [100, 100, 100] }} shadows="variance">
      <MyScene showCamHelper={showCamHelper} />
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