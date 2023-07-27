import { MercatorCoordinate as MercatorCoordinateBox } from "mapbox-gl";
import { MercatorCoordinate as MercatorCoordinateLibre } from "maplibre-gl";
import { expect, it } from 'vitest';
import { coordsToMatrix } from '../core/coords-to-matrix';

it('coordsToMatrix works with mapbox', ()=>{
  const value = coordsToMatrix({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    fromLngLat: MercatorCoordinateBox.fromLngLat,
  });
  expect(value).toMatchFileSnapshot(`./__snapshots__/coords-to-matrix.json`);
})

it('coordsToMatrix works with maplibre', ()=>{
  const value = coordsToMatrix({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    fromLngLat: MercatorCoordinateLibre.fromLngLat,
  });
  expect(value).toMatchFileSnapshot(`./__snapshots__/coords-to-matrix.json`);
})