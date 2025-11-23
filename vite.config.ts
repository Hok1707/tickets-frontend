import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            }
        }
      },
      plugins: [
        react(),
        tailwindcss(),
      ],
      define: {
        'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
        'process.env.VITE_PORT': JSON.stringify(env.VITE_PORT)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
