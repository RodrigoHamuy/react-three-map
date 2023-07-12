import { Plane } from "@react-three/drei";
import { button, useControls } from "leva";
import { Suspense, useState } from "react";
import { suspend } from 'suspend-react';
import { MathUtils } from "three";
import { IFCModel } from "web-ifc-three/IFC/components/IFCModel";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { useFunction } from "../../core/use-function";
import { StoryMap } from "../story-map";
import modelUrl from './model.ifc?url';

export function Default() {

  const [path, setPath] = useState(modelUrl);

  const loadIfcClick = useFunction(async () => {
    try {
      setPath(await getLocalFileUrl());
    } catch (error) {
      console.warn(error);
    }
  })

  useControls({ 'load IFC file': button(() => loadIfcClick()) })

  return <StoryMap latitude={51.508775} longitude={-0.1261} zoom={20} pitch={75} bearing={-45}>
    <hemisphereLight
      args={["#ffffff", "#60666C"]}
      position={[1, 4.5, 3]}
    />
    <Suspense fallback={<Plane
      args={[7, 16]}
      rotation={[-90 * MathUtils.DEG2RAD, 0, 0]}
      material-color="#cccccc"
    />}>
      <IfcModel path={path} />
    </Suspense>
  </StoryMap>
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
      resolve(e)
    }, undefined, e => {
      reject(e)
    });
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
