import { dequal } from 'dequal';
import { MapboxGeoJSONFeature, Map as MapboxMap } from "mapbox-gl";
import { Coords } from "react-three-map";
import { BatchedMesh, Vector2Tuple } from "three";
import { BatchedStandardMaterial } from './batched-standard-material/batched-standard-material';
import { Building } from "./building";

export class BuildingStore {
  private updateIndex = -1;
  private unsetIds: number[];
  private freeIds: number[] = [];

  private lastEvent = 0;

  private buildings = new Map<string | number, Building[]>();
  private material: BatchedStandardMaterial;

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
    this.material = mesh.material as BatchedStandardMaterial;
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
      sourceLayer: 'building',
      filter: [
        "all",
        // ["!=", ["get", "type"], "building"],
        ["!=", ["get", "type"], "building:part"],
        ["==", ["get", "underground"], "false"],
      ]
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
      if (building.geometryId !== -1) continue;
      let i: number;
      if (this.freeIds.length > 0) {
        i = this.freeIds.shift()!;
        building.setGeometryAt({ mesh: this.mesh, material: this.material, i });
      } else if (this.unsetIds.length > 0) {
        i = this.unsetIds.shift()!;
        building.addGeometry({
          mesh: this.mesh, material: this.material, i,
          maxVertexCount: this.maxVertexCount, maxIndexCount: this.maxIndexCount
        });
      } else {
        console.warn('maxGeometryCount reached');
        return;
      }

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
    console.log(feature.type);
    
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
    const building = new Building({
      feature,
      coords,
      updateIndex,
      origin: this.origin,
    });
    return building;

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