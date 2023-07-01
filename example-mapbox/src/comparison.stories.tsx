import { MapControls } from "@react-three/drei";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import { Canvas } from "react-three-map";
import { MyScene } from "./my-scene";
import { StoryMap } from "./story-map";

export function WithMap() {
  return <div style={{ height: '100vh' }}>
    <StoryMap latitude={51.5073218} longitude={-0.1276473} zoom={18}>
      <Canvas latitude={51.5073218} longitude={-0.1276473} shadows="variance">
        <MyScene />
      </Canvas>
    </StoryMap>
  </div>
}

export const WithoutMap = () => {
  return <div style={{ height: '100vh' }}>
    <FiberCanvas camera={{position: [100,100,100]}} shadows="variance">
      <MyScene />    
      <MapControls makeDefault />
    </FiberCanvas>
  </div>
}