import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const libMode = parseInt(process.env.LIB_MODE!) || 0;
const isES = libMode === 1;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'react-three-map',
      formats: isES ? ['es'] : ['cjs'],
      fileName: 'index.js',
    },
    outDir: isES ? 'build/es' : 'build/cjs',
    rollupOptions: {
      output: !isES ? undefined : { sourcemap: true, preserveModules: true },
      external: [
        "@react-three/fiber",
        "maplibre-gl",
        "react",
        'react/jsx-runtime',
        "react-dom",
        "react-map-gl",
        "three",
      ]
    },
  },
})
