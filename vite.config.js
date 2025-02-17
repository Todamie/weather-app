import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/App.css', 'resources/js/main.jsx'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '192.168.17.37',
        port: 5173,
        // proxy: {
        //     '/api': {
        //         target: 'http://192.168.17.37:8000',
        //         changeOrigin: true,
        //         secure: false
        //     }
        // }
    },
});
