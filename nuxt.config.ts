import packageJson from "./package.json";

export default defineNuxtConfig({
    compatibilityDate: "2025-05-15",
    runtimeConfig: {
        public: {
            version: packageJson.version,
            siteUrl: "https://boodari.github.io", // 기본 URL 설정
        },
    },
    devtools: { enabled: false },
    css: ["~/assets/css/main.css"],
    modules: ["@nuxt/ui"],
});
