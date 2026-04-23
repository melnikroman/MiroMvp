import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import checker from "vite-plugin-checker"

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 9999
  },
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: "eslint ./src --ext .ts,.tsx"
      }
    })
  ]
})
