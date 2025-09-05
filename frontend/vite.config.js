import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174, // 👈 Change port here
    allowedHosts: [
      'agentsuit.itrix.biz',  // ✅ Add your main domain
      'api.agentsuit.itrix.biz' // ✅ Add your API subdomain if needed
    ]
  },
})
