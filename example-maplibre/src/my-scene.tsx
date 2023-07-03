import { Box, Plane, useHelper } from "@react-three/drei";
import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useRef, useState } from 'react';
import { CameraHelper, MathUtils, Mesh, OrthographicCamera } from "three";

export function MyScene({ showCamHelper }: { showCamHelper?: boolean }) {
  return <>
    <Lights showCamHelper={showCamHelper} />
    <Floor />
    <MyBox position={[-8 * 3, 8 * 1.5, 0]} />
    <MyBox position={[8 * 3, 8 * 1.5, 0]} />
  </>
}


function MyBox(props: MeshProps) {
  const [hovered, hover] = useState(false);
  const mesh = useRef<Mesh>(null)
  const invalidate = useThree(st => st.invalidate);

  const onOver = useCallback(() => {
    hover(true);
  }, [])

  const onOut = useCallback(() => {
    hover(false);
  }, [])

  useFrame((_st, dt) => {
    if (!mesh.current) return;
    mesh.current.rotateY(dt);
    invalidate();
  })

  return (
    <Box
      {...props}
      ref={mesh}
      args={[16, 16, 16]}
      receiveShadow
      castShadow
      onClick={onOver}
      onPointerOver={onOver}
      onPointerOut={onOut}
    >
      <meshStandardMaterial
        color={hovered ? "red" : "orange"}
        metalness={.75}
        roughness={.5}
      />
    </Box>
  );
}
function Lights({ showCamHelper }: { showCamHelper?: boolean }) {
  const cam = useRef<OrthographicCamera>(null);
  const noCam = useRef<OrthographicCamera>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useHelper((showCamHelper ? cam : noCam) as any, CameraHelper)
  const camSize = 100;
  return <>
    <ambientLight intensity={0.5} />
    <directionalLight
      castShadow
      position={[2.5, 50, 5]}
      intensity={1.5}
      shadow-mapSize={1024}
    >
      <orthographicCamera
        ref={cam}
        attach="shadow-camera"
        args={[-camSize, camSize, -camSize, camSize, 0.1, 100]}
        rotation={[0, 90 * MathUtils.DEG2RAD, 0]}
      />
    </directionalLight>
    <pointLight position={[-10, 0, -20]} color="white" intensity={1} />
    <pointLight position={[0, -10, 0]} intensity={1} />
  </>
}

function Floor() {
  return <Plane
    args={[200, 200]}
    position={[0, 0, 0]}
    rotation={[-90 * MathUtils.DEG2RAD, 0, 0]}
    receiveShadow
  >
    <shadowMaterial opacity={.5} />
  </Plane>
}