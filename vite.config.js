import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/pages/index.html'),
                cars: resolve(__dirname, 'src/pages/cars.html'),
                details: resolve(__dirname, 'src/pages/details.html'),
                favorites: resolve(__dirname, 'src/pages/favorites.html'),
                compare: resolve(__dirname, 'src/pages/compare.html'),
            },
        },
    },
    server: {
        open: '/src/pages/index.html',
    }
});
