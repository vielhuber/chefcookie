import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
    if (mode === 'package') {
        return {
            build: {
                outDir: '_build',
                lib: {
                    entry: './_js/script.js',
                    formats: ['cjs'],
                    fileName: () => 'script.js'
                },
                rollupOptions: {
                    output: {
                        exports: 'named'
                    }
                },
                sourcemap: false,
                minify: false,
                emptyOutDir: true
            }
        };
    }

    return {
        build: {
            outDir: '.',
            rollupOptions: {
                input: './_js/script.js',
                output: {
                    entryFileNames: 'chefcookie.min.js',
                    format: 'iife'
                }
            },
            sourcemap: true,
            minify: false,
            emptyOutDir: false
        }
    };
});
