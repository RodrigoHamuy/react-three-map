import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MyLib',
      fileName: (format) => `my-lib.${format}.js`,
    },
    rollupOptions: {
      external: [
        "@react-three/fiber",
        "maplibre-gl",
        "react",
        "react-dom",
        "react-map-gl",
        "three",
      ]
    },
  },
})
