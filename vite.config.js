import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd())
  const summarizeApi = env.VITE_SUMMARIZE_API?.replace(/\/$/, '')
  console.log('VITE_SUMMARIZE_API from .env:', env.VITE_SUMMARIZE_API)

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api/summarize': {
          target: summarizeApi,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/summarize/, '/summarize')
        }
      }
    }
  }
})
