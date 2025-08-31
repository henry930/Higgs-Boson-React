import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH || '/',
    server: {
      port: parseInt(process.env.VITE_PORT || '5174'),
      host: true,
      proxy: {
        '/api': {
          target: 'https://yp5h5o5ma4.execute-api.us-east-1.amazonaws.com/prod',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    // @ts-ignore - vitest config
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true
    }
  }
})
