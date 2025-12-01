import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    video: true,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false,

    setupNodeEvents(on, config) {
      // Você pode adicionar plugins aqui se quiser no futuro
    }
  }
});
