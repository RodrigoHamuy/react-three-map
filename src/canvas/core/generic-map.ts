// quick mock of functions used by Maplibre and Mapbox

/** Generic interface of Mapbox/Maplibre `LngLatLike` */
export type LngLatLike = {
	lng: number;
	lat: number;
} | {
	lon: number;
	lat: number;
} | [
	number,
	number
];

/** Generic interface of Mapbox/Maplibre `static MercatorCoordinate.fromLngLat` */
export type FromLngLat = (lngLatLike: LngLatLike, altitude?: number) => MercatorCoordinate;

/** Generic interface of Mapbox/Maplibre typeof `MercatorCoordinate` */
export interface MercatorCoordinate {
	x: number;
	y: number;
	z: number;
	meterInMercatorCoordinateUnits(): number;
}

/** Generic interface of Mapbox/Maplibre `Map` */
export interface Map {
	getCanvas(): HTMLCanvasElement;
	triggerRepaint(): void;
	on<T extends keyof MapEventType>(type: T, listener: (ev: MapEventType[T] & Object) => void): this;
	off<T extends keyof MapEventType>(type: T, listener: (ev: MapEventType[T] & Object) => void): this;
}

/** Generic interface of Mapbox/Maplibre `MapEventType` */
export type MapEventType = {
	resize: MapEvent;
};

/** Generic interface of `MapLibreEvent` or `MapBoxEvent` */
export interface MapEvent<TOrig = unknown> {
	type: string;
	target: Map;
	originalEvent: TOrig;
}