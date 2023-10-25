// mock of functions used by `react-three-map` from `Maplibre` or `Mapbox`

/** Generic interface of Mapbox/Maplibre `LayerProps` */
export interface LayerProps {
	id: string;
	type: 'custom';
	renderingMode: '3d';
	onRemove?(map: MapInstance, gl: WebGLRenderingContext): void;
	onAdd?(map: MapInstance, gl: WebGLRenderingContext): void;
	prerender?(gl: WebGLRenderingContext, matrix: number[]): void;
	render(gl: WebGLRenderingContext, matrix: number[]): void;
}

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
	z?: number;
	meterInMercatorCoordinateUnits(): number;
}

/** Generic interface of Mapbox/Maplibre `Map` */
export interface MapInstance {
	getCanvas(): HTMLCanvasElement;
	/** MapLibre only */
	getPixelRatio?: ()=>number;
	triggerRepaint(): void;
	// eslint-disable-next-line @typescript-eslint/ban-types
	on<T extends keyof MapEventType>(type: T, listener: (ev: MapEventType[T] & Object) => void): this;
	// eslint-disable-next-line @typescript-eslint/ban-types
	off<T extends keyof MapEventType>(type: T, listener: (ev: MapEventType[T] & Object) => void): this;
}

/** Generic interface of Mapbox/Maplibre `MapEventType` */
export type MapEventType = {
	resize: MapEvent;
};

/** Generic interface of `MapLibreEvent` or `MapBoxEvent` */
export interface MapEvent<TOrig = unknown> {
	type: string;
	target: MapInstance;
	originalEvent: TOrig;
}