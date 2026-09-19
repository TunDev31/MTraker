import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: true // Cho phép tất cả các domain như ngrok truy cập
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 2. Thêm dòng này
      
    },
  },
})
