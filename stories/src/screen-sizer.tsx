import { calculateScaleFactor } from '@react-three/drei';
import { Object3DProps, useFrame } from '@react-three/fiber';
import { memo, useRef } from 'react';
import { Object3D, Vector3 } from 'three';

const worldPos = new Vector3();

export const ScreenSizer = memo<Omit<Object3DProps, 'scale'> & {scale?: number}>(({
  scale = 1, ...props
}) => {
  const container = useRef<Object3D>(null);

  useFrame((state) => {
    const obj = container.current;
    if(!obj) return;
    const sf = calculateScaleFactor(obj.getWorldPosition(worldPos), scale, state.camera, state.size);
    obj.scale.setScalar(sf * scale);
  });

  return <object3D ref={container} {...props} />;
});

ScreenSizer.displayName = 'ScreenSizer';