import { MapControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { MyScene } from "./my-scene"

export const NoMap = () => {
  return <div style={{ height: '100vh' }}>
    <Canvas camera={{position: [0,10,0]}} shadows="basic">
      <MyScene />    
      <MapControls makeDefault />
    </Canvas>
  </div>
}