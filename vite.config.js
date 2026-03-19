import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: { host: true },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin.html")
      }
    }
  }
});
