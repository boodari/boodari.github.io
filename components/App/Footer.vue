<template>
    <USeparator />
    <div
        class="flex justify-center items-center h-32 bg-gray-100 dark:bg-gray-800 flex-col"
    >
        <a
            href="https://x.com/boom30908979489"
            class="text-gray-900 dark:text-gray-100 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >by. 부달이</a
        >

        <br />

        <small class="text-gray-900 dark:text-gray-100">
            v{{ useRuntimeConfig().public.version }}
        </small>
    </div>
</template>
