import { PivotControls, ScreenSizer, Sphere } from "@react-three/drei";
import { useControls } from "leva";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Marker } from "react-map-gl";
import { useMap, vector3ToCoords } from "react-three-map";
import { Matrix4, Vector3, Vector3Tuple } from "three";
import { StoryMap } from "./story-map";

export function Default() {
  const origin = useControls({
    latitude: { value: 51, min: -90, max: 90 },
    longitude: { value: 0, min: -180, max: 180 }
  })
  const [position, setPosition] = useState<Vector3Tuple>([0, 0, 0]);
  const geoPos = useMemo(() => vector3ToCoords(position, origin), [position, origin])

  // reset on origin change
  useEffect(() => setPosition([0, 0, 0]), [origin]) // eslint-disable-line react-hooks/exhaustive-deps

  return <div style={{ height: '100vh' }}>
    <StoryMap
      {...origin}
      zoom={13}
      pitch={60}
      mapChildren={(
        <Marker {...geoPos}>
          <div style={{ fontSize: 18 }}>lat: {geoPos.latitude}<br />lon: {geoPos.longitude}</div>
        </Marker>
      )}
    >
      <Move position={position} setPosition={setPosition} />
      <ScreenSizer position={position} scale={1}>
        <Sphere
          args={[50]}
          position={[0, 25, 0]}
          material-color={'orange'}
        />
      </ScreenSizer>
      <axesHelper position={position} args={[1000]} />
    </StoryMap>
  </div>
}

interface MovingBoxProps {
  position: Vector3Tuple,
  setPosition: (pos: Vector3Tuple) => void
}

const _v3 = new Vector3()

const Move: FC<MovingBoxProps> = ({ position, setPosition }) => {
  const matrix = useMemo(() => new Matrix4().setPosition(...position), [position]);
  const map = useMap();
  const onDragStart = useCallback(() => {
    map.dragPan.disable();
    map.dragRotate.disable();
  }, [map]);
  const onDragEnd = useCallback(() => {
    map.dragPan.enable();
    map.dragRotate.enable();
  }, [map]);
  const onDrag = useCallback((m4: Matrix4) => {
    setPosition(_v3.setFromMatrixPosition(m4).toArray());
  }, [setPosition])
  return (
    <PivotControls
      fixed
      matrix={matrix}
      activeAxes={[true, false, true]}
      disableRotations
      scale={500}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrag={onDrag}
    />
  )
}