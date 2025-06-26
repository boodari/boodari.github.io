import packageJson from "./package.json";

export default defineNuxtConfig({
    compatibilityDate: "2025-05-15",
    runtimeConfig: {
        public: {
            version: packageJson.version,
        },
    },
    devtools: { enabled: false },
    css: ["~/assets/css/main.css"],
    ssr: false,
    modules: ["@nuxt/ui"],
});
