/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: { outDir: 'build' },
    server: {
        port: 3000,
        // The shared grid in the "Cells" post talks to the Worker. Run
        // `npm run worker` next to `npm start` to use it in development.
        proxy: { '/api': { target: 'http://localhost:8787', ws: true } },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/setupTests.ts',
        css: { modules: { classNameStrategy: 'non-scoped' } },
    },
})
