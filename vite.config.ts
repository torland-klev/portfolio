/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    // Keep the CRA env prefix so the existing EmailJS variables still work.
    envPrefix: ['VITE_', 'REACT_APP_'],
    build: { outDir: 'build' },
    server: { port: 3000 },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/setupTests.ts',
        css: { modules: { classNameStrategy: 'non-scoped' } },
    },
})
