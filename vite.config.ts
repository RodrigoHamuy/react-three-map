import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** 0: no lib mode, 1: ES, 2: cjs */
const libMode = parseInt(process.env.LIB_MODE!) || 0;

/** 0: MapLibre, 1: MapBox */
const mapProvider = parseInt(process.env.MAP_MODE!) || 0;

const isES = libMode === 1;

const isMaplibre = mapProvider === 0;

const entry = `src/main-${isMaplibre ? 'maplibre' : 'mapbox' }.ts`;

let outDir = isMaplibre ? 'dist/maplibre' : 'dist';

outDir = `${outDir}/${isES ? 'es' : 'cjs'}`;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  ...(!libMode
    ? {
      base: '',
    }
    : {
      build: {
        lib: {
          entry,
          name: 'react-three-map',
          formats: isES ? ['es'] : ['cjs'],
          fileName: 'main.js',
        },
        outDir,
        rollupOptions: {
          output: !isES ? undefined : { sourcemap: true, preserveModules: true },
          external: [
            "@react-three/fiber",
            "maplibre-gl",
            "react",
            'react/jsx-runtime',
            "react-dom",
            "react-map-gl",
            "react-map-gl/maplibre",
            "three",
          ]
        },
      },

    })
})
