import { ThemeState, useLadleContext } from '@ladle/react';
import MapLibre from "maplibre-gl";
import 'maplibre-gl/dist/maplibre-gl.css';
import { FC, memo, useEffect, useRef } from "react";
import Map, { useMap } from 'react-map-gl/maplibre';
import { StoryMapProps } from '../story-map';
import { Canvas } from 'react-three-map/maplibre';

/** Maplibre `<Map>` styled for stories */
export const StoryMaplibre: FC<StoryMapProps> = ({
  latitude, longitude, canvas, mapChildren, children, ...rest
}) => {

  const theme = useLadleContext().globalState.theme;

  const mapStyle = theme === ThemeState.Dark
    ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  return <div style={{ height: '100vh', position: 'relative' }}>
    <Map
      mapLib={MapLibre}
      antialias
      initialViewState={{ latitude, longitude, ...rest }}
      maxPitch={rest.pitch ? Math.min(rest.pitch, 85) : undefined}
      mapStyle={mapStyle}
    >
      <FlyTo latitude={latitude} longitude={longitude} zoom={rest.zoom} />
      {mapChildren}
      <Canvas latitude={latitude} longitude={longitude} {...canvas}>
        {children}
      </Canvas>
    </Map>
  </div>
}

interface FlyToProps {
  latitude: number,
  longitude: number,
  zoom?: number,
}

const FlyTo = memo<FlyToProps>(({ latitude, longitude, zoom }) => {

  const map = useMap();
  const firstRun = useRef(true);

  useEffect(() => {
    if (!map.current) return;
    if (firstRun.current) return;
    map.current.easeTo({
      center: { lon: longitude, lat: latitude },
      zoom: map.current.getZoom(),
      duration: 0,
    })
  }, [map, latitude, longitude])

  useEffect(() => {
    if (!map.current) return;
    if (firstRun.current) return;
    if (zoom === undefined) return;
    map.current.easeTo({
      center: map.current.getCenter(),
      zoom,
      essential: true,
    })
  }, [map, zoom])

  useEffect(() => {
    firstRun.current = false;
  }, [])

  return <></>
})
FlyTo.displayName = 'FlyTo';