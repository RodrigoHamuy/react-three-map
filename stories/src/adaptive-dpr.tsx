import { useThree } from "@react-three/fiber";
import { memo, useEffect, useState } from "react";
import { useMap } from "react-three-map";

export const AdaptiveDpr = memo(() => {
  const initialDpr = useThree(s => s.viewport.initialDpr)
  const [dpr, _setDpr] = useState(initialDpr)
  const setDpr = useThree(s => s.setDpr);
  const map = useMap();
  useEffect(() => {
    if(!map) return;
    const decreaseDpr = () => _setDpr(0.5)
    const increaseDpr = () => _setDpr(initialDpr);

    map.on('movestart', decreaseDpr);
    map.on('moveend', increaseDpr);
    return () => {
      map.off('movestart', decreaseDpr);
      map.off('moveend', increaseDpr);
    };
  }, [map, setDpr, initialDpr]);

  useEffect(() => setDpr(dpr), [dpr, setDpr]);

  return <></>;
});
AdaptiveDpr.displayName = 'AdaptiveDpr';
