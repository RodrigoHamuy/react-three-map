import { Box, Plane, useHelper } from "@react-three/drei";
import { useControls } from "leva";
import { useRef } from "react";
import { CameraHelper, MathUtils, OrthographicCamera } from "three";
import { StoryMap } from "../story-map";

export function Default() {

  return <div style={{ height: '100vh', position: 'relative' }}>
    <StoryMap
      latitude={51}
      longitude={0}
      zoom={13}
      pitch={60}
      canvas={{ shadows: true }}>
      <Sun />
      <Floor />
      <Box
        args={[500, 500, 500]}
        position={[0, 350, 0]}
        rotation={[0, 45 * MathUtils.DEG2RAD, 0]}
        castShadow receiveShadow
      >
        <meshPhongMaterial color={'orange'} />
      </Box>
    </StoryMap>
  </div>
}

function Sun() {
  const { showCamHelper } = useControls({
    showCamHelper: true,
  })
  const cam = useRef<OrthographicCamera>(null);
  const noCam = useRef<OrthographicCamera>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useHelper((showCamHelper ? cam : noCam) as any, CameraHelper)
  const camSize = 10_000;
  return <>
    <ambientLight intensity={0.5} />
    <directionalLight
      castShadow
      position={[2.5, 5000, 5]}
      intensity={1.5}
      shadow-mapSize={1024}
    >
      <orthographicCamera
        ref={cam}
        attach="shadow-camera"
        args={[-camSize, camSize, -camSize, camSize, 0.1, 10000]}
      />
    </directionalLight>
  </>
}
function Floor() {
  return <Plane
    args={[10000, 10000]}
    position={[0, 0, 0]}
    rotation={[-90 * MathUtils.DEG2RAD, 0, 0]}
    receiveShadow
  >
    <shadowMaterial opacity={.5} />
  </Plane>
}