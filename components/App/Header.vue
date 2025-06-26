<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[][]>([
    [
        {
            label: "GitHub",
            icon: "i-simple-icons-github",
            badge: "3.8k",
            to: "https://github.com/nuxt/ui",
            target: "_blank",
        },
        {
            label: "Help",
            icon: "i-lucide-circle-help",
            disabled: true,
        },
    ],
]);
</script>

<template>
    <UNavigationMenu
        highlight
        highlight-color="primary"
        orientation="horizontal"
        :items="items"
    />
</template>
