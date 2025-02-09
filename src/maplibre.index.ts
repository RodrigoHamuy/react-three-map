import type { Map } from 'maplibre-gl';
import { useMap as useMapGeneric } from './api/use-map';

export * from './api';
export * from './maplibre/canvas';

export const useMap = useMapGeneric<Map>;
