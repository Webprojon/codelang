import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL || 'https://codelang.vercel.app';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, './src/shared'),
        '@features': path.resolve(__dirname, './src/features'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@src': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: id => {
            if (
              id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router')
            ) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/@tanstack/react-query')) {
              return 'query-vendor';
            }
            if (id.includes('node_modules/@codemirror') || id.includes('node_modules/codemirror')) {
              return 'editor-vendor';
            }
            if (id.includes('node_modules/react-icons')) {
              return 'icons-vendor';
            }
            if (
              id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/react-hot-toast')
            ) {
              return 'form-vendor';
            }
            if (
              id.includes('node_modules/axios') ||
              id.includes('node_modules/zustand') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge')
            ) {
              return 'utils-vendor';
            }
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 1000,
      minify: 'esbuild',
      sourcemap: false,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      target: 'esnext',
      commonjsOptions: {
        include: [/react-icons/, /node_modules/],
      },
    },
    optimizeDeps: {
      include: ['react-icons'],
      esbuildOptions: {
        treeShaking: true,
      },
    },
    server: {
      port: 3000,
      cors: true,
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: true,
          ws: false,
          configure: proxy => {
            proxy.on('proxyReq', (proxyReq, req) => {
              if (req.headers.cookie) {
                proxyReq.setHeader('Cookie', req.headers.cookie);
              }
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              if (process.env.NODE_ENV === 'development') {
                console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
              }
            });
            proxy.on('error', err => {
              console.error('[Proxy Error]', err.message);
            });
          },
        },
      },
    },
  };
});
