import { Box } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { levaStore, useControls } from "leva";
import { FC, useEffect, useState } from "react";
import { Coordinates, CoordinatesProps, NearCoordinates } from "react-three-map";
import { ColorRepresentation } from "three";
import { StoryMap } from "./story-map";

enum CoordinatesType {
  NearCoordinates = 'NearCoordinates',
  Coordinates = 'Coordinates',  
}

export function Default() {

  const { blue, green, purple, scale } = useControls({
    scale: 1,
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
  }, [])

  return <StoryMap
    longitude={blue[0]}
    latitude={blue[1]}
    zoom={20}
    pitch={60}
    canvas={{ frameloop: 'demand' }}>
    <MyBox scale={scale} position={[2, 0, 0]} color="blue" />
    <CoordsControl
      longitude={green[0]}
      latitude={green[1]}
    >
      <MyBox scale={scale} position={[-2, 0, 0]} color="green" />
    </CoordsControl>
    <CoordsControl
      longitude={purple[0]}
      latitude={purple[1]}
    >
      <MyBox scale={scale} color="purple" />
    </CoordsControl>
  </StoryMap>
}

const CoordsControl : FC<CoordinatesProps> = (props) => {
  const {coords} = useControls({
    coords: {
      value: CoordinatesType.Coordinates,
      options: CoordinatesType
    }
  })

  return <>
    {coords === CoordinatesType.Coordinates && <Coordinates {...props} />}
    {coords === CoordinatesType.NearCoordinates && <NearCoordinates {...props} />}
  </>
}

const MyBox = ({ position, color, scale }: {
  position?: Vector3,
  scale: number,
  color: ColorRepresentation
}) => {
  const [hovered, hover] = useState(false);

  scale *= hovered ? 1.5 : 1;
  const height = 7;

  return <object3D position={position}>
    <Box
    args={[1,height,1]}
    position={[0,scale * height * 0.5,0]}
    onClick={() => hover(!hovered)}
    onPointerOver={() => hover(true)}
    onPointerOut={() => hover(false)}
    scale={scale}
    material-color={color}
  />
  </object3D>
}