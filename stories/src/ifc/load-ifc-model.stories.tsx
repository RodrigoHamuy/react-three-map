import { Plane } from "@react-three/drei";
import { button, folder, useControls } from "leva";
import { Suspense, useCallback, useState } from "react";
import { suspend } from 'suspend-react';
import { MathUtils } from "three";
import { IFCModel } from "web-ifc-three/IFC/components/IFCModel";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { StoryMap } from "../story-map";
import modelUrl from './model.ifc?url';

export function Default() {

  const [path, setPath] = useState(modelUrl);

  const loadIfcClick = useCallback(async () => {
    try {
      setPath(await getLocalFileUrl());
    } catch (error) {
      console.warn(error);
    }
  }, [])

  useControls({
    'load IFC file': button(() => loadIfcClick())
  })

  const { latitude, longitude, position, rotation, scale } = useControls({
    coords: folder({
      latitude: {
        value: 51.508775,
        pad: 6,
      },
      longitude: {
        value: -0.1261,
        pad: 6,
      },
    }),
    position: {
      value: {x: 0, y: .32, z: 0},
      step: 1,
      pad: 2,
    },
    rotation: {
      value: 0,
      step: 1,
    },
    scale: 1,
  })

  return <StoryMap latitude={latitude} longitude={longitude} zoom={20} pitch={75} bearing={-45} canvas={{shadows: true}}>
    <Lights />
    <Plane
      args={[200, 200]}
      position={[0, 0, 0]}
      rotation={[-90 * MathUtils.DEG2RAD, 0, 0]}
      receiveShadow
    >      
      <shadowMaterial opacity={.5} />
    </Plane>
    <object3D position={[position.x, position.y, position.z]} rotation={[0,rotation*MathUtils.DEG2RAD,0]} scale={scale}>
      <Suspense fallback={<Plane
        args={[7, 16]}
        rotation={[-90 * MathUtils.DEG2RAD, 0, 0]}
        material-color="#cccccc"
      />}>
        <IfcModel path={path} />
      </Suspense>
    </object3D>
  </StoryMap>
}

function Lights() {
  const camSize = 50;
  return <>
    <ambientLight intensity={0.5 * Math.PI} />
    <directionalLight
      castShadow
      position={[2.5, 50, 5]}
      intensity={1.5 * Math.PI}
      shadow-mapSize={1024}
    >
      <orthographicCamera
        attach="shadow-camera"
        args={[-camSize, camSize, -camSize, camSize, 0.1, 100]}
      />
    </directionalLight>
    <pointLight position={[-10, 0, -20]} intensity={Math.PI} />
    <pointLight position={[0, -10, 0]} intensity={Math.PI} />
  </>
}

interface IfcModelProps {
  path: string
}

function IfcModel({ path }: IfcModelProps) {
  const model = useIFC(path);
  return <>
    <primitive object={model} />
  </>
}

function useIFC(path: string) {
  const m = suspend(() => loadIFC(path), [path]);
  return m;
}

function loadIFC(path: string) {
  return new Promise<IFCModel>((resolve, reject) => {
    const loader = new IFCLoader();
    loader.load(path, e => {
      e.castShadow = true;
      resolve(e)
    }, undefined, reject);
  })
}

async function getLocalFileUrl() {
  return new Promise<string>((resolve) => {
    const onChange = (e: Event) => {
      if (!(e.target instanceof HTMLInputElement) || !e.target.files) return;
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      resolve(url);
    };
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', onChange);
    input.accept = '.ifc';
    input.click();
  });
}
