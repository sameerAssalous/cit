import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/react-app/main.tsx'],
            refresh: true,
        }),
        react()
    ],
    resolve: {
        alias: {
            '@': '/resources/js/react-app',
        },
    },
});