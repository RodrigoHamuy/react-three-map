import { Layer, LayerProps, Source, SourceProps } from 'react-map-gl/maplibre';

const source : SourceProps = {
  id: 'urban-areas',
  type: 'geojson',
  data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_urban_areas.geojson'
}

const layer : LayerProps = {
  id: 'urban-areas-fill',
  type: 'fill',
  source: 'urban-areas',
  layout: {},
  paint: {
    'fill-color': '#f08',
    'fill-opacity': 0.4
  }
};

export const UrbanAreas = () => {
  return <Source {...source}>
    <Layer {...layer} />
  </Source>
}