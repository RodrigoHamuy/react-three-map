import { MapInstance } from 'react-map-gl/maplibre';
import { useMap as useMapGeneric } from './api/use-map';

export * from './maplibre/canvas';
export * from './api/canvas-props';
export * from './api/coordinates';

export const useMap = useMapGeneric<MapInstance>;