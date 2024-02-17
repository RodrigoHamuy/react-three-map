import { memo, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useMap } from "react-three-map";

export const AdaptiveDpr = memo(() => {
  const setDpr = useThree(s => s.setDpr);
  const map = useMap();
  useEffect(() => {
    const decreaseDpr = () => setDpr(0.5);
    const increaseDpr = () => setDpr(window.devicePixelRatio);
    map.on('dragstart', decreaseDpr);
    map.on('rotatestart', decreaseDpr);
    map.on('zoomstart', decreaseDpr);
    map.on('dragend', increaseDpr);
    map.on('rotateend', increaseDpr);
    map.on('zoomend', increaseDpr);
    return () => {
      map.off('dragstart', decreaseDpr);
      map.off('rotatestart', decreaseDpr);
      map.off('zoomstart', decreaseDpr);
      map.off('dragend', increaseDpr);
      map.off('rotateend', increaseDpr);
      map.off('zoomend', increaseDpr);
    };
  }, [map, setDpr]);

  return <></>;
});
AdaptiveDpr.displayName = 'AdaptiveDpr';
