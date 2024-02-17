import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

/** 0: no lib mode, 1: ES, 2: cjs */
const libMode = parseInt(process.env.LIB_MODE!) || 0;

/** 0: MapLibre, 1: MapBox */
const mapProvider = parseInt(process.env.MAP_MODE!) || 0;

const isES = libMode === 1;

const isMaplibre = mapProvider === 0;

const entry = `src/${isMaplibre ? 'maplibre' : 'mapbox'}.index.ts`;

let outDir = isMaplibre ? 'dist/maplibre' : 'dist';

outDir = `${outDir}/${isES ? 'es' : 'cjs'}`;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  ...(!libMode
    // story mode
    ? {
      base: '',
      resolve: {
        alias: {
          'react-three-map/maplibre': resolve(__dirname, './src/maplibre.index.ts'),
          'react-three-map': resolve(__dirname, './src/mapbox.index.ts'),
        }
      }
    }
    // lib mode
    : {
      publicDir: false,
      build: {
        minify: false,
        lib: {
          entry,
          name: 'react-three-map',
          formats: isES ? ['es'] : ['cjs'],
          fileName: 'main',
        },
        outDir,
        rollupOptions: {
          output: !isES ? undefined : { sourcemap: true, preserveModules: true },
          external: [
            "@react-three/fiber",
            "maplibre-gl",
            "mapbox-gl",
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
