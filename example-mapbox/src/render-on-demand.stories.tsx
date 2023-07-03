import { Box, Stats } from "@react-three/drei";
import { useRef, useState } from "react";
import { Canvas } from "react-three-map";
import { MathUtils } from "three";
import { StoryMap } from "./story-map";

export function Default() {

  const [hovered, hover] = useState(false);

  const ref = useRef<HTMLDivElement>(null)

  return <div style={{ height: '100vh', position: 'relative' }}>
    <style>{`.stats{position:absolute !important}`}</style>
    <StoryMap latitude={51} longitude={0} zoom={13}>
      <Canvas latitude={51} longitude={0} frameloop="demand">
        <Box
          args={[500, 500, 500]}
          position={[0, 250, 0]}
          rotation={[0, 45 * MathUtils.DEG2RAD, 0]}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          material-color={hovered ? 'purple' : 'orange'}
        />
        <Stats className="stats" parent={ref} />
      </Canvas>
    </StoryMap>
    <div style={{ position: 'absolute', bottom: 0, right: 0, left: 0, background: '#ffffffc2', padding: '15px 20px 40px' }}>
      Hover over the box, it will only render once to change colour, or when you move the camera. Look at the stats to confirm.
    </div>
  </div>
}