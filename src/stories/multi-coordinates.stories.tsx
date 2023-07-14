import { Box } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { useState } from "react";
import { StoryMap } from "./story-map";
import { Coordinates } from "../public/coordinates";

export function Default() {

  return <StoryMap
    latitude={51.508775}
    longitude={-0.1261}
    zoom={20}
    pitch={60}
    canvas={{ frameloop: 'demand' }}>
    <MyBox position={[0, 1, 0]} />
    <Coordinates
      latitude={51.5087}
      longitude={-0.1261}
    >
      <MyBox position={[0, 1, 0]} />
    </Coordinates>
  </StoryMap>
}

const MyBox = ({ position }: { position: Vector3 }) => {

  const [hovered, hover] = useState(false);

  return <Box
    position={position}
    onPointerOver={() => hover(true)}
    onPointerOut={() => hover(false)}
    material-color={hovered ? 'purple' : 'orange'}
  />
}