import { Box, Line, Plane, Sphere, useHelper } from "@react-three/drei";
import { useControls } from "leva";
import { useMemo, useRef } from "react";
import { getPosition } from "suncalc";
import { CameraHelper, DirectionalLight, DirectionalLightHelper, MathUtils, OrthographicCamera, Vector3Tuple } from "three";
import { StoryMap } from "../story-map";

const coords = {
  latitude: 51,
  longitude: 0,
}

export function Default() {

  return <div style={{ height: '100vh', position: 'relative' }}>
    <StoryMap
      {...coords}
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

  const { position, dayPath } = useSun();

  const lightRef = useRef<DirectionalLight>(null)

  const { showCamHelper } = useControls({ showCamHelper: false })
  const cam = useRef<OrthographicCamera>(null);
  const noCam = useRef<OrthographicCamera>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useHelper((showCamHelper ? cam : noCam) as any, CameraHelper)
  useHelper(lightRef as any, DirectionalLightHelper, 1, 'yellow')
  const camSize = 10_000;
  return <>
    <Line points={dayPath} color="orange" />
    {/* <ambientLight intensity={0.5} /> */}
    <directionalLight
      ref={lightRef}
      castShadow
      position={position}
      intensity={position[1] >= 0 ? 1.5 : 0}
      shadow-mapSize={1024}
    >
      <Sphere args={[100]} material-color="orange" />
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

function useSun() {
  const { dateString, hour } = useControls({
    dateString: {
      value: new Date().toLocaleDateString(),
      label: 'date'
    },
    hour: { value: 12, min: 0, max: 23, step: 1 },
  });

  const date = useMemo(() => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}T${hour < 10 ? `0${hour}` : hour}:00:00`);
  }, [dateString, hour])

  const { position, dayPath } = useMemo(() => {
    const position = getSunPosition({ date, ...coords });

    const tempDate = new Date(date);
    const dayPath: Vector3Tuple[] = [];
    for (let hour = 0; hour <= 24; hour++) {
      tempDate.setHours(hour);
      dayPath.push(getSunPosition({ date: tempDate, ...coords }))
    }
    return { position, dayPath }
  }, [date])

  return { position, dayPath };
}

function getSunPosition({ date, latitude, longitude, radius = 1500 }: {
  date: Date; latitude: number; longitude: number; radius?: number;
}): Vector3Tuple {
  const sun = getPosition(date, latitude, longitude);
  const x = radius * Math.cos(sun.altitude) * Math.cos(sun.azimuth);
  const z = radius * Math.cos(sun.altitude) * Math.sin(sun.azimuth);
  const y = radius * Math.sin(sun.altitude);
  return [x, y, z];
}