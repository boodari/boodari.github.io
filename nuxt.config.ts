import packageJson from "./package.json";

export default defineNuxtConfig({
    compatibilityVersion: 4,
    compatibilityDate: "2025-05-15",
    future: {
        compatibilityVersion: 4,
    },
    runtimeConfig: {
        public: {
            version: packageJson.version,
            siteUrl: "https://boodari.github.io", // 기본 URL 설정
        },
    },
    devtools: { enabled: false },
    css: ["~/assets/css/main.css"],
    modules: ["@nuxt/ui", "nuxt-gtag"],
    gtag: {
        id: "G-JTXWC4B59H",
    },
});
