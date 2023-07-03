import { useFrame, Vector3 } from "@react-three/fiber";
import { useControls } from "leva";
import Mapbox from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { FC, PropsWithChildren, useRef, useState } from "react";
import Map from 'react-map-gl';
import { Canvas } from "react-three-map";
import { Mesh } from "three";

export default { title: 'Canvas' }

const Box: FC<{ position: Vector3 }> = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh>(null)
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta;
    ref.current.rotation.z -= delta;
  })
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export function BasicExample() {

  const { mapboxToken } = useControls({
    mapboxToken: {
      value: import.meta.env.VITE_MAPBOX_TOKEN || '',
      label: 'mapbox token',
    }
  })

  Mapbox.accessToken = mapboxToken;

  return <div style={{ height: '100vh' }}>
    {!mapboxToken && <Center>Add a mapbox token to load this component</Center>}
    {mapboxToken && <Map
      antialias
      initialViewState={{
        latitude: 51,
        longitude: 0,
        zoom: 13,
        pitch: 60,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      <Canvas latitude={51} longitude={0}>
        <hemisphereLight
          args={["#ffffff", "#60666C"]}
          position={[1, 4.5, 3]}
        />
        <object3D scale={500}>
          <Box position={[-1.2, 1, 0]} />
          <Box position={[1.2, 1, 0]} />
        </object3D>
      </Canvas>
    </Map>}
  </div>
}

const Center = ({ children }: PropsWithChildren) => (
  <div style={{
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }}>{children}</div>
)