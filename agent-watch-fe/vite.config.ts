import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()], // ✅ Not tailwind here!
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/libs/components"),
      "@utils": path.resolve(__dirname, "src/libs/utils"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
})
