import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
    if (command === 'serve') {
        return {};
    }

    if (mode === 'package') {
        return {
            build: {
                outDir: '_build',
                lib: {
                    entry: './_js/script.js',
                    formats: ['es', 'cjs'],
                    fileName: format => (format === 'es' ? 'script.mjs' : 'script.js')
                },
                rolldownOptions: {
                    output: {
                        exports: 'default'
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
            rolldownOptions: {
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
