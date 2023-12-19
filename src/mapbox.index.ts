import type { Map } from 'mapbox-gl';
import { useMap as useMapGeneric } from './api/use-map';

export * from './api/canvas-props';
export * from './api/coordinates';
export * from './api/near-coordinates';
export * from './mapbox/canvas';

export const useMap = useMapGeneric<Map>;
