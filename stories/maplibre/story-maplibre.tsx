import { ThemeState, useLadleContext } from '@ladle/react';
import MapLibre from "maplibre-gl";
import 'maplibre-gl/dist/maplibre-gl.css';
import { FC, memo, useEffect, useRef } from "react";
import Map, { useMap } from 'react-map-gl/maplibre';
import { StoryMapProps } from '../story-map';
import { Canvas } from 'react-three-map/maplibre';

/** Maplibre `<Map>` styled for stories */
export const StoryMaplibre: FC<StoryMapProps> = ({
  latitude, longitude, canvas, children, ...rest
}) => {

  const theme = useLadleContext().globalState.theme;

  const mapStyle = theme === ThemeState.Dark
    ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  return <div style={{ height: '100vh', position: 'relative' }}>
    <Map
      mapLib={MapLibre}
      antialias
      initialViewState={{ latitude, longitude, ...rest}}
      maxPitch={rest.pitch ? Math.min(rest.pitch, 85) : undefined}
      mapStyle={mapStyle}
    >
      <FlyTo latitude={latitude} longitude={longitude} />
      <Canvas latitude={latitude} longitude={longitude} {...canvas}>
        {children}
      </Canvas>
      </Map>
  </div>
}

interface FlyToProps {
  latitude: number,
  longitude: number,
}

const FlyTo = memo<FlyToProps>(({latitude, longitude})=>{
  
  const map = useMap();
  const firstRun = useRef(true);

  useEffect(()=>{
    if(!map.current) return;
    if(firstRun.current) return;
    map.current.flyTo({
      center: [longitude, latitude],
      maxDuration: .3,
    })
  }, [map, latitude, longitude])

  useEffect(()=>{
    firstRun.current = false;
  }, [])

  return <></>
})
FlyTo.displayName = 'FlyTo';