import { Billboard, Line, Plane, Ring, Sphere, useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { RefObject, memo, useEffect, useMemo, useRef } from "react";
import { useMap } from "react-three-map";
import { getPosition } from "suncalc";
import { BufferAttribute, BufferGeometry, CameraHelper, Color, MathUtils, OrthographicCamera, PCFSoftShadowMap, Vector3Tuple } from "three";
import { ScreenSizer } from "../screen-sizer";
import { StoryMap } from "../story-map";
import tzLookup from "tz-lookup";
import { DateTime } from "luxon";

const RADIUS = 150;

const night = new Color('#00008B');
const day = new Color('orange');

export function Default() {

  const { longitude, latitude } = useControls({
    longitude: {
      value: 0,
      min: -179,
      max: 180,
      pad: 6,
    },
    latitude: {
      value: 51,
      min: -80,
      max: 80,
      pad: 6,
    },
  })

  return <div style={{ height: '100vh', position: 'relative' }}>
    <StoryMap
      longitude={longitude}
      latitude={latitude}
      zoom={6}
      pitch={60}
      canvas={{
        shadows: {
          type: PCFSoftShadowMap,
        }
      }}>
      <ScreenSizer>
        <Sun longitude={longitude} latitude={latitude} />
        <Floor />
        <Sphere
          args={[16]}
          position={[0, 10, 0]}
          rotation={[0, 45 * MathUtils.DEG2RAD, 0]}
          castShadow receiveShadow
        >
          <meshPhongMaterial color={'#E28357'} />
        </Sphere>
      </ScreenSizer>
    </StoryMap>
  </div>
}

function Sun({ latitude, longitude }: { longitude: number, latitude: number }) {

  const { position, sunPath } = useSun({ latitude, longitude });

  useMapColorsBasedOnSun(position);

  const { showCamHelper, cameraScale } = useControls({
    showCamHelper: false,
    cameraScale: {
      value: 0.2,
      min: 0.1,
      max: 2_000_000,
    }
  })

  const camera = useRef<OrthographicCamera>(null);

  useFrame(() => {
    if (!camera.current) return;
    camera.current.left = -cameraScale;
    camera.current.right = cameraScale;
    camera.current.top = -cameraScale;
    camera.current.bottom = cameraScale;
  })

  return <>
    <SunPath path={sunPath} />
    <Analemma latitude={latitude} longitude={longitude} />
    {showCamHelper && <CamHelper key={cameraScale} camera={camera} />}
    <directionalLight
      castShadow
      position={position}
      intensity={position[1] >= 0 ? 1.5 * Math.PI: 0}
      shadow-mapSize={1024}
    >
      <Sphere args={[20]} material-color="orange" visible={position[1] >= 0} />
      <Billboard visible={position[1] < 0}>
        <Ring args={[19, 20]} material-color="orange" />
      </Billboard>
      <orthographicCamera
        ref={camera}
        attach="shadow-camera"
        left={-cameraScale}
        right={cameraScale}
        top={-cameraScale}
        bottom={cameraScale}
        near={0.1}
        far={100_000_000}
      />
    </directionalLight>
    <hemisphereLight
      args={["#343838", "#005f6b"]}
      position={position}
      visible={position[1] < 0}
      intensity={Math.PI}
    />
  </>
}

function CamHelper({ camera }: { camera: RefObject<OrthographicCamera> }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useHelper(camera as any, CameraHelper);

  return <></>
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
      .flatMap(getSunColor)
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

const _color = new Color()

function getSunColor(y: number) {
  const nightStart = -RADIUS * .5;
  const dayStart = RADIUS * .5;
  if (y <= nightStart) return night.toArray();
  if (y >= dayStart) return day.toArray();
  const d = (y - nightStart) / (dayStart - nightStart)
  return _color.copy(night).lerp(day, d).toArray();
}

function Floor() {
  return <Plane
    args={[1000, 1000]}
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

function useSun({ latitude, longitude }: { longitude: number, latitude: number }) {
  const { month, hour } = useControls({
    month: {
      value: new Date().getMonth() + 1,
      min: 1,
      max: 12,
      step: 0.1,
    },
    hour: { value: new Date().getHours(), min: 0, max: 23, step: 0.1 },
  });

  const date = useMemo(() => {
    const timeZone = tzLookup(latitude, longitude);
    return DateTime.now().setZone(timeZone).set({
      month: Math.floor(month),
      day: Math.floor((month % 1) * 27) + 1,
      hour: Math.floor(hour),
      minute: (hour % 1) * 60,
      second: 0,
      millisecond: 0,
    }).toJSDate()
  }, [latitude, longitude, month, hour])

  const { position, sunPath } = useMemo(() => {
    const position = getSunPosition({ date, latitude, longitude });

    const tempDate = new Date(date);
    const sunPath: Vector3Tuple[] = [];
    for (let hour = 0; hour <= 24; hour++) {
      tempDate.setHours(hour);
      sunPath.push(getSunPosition({ date: tempDate, latitude, longitude }))
    }
    return { position, sunPath }
  }, [date, latitude, longitude])

  return { position, sunPath };
}

interface AnalemmaProps {
  latitude: number;
  longitude: number;
}

const Analemma = memo<AnalemmaProps>(({ latitude, longitude }) => {
  const analemma = useMemo(() => getAnalemma({ latitude, longitude }), [latitude, longitude]);
  return <>
    {analemma.map((points, i) => <Line key={i}
      points={points}
      dashed
      dashScale={0.4}
      lineWidth={2}
      color="orange"
      opacity={0.5}
      transparent
    />)}

  </>
})

function getAnalemma({ latitude, longitude }: AnalemmaProps) {

  const analemma: Vector3Tuple[][] = [];
  const timeZone = tzLookup(latitude, longitude);
  const dateTime = DateTime.now()
    .setZone(timeZone)
    .set({ minute: 0, second: 0, millisecond: 0, });

  for (let hour = 0; hour < 24; hour++) {
    analemma.push([]);
    for (let day = 0; day < 365; day++) {

      const date = dateTime.set({ day, hour }).toJSDate();
      analemma[hour].push(getSunPosition({ date, latitude, longitude }));

    }
  }

  return analemma;
}

function getSunPosition({ date, latitude, longitude, radius = RADIUS }: {
  date: Date; latitude: number; longitude: number; radius?: number;
}): Vector3Tuple {
  const sun = getPosition(date, latitude, longitude);
  const x = radius * Math.cos(sun.altitude) * - Math.sin(sun.azimuth);
  const z = radius * Math.cos(sun.altitude) * Math.cos(sun.azimuth);
  const y = radius * Math.sin(sun.altitude);
  return [x, y, z];
}