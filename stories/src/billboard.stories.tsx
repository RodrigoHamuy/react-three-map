import { Billboard, Cylinder, Text } from "@react-three/drei";
import { StoryMap } from "./story-map";

export function Default() {

  return <StoryMap latitude={51} longitude={0} zoom={18} pitch={60} >
    <hemisphereLight
      args={["#ffffff", "#60666C"]}
      position={[1, 4.5, 3]}
      intensity={Math.PI}
    />
    <Cylinder args={[10, 1, 40]} position={[0, 20, 0]}>
      <meshPhongMaterial color="yellow" />
    </Cylinder>
    <Billboard position={[0, 50, 0]}>
      <Text fontSize={17} color="#2592a8">
        Hi!
      </Text>
    </Billboard>
  </StoryMap>
}