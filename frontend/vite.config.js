import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function bypassSpa(req) {
  if (req.method === 'GET' && req.headers.accept && req.headers.accept.includes('text/html')) {
    return '/index.html';
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/usuario': { target: 'http://127.0.0.1:3000', bypass: bypassSpa },
      '/usuarios': { target: 'http://127.0.0.1:3000', bypass: bypassSpa },
      '/admin': { target: 'http://127.0.0.1:3000', bypass: bypassSpa },
      '/exercicios': { target: 'http://127.0.0.1:3000', bypass: bypassSpa },
      '/lista': { target: 'http://127.0.0.1:3000', bypass: bypassSpa },
      '/listas': { target: 'http://127.0.0.1:3000', bypass: bypassSpa },
      '/ExerciciosGif': 'http://127.0.0.1:3000'
    }
  }
});
