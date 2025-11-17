import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        register: resolve(__dirname, "register.html"),
        dashboardMining: resolve(__dirname, "dashboardMining.html"),
        dashboardShipping: resolve(__dirname, "dashboardShipping.html"),
      },
    },
  },
});
