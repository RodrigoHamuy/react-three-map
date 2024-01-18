import { dequal } from 'dequal';
import { Map as MapboxMap, MapboxGeoJSONFeature } from "mapbox-gl";
import { Coords, coordsToVector3 } from "react-three-map";
import { BatchedMesh, ExtrudeGeometry, Matrix4, Shape, Vector2Tuple, Vector3Tuple } from "three";
import { Building } from "./building";

const mx = new Matrix4();

export class BuildingStore {
  private updateIndex = -1;
  private unsetIds: number[];
  private freeIds: number[] = [];

  private lastEvent = 0;

  private buildings = new Map<string | number, Building[]>();

  private get buildingList() {
    return Array.from(this.buildings.values()).flat();
  }

  constructor(
    private origin: Coords,
    private mesh: BatchedMesh,
    private maxGeometryCount: number,
    private maxVertexCount: number,
    private maxIndexCount: number,
    private map: MapboxMap,
  ) {
    this.unsetIds = Array.from({ length: this.maxGeometryCount }, (_, i) => i);

    this.updateFeatures();

    this.map.on('sourcedata', this.onEvent);
  }

  onEvent = () => {
    if(Date.now() - this.lastEvent < 1000) return;
    this.lastEvent = Date.now();
    // this.updateFeatures();
  }

  dispose() {
    this.map.off('sourcedata', this.onEvent);
  }

  private updateFeatures() {

    const features = this.map.querySourceFeatures('composite', {
      sourceLayer: 'building'
    });

    this.updateIndex++;
    const newBuildings: Building[] = [];
    for (const feature of features) {
      newBuildings.push(...this.addFeature(feature));
    }

    this.deleteOldFeatures();

    this.addFeaturesToMesh();

    console.log(`${newBuildings.length} new buildings`);
    console.log(`${this.buildingList.length} total buildings`);
    
  }

  private addFeaturesToMesh() {
    for (const building of this.buildingList) {
      if (building.geometryId !== undefined) continue;
      let id: number;
      if (this.freeIds.length > 0) {
        id = this.freeIds.shift()!;
        this.mesh.setGeometryAt(id, building.geometry);
      } else if (this.unsetIds.length > 0) {
        id = this.unsetIds.shift()!;
        const id2 = this.mesh.addGeometry(building.geometry, this.maxVertexCount, this.maxIndexCount);
        if (id !== id2) {
          console.warn('id mismatch');
        }
      } else {
        console.warn('maxGeometryCount reached');
        return;
      }
      building.geometryId = id;
      this.mesh.setMatrixAt(id, mx);

    }
  }

  private deleteOldFeatures() {

    const removedIds: number[] = [];

    // delete removed buildings
    this.buildings.forEach((buildingList, id) => {
      for (let i = 0; i < buildingList.length; i++) {
        if (buildingList[i].updateIndex === this.updateIndex) continue;
        removedIds.push(buildingList[i].geometryId!);
        buildingList.splice(i, 1);
        i--;
      }
      if (buildingList.length === 0) {
        this.buildings.delete(id);
      }
    });

    // delete removed geometries
    for (const id of removedIds) {
      this.mesh.deleteGeometry(id);
    }

    this.freeIds.push(...removedIds);
    console.log(`${removedIds.length} removed geometries`)

  }

  private addFeature(feature: MapboxGeoJSONFeature) {
    const { id } = feature;
    const newBuildings : Building[] = []
    if (id === undefined) return newBuildings;
    if (!this.buildings.has(id)) {
      this.buildings.set(id, []);
    }
    const buildings = this.buildings.get(id)!;
    const coordsList = getGeoCoords(feature);
    for (const coords of coordsList) {
      const b = this.addFeatureCoords({ feature, coords, buildings });
      if(b) newBuildings.push(b);
    }
    return newBuildings;
  }

  private addFeatureCoords({ feature, coords, buildings }: {
    feature: MapboxGeoJSONFeature;
    coords: Vector2Tuple[];
    buildings: Building[];
  }) {
    // skip duplicates
    for (const building of buildings) {
      if (dequal(building.coords[0], coords[0])) {
        building.updateIndex = this.updateIndex;
        return;
      }
    }
    const building = this.featureToBuilding({
      feature: feature,
      coords,
      updateIndex: this.updateIndex,
    });
    buildings.push(building);
    return building;
  }

  private featureToBuilding({ feature, coords, updateIndex }: {
    feature: MapboxGeoJSONFeature;
    coords: Vector2Tuple[];
    updateIndex: number;
  }) {
    const height = feature.properties?.height ?? 1;
    const polygon = this.coordsToPolygon(coords);
    const geometry = polygonToExtrudeGeo(polygon, height);
    const building: Building = {
      featureId: feature.id!,
      height,
      coords,
      polygon,
      geometry,
      vertexCount: geometry.attributes.position.count,
      indexCount: geometry.index?.count || 0,
      updateIndex,
    }
    return building;

  }

  private coordsToPolygon(coords: Vector2Tuple[]) {
    return coords.map(c => coordsToVector3({ longitude: c[0], latitude: c[1] }, this.origin));
  }

}

function getGeoCoords(feat: MapboxGeoJSONFeature) {
  let coordsList: Vector2Tuple[][] = []
  if (feat.geometry.type !== 'Polygon' && feat.geometry.type !== 'MultiPolygon') {
    return coordsList;
  };
  if (feat.geometry.type === 'Polygon') {
    coordsList = feat.geometry.coordinates as Vector2Tuple[][];
  } else { // MultiPolygon
    coordsList = feat.geometry.coordinates.flat() as Vector2Tuple[][];
  }
  return coordsList;
}

function polygonToExtrudeGeo(poly: Vector3Tuple[], height: number) {
  const shape = new Shape();
  shape.moveTo(poly[0][2], poly[0][0]);
  for (let i = 1; i < poly.length; i++) {
    shape.lineTo(poly[i][2], poly[i][0]);
  }
  shape.closePath();
  const geo = new ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
  return geo;
}