import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwind()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    server: {
        port: 3000
    }
})