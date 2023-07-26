import { Box, Html } from "@react-three/drei";
import { useState } from "react";
import { MathUtils } from "three";
import { StoryMap } from "./story-map";

export function Default() {

  const [hovered, hover] = useState(false);

  return <StoryMap latitude={51} longitude={0} zoom={13} pitch={60}>
    <Html center position={[0, 250, 0]} style={{ textAlign: 'center', fontSize: '2em', width: '10em', lineHeight: '1.5em', pointerEvents: 'none' }}><i>Some</i> <b>HTML</b><br />content!</Html>
    <Box
      args={[500, 500, 500]}
      position={[0, 250, 0]}
      rotation={[0, 45 * MathUtils.DEG2RAD, 0]}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      material-color={hovered ? 'purple' : 'orange'}
    />
  </StoryMap>
}