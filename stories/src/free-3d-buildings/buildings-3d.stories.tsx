import { Bloom, EffectComposer, N8AO } from '@react-three/postprocessing';
import { levaStore, useControls } from "leva";
import { Suspense, useEffect } from "react";
import { Coords } from "react-three-map";
import { ScreenBlend } from "../screen-blend-effect/screen-blend";
import { StoryMap } from "../story-map";
import { BatchedBuildings } from "./batched-buildings";

const coords: Coords = { latitude: 51.5074, longitude: -0.1278 };

export function Default() {
  const { ao } = useControls({ ao: { value: true, label: 'Ambient Occlusion' } });

  // disable showBuildings3D control from Mapbox
  useControls({ showBuildings3D: { value: false, render: () => false } });
  const {luminanceThreshold,levels,intensity} = useControls({
    luminanceThreshold: { value: 1, min: 0, max: 2, step: 0.01 },
    levels: { value: 1, min: 0, max: 2, step: 0.01 },
    intensity: { value: 1, min: 0, max: 2, step: 0.01 },
  })

  useEffect(() => {
    // default this story to use overlay
    levaStore.setValueAtPath('overlay', true, true);
  }, [])

  return <StoryMap
    {...coords}
    zoom={18}
    pitch={60}
    canvas={{ shadows: 'variance' }}
  >
    {ao && <EffectComposer disableNormalPass>
      <Bloom mipmapBlur 
      luminanceThreshold={luminanceThreshold} levels={levels} intensity={intensity}
      // luminanceThreshold={1.07} levels={2} intensity={.81}
      />
      {/* <N8AO /> */}
      <ScreenBlend />
      {/* ScreenBlend fixes transparency when using n8ao */}
    </EffectComposer>}
    <ambientLight intensity={Math.PI} />
    <directionalLight intensity={Math.PI} />
    <Suspense fallback={null}>
      <BatchedBuildings buildingsCenter={coords} origin={coords} />
    </Suspense>
  </StoryMap>
}