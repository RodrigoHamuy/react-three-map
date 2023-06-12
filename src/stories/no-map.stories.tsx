import { Canvas } from "@react-three/fiber"
import { MyScene } from "./my-scene"
import { OrbitControls } from "@react-three/drei"

export const NoMap = () => {
  return <div style={{ height: '100vh' }}>
    <Canvas camera={{position: [0,10,0]}} shadows="basic">
      <MyScene />    
      <OrbitControls makeDefault />
    </Canvas>
  </div>
}