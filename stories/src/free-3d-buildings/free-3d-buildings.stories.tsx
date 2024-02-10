import { EffectComposer, N8AO } from '@react-three/postprocessing';
import { levaStore, useControls } from "leva";
import { Suspense, useEffect } from "react";
import { Coords } from "react-three-map";
import { ScreenBlend } from "../screen-blend-effect/screen-blend";
import { StoryMap } from "../story-map";
import { BatchedBuildings2 } from './batched-building2';
import { BatchedBuildings } from './batched-buildings';

const coords: Coords = { latitude: 51.5074, longitude: -0.1278 };

export function Default() {
  const { ao } = useControls({ ao: { value: false, label: 'Ambient Occlusion' } });

  // disable showBuildings3D control from Mapbox
  useControls({ showBuildings3D: { value: false, render: ()=>false } })

  useEffect(() => {
    // default this story to use overlay
    levaStore.setValueAtPath('overlay', false, true);
  }, [])

  return <StoryMap
    {...coords}
    zoom={18}
    pitch={60}
    canvas={{ shadows: 'variance' }}
  >
    {ao && <EffectComposer>
      <N8AO />
      <ScreenBlend />
      {/* ScreenBlend fixes transparency when using n8ao */}
    </EffectComposer>}
    <ambientLight intensity={Math.PI} />
    <directionalLight intensity={Math.PI} />
    <Suspense fallback={null}>
      <BatchedBuildings2 buildingsCenter={coords} origin={coords} />
    </Suspense>
  </StoryMap>
}