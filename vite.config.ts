import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh'
import replace from '@rollup/plugin-replace'
import svgrPlugin from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'build',
  },
  define: {
    "global": {},
  },
  server: {
    proxy: {
      '/config': { target: 'http://localhost:2337', changeOrigin: true, secure: false },
      '/api': { target: 'http://localhost:2337', changeOrigin: true, secure: false },
    }
  },
  plugins: [
    replace({
        'process.env': 'import.meta.env',
        'process.platform': 'import.meta.platform',
      }),
    react(),
    reactRefresh(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
  ],
  base: './',
})