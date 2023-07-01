import { MapControls } from "@react-three/drei";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import { MyScene } from "./my-scene";
import { StoryMap } from "./story-map";

export function WithMap() {
  return <StoryMap
    latitude={51.5073218}
    longitude={-0.1276473}
    zoom={18}
    canvas={{ shadows: 'variance' }}
  >
    <MyScene />
  </StoryMap>
}

export const WithoutMap = () => {
  return <div style={{ height: '100vh' }}>
    <FiberCanvas camera={{ position: [100, 100, 100] }} shadows="variance">
      <MyScene />
      <MapControls makeDefault />
    </FiberCanvas>
  </div>
}