import { Box } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { levaStore, useControls } from "leva";
import { useEffect, useState } from "react";
import { ColorRepresentation } from "three";
import { Coordinates } from "react-three-map";
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
  })

  useEffect(()=>{
    // default this story to not use overlay
    levaStore.setValueAtPath('overlay', false, true);
    // levaStore.setValueAtPath('overlay', false, true);
  }, [])

  return <StoryMap
    longitude={blue[0]}
    latitude={blue[1]}
    zoom={20}
    pitch={60}
    canvas={{ frameloop: 'demand' }}>
    <MyBox position={[2, 0, 0]} color="blue" />
    <Coordinates
      longitude={green[0]}
      latitude={green[1]}
    >
      <MyBox position={[-2, 0, 0]} color="green" />
    </Coordinates>
    <Coordinates
      longitude={purple[0]}
      latitude={purple[1]}
    >
      <MyBox position={[0, 0, 0]} color="purple" />
    </Coordinates>
  </StoryMap>
}

const MyBox = ({ position, color }: { position: Vector3, color: ColorRepresentation }) => {
  const [hovered, hover] = useState(false);

  return <object3D position={position}>
    <Box
    args={[1,7,1]}
    position={[0,hovered ? 3.5 * 1.5 : 3.5,0]}
    onClick={() => hover(!hovered)}
    onPointerOver={() => hover(true)}
    onPointerOut={() => hover(false)}
    scale={hovered ? 1.5 : 1}
    material-color={color}
  />
  </object3D>
}