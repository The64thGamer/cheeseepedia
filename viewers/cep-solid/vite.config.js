import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
  outDir: path.resolve(__dirname, '.'),  
  emptyOutDir: false,                  
  lib: {
    entry: path.resolve(__dirname, 'index.jsx'),
    formats: ['es'],
    fileName: () => 'default.js',
  },
},
});
