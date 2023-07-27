import { Plane, Sphere, useHelper } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";
import { useMap } from "react-three-map";
import { getPosition } from "suncalc";
import { BufferAttribute, BufferGeometry, CameraHelper, Color, MathUtils, OrthographicCamera, PCFSoftShadowMap, Vector3Tuple } from "three";
import { StoryMap } from "../story-map";

const RADIUS = 1500;

const night = new Color('#00008B');
const day = new Color('orange');

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
      canvas={{
        shadows: {
          type: PCFSoftShadowMap,
        }
      }}>
      <Sun />
      <Floor />
      <Sphere
        args={[250]}
        position={[0, 250, 0]}
        rotation={[0, 45 * MathUtils.DEG2RAD, 0]}
        castShadow receiveShadow
      >
        <meshPhongMaterial color={'orange'} />
      </Sphere>
    </StoryMap>
  </div>
}

function Sun() {

  const { position, sunPath } = useSun();
  useMapColorsBasedOnSun(position);

  const { showCamHelper } = useControls({ showCamHelper: false })
  const cam = useRef<OrthographicCamera>(null);
  const noCam = useRef<OrthographicCamera>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useHelper((showCamHelper ? cam : noCam) as any, CameraHelper)
  const camSize = 2_000;
  return <>
    <SunPath path={sunPath} />
    <directionalLight
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

function SunPath({ path }: { path: Vector3Tuple[] }) {

  const geometry = useMemo(() => {
    // Define the geometry
    const geometry = new BufferGeometry();

    // Define the vertices (the end points of the line)
    const vertices = new Float32Array(path.flat());

    // Define the colors
    const colors = new Float32Array(path
      .map(p => p[1])
      .map(getSunColor)
      .flatMap(c => c.toArray())
    );

    // Attach the vertices and colors to the geometry
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));

    return geometry;
  }, [path]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <line geometry={geometry}>
    <lineBasicMaterial color="white" vertexColors />
  </line>
}

function getSunColor(y: number) {
  return night.clone().lerp(day, (y + RADIUS * .25) / (RADIUS));
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

function useMapColorsBasedOnSun(position: Vector3Tuple) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const style = position[1] > 0
      ? "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      : "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
    map.setStyle(style)
  }, [map, position])
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

  const { position, sunPath } = useMemo(() => {
    const position = getSunPosition({ date, ...coords });

    const tempDate = new Date(date);
    const sunPath: Vector3Tuple[] = [];
    for (let hour = 0; hour <= 24; hour++) {
      tempDate.setHours(hour);
      sunPath.push(getSunPosition({ date: tempDate, ...coords }))
    }
    return { position, sunPath }
  }, [date])

  return { position, sunPath };
}

function getSunPosition({ date, latitude, longitude, radius = RADIUS }: {
  date: Date; latitude: number; longitude: number; radius?: number;
}): Vector3Tuple {
  const sun = getPosition(date, latitude, longitude);
  const x = radius * Math.cos(sun.altitude) * Math.cos(sun.azimuth);
  const z = radius * Math.cos(sun.altitude) * Math.sin(sun.azimuth);
  const y = radius * Math.sin(sun.altitude);
  return [x, y, z];
}