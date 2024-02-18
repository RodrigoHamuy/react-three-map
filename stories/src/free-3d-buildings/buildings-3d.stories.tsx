import { ActionType, ThemeState, useLadleContext } from '@ladle/react';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { levaStore, useControls } from "leva";
import { Suspense, useEffect } from "react";
import { Coords } from "react-three-map";
import { ScreenBlend } from "../screen-blend-effect/screen-blend";
import { StoryMap } from "../story-map";
import { BatchedBuildings } from "./batched-buildings";
import { AdaptiveDpr } from '../adaptive-dpr';

const coords: Coords = { latitude: 51.5074, longitude: -0.1278 };

export function Default() {
  const { dispatch, globalState } = useLadleContext();
  const { bloom } = useControls({ bloom: { value: true } });

  // disable showBuildings3D control from Mapbox
  useControls({ showBuildings3D: { value: false, render: () => false } });
  const { luminanceThreshold, levels, intensity, luminanceSmoothing } = useControls('bloom', {
    levels: { value: 3, min: 0, max: 10, step: 0.01 },
    intensity: { value: 1.62, min: 0, max: 2, step: 0.01 },
    luminanceThreshold: { value: .1, min: 0, max: 2, step: 0.01, label: 'threshold' },
    luminanceSmoothing: { value: 2, min: 0, max: 5, step: 0.01, label: 'smoothing' },
  })

  // use dark theme
  useEffect(() => {
    const prevTheme = globalState.theme
    dispatch({ type: ActionType.UpdateTheme, value: ThemeState.Dark })
    return () => {
      // reset theme
      dispatch({ type: ActionType.UpdateTheme, value: prevTheme })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // default this story to use overlay
  useEffect(() => {
    const overlay = levaStore.get('overlay');
    levaStore.setValueAtPath('overlay', true, true);
    return () => {
      // reset overlay
      if (overlay) return;
      levaStore.setValueAtPath('overlay', overlay, true);
    }
  }, [])

  return <StoryMap
    {...coords}
    zoom={18}
    pitch={60}
    canvas={{ shadows: 'variance' }}
  >
    <AdaptiveDpr />
    {bloom && <EffectComposer disableNormalPass>
      <Bloom mipmapBlur
        luminanceSmoothing={luminanceSmoothing}
        luminanceThreshold={luminanceThreshold}
        levels={levels}
        intensity={intensity}
      />
      {/* ScreenBlend forces transparency to work on the canvas overlay */}
      <ScreenBlend />
    </EffectComposer>}
    <ambientLight intensity={Math.PI} />
    <directionalLight intensity={Math.PI} />
    <Suspense fallback={null}>
      <BatchedBuildings buildingsCenter={coords} origin={coords} />
    </Suspense>
  </StoryMap>
}