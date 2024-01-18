import { MapboxGeoJSONFeature } from "mapbox-gl";
import { Coords, coordsToVector3 } from "react-three-map";
import { BatchedMesh, Color, ExtrudeGeometry, Matrix4, Shape, Vector2Tuple, Vector3Tuple } from "three";
import { BatchedStandardMaterial } from "./batched-standard-material/batched-standard-material";

const mx = new Matrix4()
const color = new Color();

/** 3D building data */
export class Building {

  // feature
  
  // private featureId: string|number;
  private height: number;
  coords: Vector2Tuple[];

  /** Used to determine when the building was set */
  updateIndex: number;
  
  // geometry
  
  geometryId = -1
  private polygon: Vector3Tuple[];
  private geometry: ExtrudeGeometry;
  // private vertexCount: number;
  // private indexCount: number;

  // material

  private c0: Color;
  private c1: Color;
  private emissiveIntensity: number;
  private roughness: number;
  private metalness: number;
  private offset: number;
  private speed: number;
  private value = 0;

  constructor({ feature, coords, updateIndex, origin }: {
    feature: MapboxGeoJSONFeature;
    coords: Vector2Tuple[];
    updateIndex: number;
    origin: Coords;
  }) {
    // this.featureId = feature.id!;
    this.updateIndex = updateIndex;
    this.height = feature.properties?.height ?? 1;
    this.coords = coords;
    this.polygon = coords.map(c => coordsToVector3({ longitude: c[0], latitude: c[1] }, origin));
    this.geometry = polygonToExtrudeGeo(this.polygon, this.height);
    // this.vertexCount = this.geometry.attributes.position.count;
    // this.indexCount = this.geometry.index?.count || 0;
    this.c0 = new Color().setHSL(rand(0, 0.05), rand(1, 1), rand(0.5, 0.7));
    this.c1 = new Color().setHSL(rand(0.5, 0.55), rand(1, 1), rand(0.5, 0.7));
    this.emissiveIntensity = rand(0, 1) < 0.05 ? 3.5 : 0;
    this.roughness = rand(0, 0.5);
    this.metalness = 0 //rand(0, 1);
    this.offset = rand(0, 2 * Math.PI);
    this.speed = rand(1, 3);
  }

  addGeometry({ mesh, material, i, maxVertexCount, maxIndexCount }: {
    mesh: BatchedMesh;
    material: BatchedStandardMaterial;
    i: number;
    maxVertexCount: number;
    maxIndexCount: number;
  }) {
    const i2 = mesh.addGeometry(this.geometry, maxVertexCount, maxIndexCount);
    if(i2 !== i) throw new Error('id mismatch');
    this.geometryId = i;
    this.setGeometry(mesh, material);
  }

  setGeometryAt({ mesh, material, i } : {
    mesh: BatchedMesh;
    material: BatchedStandardMaterial;
    i: number;
  }){
    this.geometryId = i;
    mesh.setGeometryAt(i, this.geometry);
    this.setGeometry(mesh, material);

  }

  private setGeometry(mesh: BatchedMesh, material: BatchedStandardMaterial) {
    mesh.setMatrixAt(this.geometryId, mx);
    this.setMaterial(material);
  }

  private setMaterial(material: BatchedStandardMaterial) {
    const delta = 0;
    color.lerpColors(this.c0, this.c1, 0.5 + 0.5 * Math.sin(this.offset + (this.value += delta * 2 * this.speed)))
    material.setValue(this.geometryId, 'diffuse', ...color);
    material.setValue(this.geometryId, 'roughness', this.roughness);
    material.setValue(this.geometryId, 'metalness', this.metalness);
    color.multiplyScalar(this.emissiveIntensity);
    material.setValue(this.geometryId, 'emissive', [color.r, color.g, color.b]);
    material.setValue(this.geometryId, 'emissiveIntensity', this.emissiveIntensity);
  }
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

function rand(min: number, max: number) {
  const delta = max - min
  return min + Math.random() * delta
}