import { Coords } from "react-three-map";

export interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  tags?: {
    height?: string;
    min_height?: string;
    ['building:levels']?: string;
  };
  nodes?: number[];
  geometry?: Array<{
    lat: number;
    lon: number;
  }>;
}
interface OverpassApiResponse {
  version: number;
  generator: string;
  elements: OverpassElement[];
}

export async function getBuildingsData({ start, end }: { start: Coords, end: Coords }) {
  const overpassApiUrl = "https://overpass-api.de/api/interpreter";
  const bbox = [start.latitude, start.longitude, end.latitude, end.longitude].join(',');
  const query = `
  [out:json];
  (
    way["building"](${bbox});
    way["building:part"](${bbox});
    relation["building"](${bbox});
    relation["building:part"](${bbox});
  );
  out body;
  out geom;
  `;

  const response: OverpassApiResponse = await (await fetch(overpassApiUrl, {
    method: 'POST',
    body: query
  })).json();

  const buildings = response.elements.filter(e => e.geometry);

  return buildings;
}
