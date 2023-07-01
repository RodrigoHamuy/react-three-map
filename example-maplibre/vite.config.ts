import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { lstatSync } from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  ...(
    lstatSync('node_modules/react-three-map').isSymbolicLink()
      ? { optimizeDeps: { exclude: ['react-three-map'] } }
      : {}
  )
})
