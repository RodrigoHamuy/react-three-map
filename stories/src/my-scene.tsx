import { Box, Plane, useHelper } from "@react-three/drei";
import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useRef, useState } from 'react';
import { CameraHelper, MathUtils, Mesh, OrthographicCamera } from "three";

export function MyScene({ showCamHelper, animate }: {
  showCamHelper?: boolean,
  animate?: boolean,
}) {
  return <>
    <Lights showCamHelper={showCamHelper} />
    <Floor />
    <MyBox animate={animate} position={[-8 * 3, 8 * 1.5, 0]} />
    <MyBox animate={animate} position={[8 * 3, 8 * 1.5, 0]} />
  </>
}


function MyBox({ animate, ...props }: MeshProps & { animate?: boolean }) {
  const [hovered, hover] = useState(false);
  const mesh = useRef<Mesh>(null)
  const invalidate = useThree(st => st.invalidate);
  const events = useThree(st => st.events);

  const onOver = useCallback(() => {
    hover(true);
  }, [])

  const onOut = useCallback(() => {
    hover(false);
  }, [])

  useFrame((_st, dt) => {
    if (!animate) return
    if (!mesh.current) return;
    mesh.current.rotateY(dt);
    invalidate();
    if (events.update) events.update();
  })

  return (
    <Box
      {...props}
      ref={mesh}
      args={[16, 16, 16]}
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
    <ambientLight intensity={0.5 * Math.PI} />
    <directionalLight
      castShadow
      position={[2.5, 50, 5]}
      intensity={1.5 * Math.PI}
      shadow-mapSize={1024}
    >
      <orthographicCamera
        ref={cam}
        attach="shadow-camera"
        args={[-camSize, camSize, -camSize, camSize, 0.1, 100]}
      />
    </directionalLight>
    <pointLight position={[50, 5, 10]} intensity={Math.PI} decay={2 / Math.PI} />
    <pointLight position={[-50, 5, 10]} intensity={Math.PI} decay={2 / Math.PI} />
    <pointLight position={[0, 5, 0]} intensity={Math.PI} decay={2 / Math.PI} />
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