import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import {resolve} from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-three-map/maplibre': resolve(__dirname, '../src/maplibre.index.ts'),
      'react-three-map': resolve(__dirname, '../src/mapbox.index.ts'),
    }
  },
  optimizeDeps: {
    exclude: ['react-three-map']
  }
})
