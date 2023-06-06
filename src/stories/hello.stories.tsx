import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Marker } from 'react-map-gl/maplibre';

export function App() {
  return <div style={{ height: '100vh' }}>
    <Map
      initialViewState={{
        latitude: 37.8,
        longitude: -122.4,
        zoom: 14
      }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    >
      <Marker latitude={37.8} longitude={-122.4} color="red" />
    </Map>
  </div>
}