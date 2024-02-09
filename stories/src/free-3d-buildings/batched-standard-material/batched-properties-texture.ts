import { DataTexture, FloatType, RGBAFormat } from "three"

export class BatchedPropertiesTexture extends DataTexture {
  
  private fields: {
    type: string;
    subtype: string;
    dim: number;
    comp: string | undefined;
    name: string
  }[]

  private fieldToIndex: Record<string, number>;

  constructor(params: Record<string, string>, count: number) {
    const fields = Object.entries(params)
      .map(([name, type]) => ({
        name,
        ...parseToInfo(type)
      }))
      .sort((a, b) => {
        return a.dim - b.dim
      })
    const width = fields.length
    let size = Math.sqrt(count * width)
    size = Math.ceil(size / width) * width
    size = Math.max(size, width)
    const fieldToIndex : Record<string, number> = {}
    for (let i = 0, l = fields.length; i < l; i++) {
      fieldToIndex[fields[i].name] = i
    }
    super(new Float32Array(size * size * 4), size, size, RGBAFormat, FloatType)
    this.fields = fields
    this.fieldToIndex = fieldToIndex
  }

  setValue(id: number, name: string, ...values: number[]) {
    const { fields, fieldToIndex, image } = this
    const width = fields.length
    if (!(name in fieldToIndex)) return
    const fieldId = fieldToIndex[name]
    const field = fields[fieldId]
    const dim = field.dim
    const data = image.data
    const offset = id * width * 4 + fieldId * 4
    for (let i = 0; i < dim; i++) data[offset + i] = values[i] || 0
    this.needsUpdate = true
  }

  getGlsl(idField = 'vBatchId', textureName = 'propertiesTex', indent = '') {
    const { fields, image } = this
    const size = image.width
    const width = fields.length
    let result =
      `${indent}int size = ${size};\n` +
      `${indent}int j = int( ${idField} ) * ${width};\n` +
      `${indent}int x = j % size;\n` +
      `${indent}int y = j / size;\n`
    for (let i = 0, l = fields.length; i < l; i++) {
      const { name, type, comp } = fields[i]
      result += `${indent}${type} ${name} = ${type}( texelFetch( ${textureName}, ivec2( x + ${i}, y ), 0 ).${comp} );\n`
    }
    return result
  }
}

function parseToInfo(type: string) {
  let subtype = type
  const dim = parseFloat(type.replace(/[^1-3]/g, '')) || 1
  if (/$vec/.test(type)) subtype = 'float'
  if (/$uvec/.test(type)) subtype = 'uint'
  if (/$ivec/.test(type)) subtype = 'int'

  let comp
  switch (dim) {
    case 1:
      comp = 'r'
      break
    case 2:
      comp = 'rg'
      break
    case 3:
      comp = 'rgb'
      break
    case 4:
      comp = 'rgba'
      break
  }

  return { type, subtype, dim, comp }
}