import { Box } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { useState } from "react";
import { Coordinates } from "../public/coordinates";
import { StoryMap } from "./story-map";
import { ColorRepresentation } from "three";
import { useControls } from "leva";

export function Default() {

  const { green, blue } = useControls({
    green: {
      value: [-0.1261, 51.508775],
      pad: 6,
      step: 0.00001,
    },
    blue: {
      value: [-0.1261, 51.5087],
      pad: 6,
      step: 0.00001,
    }
  })

  return <StoryMap
    longitude={green[0]}
    latitude={green[1]}
    zoom={20}
    pitch={60}
    canvas={{ frameloop: 'demand' }}>
    <MyBox position={[0, 1, 0]} color="green" />
    <Coordinates
      longitude={blue[0]}
      latitude={blue[1]}
    >
      <MyBox position={[0, 1, 0]} color="purple" />
    </Coordinates>
  </StoryMap>
}

const MyBox = ({ position, color }: { position: Vector3, color: ColorRepresentation }) => {
  const [hovered, hover] = useState(false);

  return <Box
    position={position}
    onPointerOver={() => hover(true)}
    onPointerOut={() => hover(false)}
    material-transparent
    material-color={color}
    material-opacity={hovered ? 1 : 0.5}
  />
}