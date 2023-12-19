import type { Map } from 'maplibre-gl';
import { useMap as useMapGeneric } from './api/use-map';

export * from './api/canvas-props';
export * from './api/coordinates';
export * from './api/near-coordinates';
export * from './maplibre/canvas';

export const useMap = useMapGeneric<Map>;