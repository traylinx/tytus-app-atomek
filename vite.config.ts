import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.tsx',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        '@tytus/host-api',
      ],
      output: {
        preserveModules: false,
        entryFileNames: 'index.js',
        chunkFileNames: '[name]-[hash].js',
      },
    },
    target: 'es2022',
    minify: 'esbuild',
    sourcemap: true,
    emptyOutDir: true,
  },
});
