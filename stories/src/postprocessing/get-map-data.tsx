import { EventData, MapboxGeoJSONFeature } from "mapbox-gl";
import { useEffect, useMemo, useState } from "react";
import { MapSourceDataEvent } from 'react-map-gl';
import { coordsToVector3, useMap } from "react-three-map";
import { Vector2Tuple, Vector3Tuple } from "three";
import { useFunction } from "../../../src/core/use-function";
import { Tile } from "./tile";

export function GetMapData({origin}: {
  origin: { longitude: number; latitude: number; }
}) {
  const map = useMap();

  /** Map<tile coords, Map<height, polys>> */
  const [data, setData] = useState(new Map<string, Map<number, Vector2Tuple[][]>>());

  /** Map<tile coords, Map<height, polys>> */
  const tiles = useMemo<Map<string, Map<number, Vector3Tuple[][]>>>(() => {
    const newTiles = new Map<string, Map<number, Vector3Tuple[][]>>();
    let i = 0;
    for (const [id, tile] of data.entries()) {
      const newTile = new Map<number, Vector3Tuple[][]>();
      for (const [height, polys] of tile.entries()) {
        i++;
        newTile.set(height, polys.map(poly => poly.map(p => coordsToVector3({ longitude: p[0], latitude: p[1] }, origin))));
      }
      newTiles.set(id, newTile);
    }
    console.log(i);

    return newTiles;
  }, [data]);

  const getBuildings = useFunction(() => {
    setData(prev => {

      let didChange = false;

      const data = new Map(prev);
      var features = map.querySourceFeatures('composite', {
        sourceLayer: 'building'
      }).filter(f => f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon') as (MapboxGeoJSONFeature & { tile: { x: number; y: number; }; })[];

      for (const feat of features) {
        const id = `${feat.tile.x}.${feat.tile.y}`;
        if (!data.has(id)) {
          data.set(id, new Map());
        }
        const tile = data.get(id)!;
        const height: number = feat.properties?.height ?? 1;
        if (!tile.has(height)) {
          tile.set(height, []);
        }
        const polys = tile.get(height)!;
        let newPolys: Vector2Tuple[][] = [];
        if (feat.geometry.type === 'Polygon') {
          newPolys = feat.geometry.coordinates as Vector2Tuple[][];
        }
        if (feat.geometry.type === 'MultiPolygon') {
          newPolys = feat.geometry.coordinates.flat() as Vector2Tuple[][];
        }
        for (const poly of newPolys) {
          // check for duplicates
          if (polys.some(p => p.length === poly.length && p.every((v, i) => v === poly[i])))
            continue;
          polys.push(poly);
          didChange = true;
        }
      }

      return didChange ? data : prev;
    });
    
  })

  useEffect(() => {
    const callback = (e: MapSourceDataEvent & EventData) => {
      if (e.sourceId !== '3d-buildings') return;
      getBuildings()
    };
    map.on('sourcedata', callback);
    getBuildings();
    return () => {
      map.off('sourcedata', callback);
    };
  }, []);

  return <>
    {Array.from(tiles.entries()).map(([id, tile]) => <Tile
      key={id}
      tile={Array.from(tile).map(([height, polys]) => ({ height, polys }))} />)}
  </>;
}
