import { MeshStandardMaterial } from "three"
import { BatchedPropertiesTexture } from "./batched-properties-texture"

// source: https://twitter.com/0xca0a/status/1734157969678278673

const properties = {
  diffuse: 'vec3',
  emissive: 'vec3',
  metalness: 'float',
  roughness: 'float'
}

export class BatchedStandardMaterial extends MeshStandardMaterial {

  private propertiesTex: BatchedPropertiesTexture

  constructor(geometryCount: number) {
    super()

    this.propertiesTex = new BatchedPropertiesTexture(properties, geometryCount)

    this.onBeforeCompile = (parameters) => {

      if (Object.keys(properties).length === 0) return

      parameters.uniforms.propertiesTex = { value: this.propertiesTex }
      parameters.vertexShader = parameters.vertexShader.replace(
        'void main() {',
        `varying float vBatchId;
         void main() {
           vBatchId = batchId + 0.5;`
      )

      parameters.fragmentShader = parameters.fragmentShader.replace(
        'void main() {',
        `uniform highp sampler2D propertiesTex;
         varying float vBatchId;
         void main() {
           ${this.propertiesTex.getGlsl()}`
      )
      
    }
  }

  setValue(id: number, name: string, ...args: any[]) { // eslint-disable-line @typescript-eslint/no-explicit-any
    this.propertiesTex.setValue(id, name, ...args)
  }

  dispose() {
    super.dispose()
    this.propertiesTex?.dispose()
  }
}