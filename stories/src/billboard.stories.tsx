import { Billboard, Text } from "@react-three/drei";
import { StoryMap } from "./story-map";

export function Default() {

  return <StoryMap latitude={51} longitude={0} zoom={20} pitch={0} >
    <Billboard position={[0,50,0]}>
      <Text fontSize={17} color="#2592a8">
        Hello!
      </Text>
    </Billboard>
  </StoryMap>
}