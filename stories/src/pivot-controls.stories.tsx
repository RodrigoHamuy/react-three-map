import { Box, PivotControls } from "@react-three/drei";
import { useMap } from "react-three-map";
import { MathUtils } from "three";
import { StoryMap } from "./story-map";

export function Default() {

  return <StoryMap latitude={51} longitude={0} zoom={13} pitch={60}>
    <MovingBox />
  </StoryMap>
}

const MovingBox = () => {
  const map = useMap();
  return (
    <PivotControls
      fixed
      activeAxes={[true, false, true]}
      disableRotations
      scale={500}
      onDragStart={() => map.dragPan.disable()}
      onDragEnd={() => map.dragPan.enable()}
    >
      <Box
        args={[500, 500, 500]}
        position={[0, 250, 0]}
        rotation={[0, 45 * MathUtils.DEG2RAD, 0]}
        material-color={'orange'}
      />
    </PivotControls>
  )
}