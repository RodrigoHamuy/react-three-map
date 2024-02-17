import { Box, Plane } from "@react-three/drei";
import { EffectComposer, N8AO } from '@react-three/postprocessing';
import { levaStore, useControls } from "leva";
import { useEffect, useState } from "react";
import { MathUtils } from "three";
import { ScreenBlend } from "./screen-blend-effect/screen-blend";
import { StoryMap } from "./story-map";
import { AdaptiveDpr } from "./adaptive-dpr";

export function Default() {
  const { ao } = useControls({ ao: { value: true, label: 'Ambient Occlusion' } });

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

  const [toggle, setToggle] = useState(false);
  return <StoryMap
    latitude={51.508}
    longitude={-0.1281}
    zoom={18}
    pitch={60}
    canvas={{ shadows: 'variance' }}
  >
    <AdaptiveDpr />
    {ao && <EffectComposer>
      <N8AO />
      <ScreenBlend />
      {/* ScreenBlend forces transparency to work on the canvas overlay */}
    </EffectComposer>}
    <object3D scale={35} rotation={[0, 13 * MathUtils.DEG2RAD, 0]}>
      <Box position={[0, .5, 0]}
        material-color={toggle ? 'yellow' : '#ccc'}
        material-transparent
        material-opacity={.5}
        onPointerEnter={() => setToggle(true)}
        onPointerLeave={() => setToggle(false)}
      />
      <Plane scale={2} position={[0, 0, 0]} rotation={[-90 * MathUtils.DEG2RAD, 0, 0]} material-color="#ccc" />
    </object3D>
  </StoryMap>
}

