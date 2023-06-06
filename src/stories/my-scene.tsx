import { Box, Plane, useHelper } from "@react-three/drei";
import { MeshProps } from '@react-three/fiber';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRef, useState } from 'react';
import { CameraHelper, MathUtils, MultiplyBlending, OrthographicCamera } from "three";

export function MyScene({ blend }: { blend?: boolean }) {
  return <>
    <Lights />
    <axesHelper />
    <Floor blend={blend} />
    <MyBox position={[-1.2, 1.5, 0]} />
    <MyBox position={[1.2, 1.5, 0]} />
  </>
}


function MyBox(props: MeshProps) {
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  return (
    <Box
      {...props}
      args={[1, 1, 1]}
      receiveShadow
      castShadow
      scale={props.scale || clicked ? props.scale || 1.5 : 1}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <meshStandardMaterial
        color={hovered ? "red" : "orange"}
        metalness={hovered ? 1 : .8}
        roughness={hovered ? .1 : .1}
      />
    </Box>
  );
}
function Lights() {
  const cam = useRef<OrthographicCamera>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useHelper(cam as any, CameraHelper)
  const camSize = 5;
  return <>
    <ambientLight intensity={0.5} />
    <directionalLight castShadow position={[2.5, 50, 5]} intensity={1.5} shadow-mapSize={1024}>
      <orthographicCamera
        ref={cam}
        attach="shadow-camera"
        args={[-camSize, camSize, -camSize, camSize, 0.1, 100]}
      />
    </directionalLight>
    <pointLight position={[-10, 0, -20]} color="white" intensity={1} />
    <pointLight position={[0, -10, 0]} intensity={1} />
  </>
}

function Floor({ blend }: { blend?: boolean }) {
  return <Plane
    args={[50, 50]}
    position={[0, 0, 0]}
    rotation={[-90 * MathUtils.DEG2RAD, 0, 0]}
    receiveShadow
  >
    <meshLambertMaterial
      color="white"
      blending={blend ? MultiplyBlending : undefined}
    />
  </Plane>
}