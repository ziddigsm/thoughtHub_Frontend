import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/summarize': {
        target: 'https://l6x2w6z15c.execute-api.us-east-2.amazonaws.com/default',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/summarize/, '/summarize')
      }
    }
  }
})
