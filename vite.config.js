import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: '.',
        rollupOptions: {
            input: './_js/script.js',
            output: {
                entryFileNames: 'chefcookie.min.js',
                format: 'iife',
                inlineDynamicImports: true
            }
        },
        sourcemap: true,
        minify: false,
        emptyOutDir: false
    }
});
