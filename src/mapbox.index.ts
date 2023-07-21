import { MapInstance } from 'react-map-gl';
import { useMap as useMapGeneric } from './api/use-map';

export * from './mapbox/canvas';
export * from './api/canvas-props';
export * from './api/coordinates';

export const useMap = useMapGeneric<MapInstance>;
