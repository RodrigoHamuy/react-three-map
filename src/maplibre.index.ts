import type { Map } from 'maplibre-gl';
import { useMap as useMapGeneric } from './api/use-map';

export * from './maplibre/canvas';
export * from './api/canvas-props';
export * from './api/coordinates';

export const useMap = useMapGeneric<Map>;