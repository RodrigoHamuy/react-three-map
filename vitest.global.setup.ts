Object.assign(global.URL, {
  createObjectURL: (buffer) => (
    new Blob([buffer.toString('binary')], { type: 'application/octet-stream' })
  )
})

export default undefined;