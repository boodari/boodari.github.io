<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";
import { calculateTimeDifference } from "~/utils/time";
import { formatKoreanCurrency } from "~/utils/money";
import type { TableColumn, DropdownMenuItem } from "@nuxt/ui";
import bitcoinPrices from "/public/db/bitcoin-prices.json";

useHead({
    title: "비트코인 살껄",
    link: [
        {
            rel: "icon",
            type: "image/x-icon",
            href: "/favicon.ico",
        },
    ],
});
useSeoMeta({
    ogTitle: "10년전에 비트코인 샀다면?",
    ogDescription: "라고 할때 살껄!!",
    ogImage: `/og-image.png`,
});

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const items = ref<AccordionItem[]>([
    {
        label: "Icons",
        icon: "i-lucide-smile",
        content:
            "You have nothing to do, @nuxt/icon will handle it automatically.",
    },
    {
        label: "Colors",
        icon: "i-lucide-swatch-book",
        content:
            "Choose a primary and a neutral color from your Tailwind CSS theme.",
    },
    {
        label: "Components",
        icon: "i-lucide-box",
        content:
            "You can customize components by using the `class` / `ui` props or in your app.config.ts.",
    },
]);
const fromDateStep = ref(bitcoinPrices.length - 1);
const fromDateReverseStep = computed(
    () => bitcoinPrices.length - 1 - fromDateStep.value,
);
const timeDifference = computed(() =>
    calculateTimeDifference(bitcoinPrices[fromDateReverseStep.value].date),
);
const input = ref(0);
const rows = computed(() => {
    return bitcoinPrices
        .map((price: any) => {
            // 소수점 8자리까지 표시
            const btc = (input.value / price.krw).toFixed(8);
            return {
                date: price.date,
                krw: price.krw,
                dca: input.value,
                btc,
            };
        })
        .slice(fromDateReverseStep.value);
});

const columns: TableColumn[] = [
    {
        accessorKey: "date",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();

            return h(UButton, {
                color: "neutral",
                variant: "ghost",
                label: "날짜",
                icon: isSorted
                    ? isSorted === "asc"
                        ? "i-lucide-arrow-up-narrow-wide"
                        : "i-lucide-arrow-down-wide-narrow"
                    : "i-lucide-arrow-up-down",
                class: "-mx-2.5",
                onClick: () =>
                    column.toggleSorting(column.getIsSorted() === "asc"),
            });
        },
        cell: ({ row }) =>
            `${row.getValue("date").slice(2, 7).replace("-", "년 ")}월`,
    },
    {
        accessorKey: "krw",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();

            return h(UButton, {
                color: "neutral",
                variant: "ghost",
                label: "비트코인 1개 가격(KRW)",
                icon: isSorted
                    ? isSorted === "asc"
                        ? "i-lucide-arrow-up-narrow-wide"
                        : "i-lucide-arrow-down-wide-narrow"
                    : "i-lucide-arrow-up-down",
                class: "-mx-2.5",
                onClick: () =>
                    column.toggleSorting(column.getIsSorted() === "asc"),
            });
        },
        cell: ({ row }) => `￦${row.getValue("krw").toLocaleString()}`,
    },
    {
        accessorKey: "btc",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();

            return h(UButton, {
                color: "neutral",
                variant: "ghost",
                label: "수량(BTC)",
                icon: isSorted
                    ? isSorted === "asc"
                        ? "i-lucide-arrow-up-narrow-wide"
                        : "i-lucide-arrow-down-wide-narrow"
                    : "i-lucide-arrow-up-down",
                class: "-mx-2.5",
                onClick: () =>
                    column.toggleSorting(column.getIsSorted() === "asc"),
            });
        },
        cell: ({ row }) => `₿${row.getValue("btc").toLocaleString()}`,
    },
    {
        accessorKey: "dca",
        header: "투자금액",
        cell: ({ row }) => `￦${row.getValue("dca").toLocaleString()}`,
    },
];
const totalBtc = computed(() => {
    return rows.value
        .reduce((acc: any, row: any) => acc + Number(row.btc), 0)
        .toFixed(8);
});
const nowBitcoinPrice = ref(bitcoinPrices[bitcoinPrices.length - 1].krw);

const sorting = ref([
    {
        id: "date",
        desc: false,
    },
    {
        id: "krw",
        desc: false,
    },
    {
        id: "btc",
        desc: false,
    },
]);
onMounted(async () => {
    const res = await fetch(
        "https://min-api.cryptocompare.com/data/pricehistorical?fsym=BTC&tsyms=KRW",
    );
    nowBitcoinPrice.value = await res.json().then((data) => data.BTC.KRW);
});
</script>

<template>
    <Parrot :message="`${timeDifference}전에 살껄!!`" />
    <UFormField
        label="이 때 부터 살껄"
        class="mb-5"
        :hint="`${timeDifference} 전(${bitcoinPrices[fromDateReverseStep].date}) 부터 살껄`"
    >
        <USlider
            v-model="fromDateStep"
            size="xl"
            :min="0"
            :max="bitcoinPrices.length - 1"
        />
    </UFormField>

    <UFormField
        label="매달 얼마씩 살껄"
        :help="`${rows.length}개월간 매달 ${formatKoreanCurrency(input)}원씩 샀다면 총 ${formatKoreanCurrency(input * rows.length)}`"
        class="mb-5"
    >
        <UButtonGroup orientation="horizontal" class="mb-3">
            <UButton
                color="neutral"
                variant="outline"
                label="+1만원"
                @click="input += 10000"
            />
            <UButton
                color="neutral"
                variant="outline"
                label="+10만원"
                @click="input += 100000"
            />
            <UButton
                color="neutral"
                variant="outline"
                label="+100만원"
                @click="input += 1000000"
            />
            <UButton
                color="neutral"
                variant="subtle"
                label="초기화"
                @click="input = 0"
            />
        </UButtonGroup>
        <br />
        <UInput v-model="input" type="number">
            <template #trailing>
                <span class="text-xs text-gray-500 dark:text-gray-400">￦</span>
            </template>
        </UInput>
    </UFormField>
    <div
        v-if="input > 0"
        class="text-sm text-gray-500 dark:text-gray-400 mb-3 text-left"
    >
        그렇게 샀다면 비트코인 ₿{{ totalBtc }}개 보유 (현재가 약 ￦{{
            formatKoreanCurrency(totalBtc * nowBitcoinPrice)
        }})
    </div>
    <UTable
        v-if="input > 0"
        v-model:sorting="sorting"
        :columns="columns"
        :data="rows"
        class="mb-5 px-3 mx-auto"
    >
    </UTable>
    <div v-else style="height: 300px" />
</template>
