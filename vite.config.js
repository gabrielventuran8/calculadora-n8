import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['calc.n8inc.com.br']
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['calc.n8inc.com.br']
  },
})
