import { Box } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { useControls } from "leva";
import { useState } from "react";
import { ColorRepresentation } from "three";
import { Coordinates } from "../public/coordinates";
import { StoryMap } from "./story-map";

export function Default() {

  const { blue, green, purple } = useControls({
    blue: {
      value: [-0.1261, 51.508775],
      pad: 6,
      step: 0.000001,
    },
    green: {
      value: [-0.1261, 51.508775],
      pad: 6,
      step: 0.000001,
    },
    purple: {
      value: [-0.1261, 51.508756],
      pad: 6,
      step: 0.000001,
    },
    gPrio: -1,
    pPrio: -2,
  })

  return <StoryMap
    longitude={blue[0]}
    latitude={blue[1]}
    zoom={20}
    pitch={60}
    canvas={{ frameloop: 'demand' }}>
    <MyBox position={[2, 1, 0]} color="blue" />
    <Coordinates
      longitude={green[0]}
      latitude={green[1]}
    >
      <MyBox position={[0, 1, 0]} color="green" />
    </Coordinates>
    <Coordinates
      longitude={purple[0]}
      latitude={purple[1]}
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
    scale={hovered ? 1.5 : 1}
    material-color={color}
  />
}