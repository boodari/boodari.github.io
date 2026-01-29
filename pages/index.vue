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
    ogImage: `${useRuntimeConfig().public.siteUrl}/og-image.png`,
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

// 현재 채굴된 비트코인 총량 (2024년 기준 약 1,970만 BTC)
const MAX_BITCOIN_SUPPLY = 19700000;

// 각 월별 커스텀 투자금액 저장 (date를 key로 사용)
const customInvestments = ref<Record<string, number>>({});

const rows = computed(() => {
    return bitcoinPrices
        .map((price: any) => {
            // 커스텀 투자금액이 있으면 사용, 없으면 기본 input 값 사용
            const investmentAmount = customInvestments.value[price.date] ?? input.value;
            
            // 가격이 0인 경우는 거래 불가능으로 간주하여 0 반환
            if (price.krw === 0) {
                return {
                    date: price.date,
                    krw: price.krw,
                    dca: investmentAmount,
                    btc: 0,
                };
            }
            // 소수점 8자리까지 표시
            const btc = (investmentAmount / price.krw).toFixed(8);
            return {
                date: price.date,
                krw: price.krw,
                dca: investmentAmount,
                btc,
            };
        })
        .slice(fromDateReverseStep.value);
});

// 투자금액 업데이트 함수
const updateInvestment = (date: string, value: number) => {
    customInvestments.value[date] = value;
};

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
                label: "BTC 가격",
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
        cell: ({ row }) => {
            const value = row.getValue("krw");
            const formatted = value.toLocaleString();
            // 억 단위 표시
            if (value >= 100000000) {
                const eok = Math.floor(value / 100000000);
                const man = Math.floor((value % 100000000) / 10000);
                return man > 0 ? `${eok}억 ${man}만원` : `${eok}억원`;
            } else if (value >= 10000) {
                const man = Math.floor(value / 10000);
                return `${man}만원`;
            }
            return `${formatted}원`;
        },
    },
    {
        accessorKey: "dca",
        header: "매달 투자",
        cell: ({ row }) => {
            const rowData = row.original;
            return h('div', { class: 'flex items-center gap-2' }, [
                h('input', {
                    type: 'number',
                    value: rowData.dca,
                    class: 'w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500',
                    onInput: (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        const value = parseInt(target.value) || 0;
                        updateInvestment(rowData.date, value);
                    }
                }),
                h('span', { class: 'text-xs text-gray-500 dark:text-gray-400' }, '원')
            ]);
        },
    },
    {
        accessorKey: "btc",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();

            return h(UButton, {
                color: "neutral",
                variant: "ghost",
                label: "구매량",
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
        cell: ({ row }) => `${parseFloat(row.getValue("btc")).toFixed(6)} BTC`,
    },
];
const totalBtc = computed(() => {
    const total = rows.value
        .reduce((acc: any, row: any) => acc + Number(row.btc), 0);
    
    // 현재 채굴된 비트코인 총량을 초과할 수 없음
    return Math.min(total, MAX_BITCOIN_SUPPLY).toFixed(8);
});
const nowBitcoinPrice = ref(bitcoinPrices[bitcoinPrices.length - 1].krw);

// 실제 투자 가능한 개월 수 (가격이 0이 아닌 월만 카운트)
const validMonths = computed(() => rows.value.filter(row => row.krw > 0).length);
const totalInvestment = computed(() => {
    return rows.value
        .filter(row => row.krw > 0)
        .reduce((acc, row) => acc + row.dca, 0);
});

const currentValue = computed(() => totalBtc.value * nowBitcoinPrice.value);
const profit = computed(() => currentValue.value - totalInvestment.value);
const profitRate = computed(() => totalInvestment.value > 0 ? ((profit.value / totalInvestment.value) * 100).toFixed(2) : 0);

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
        label="📅 언제부터 투자할껄?"
        class="mb-8"
        :hint="`${timeDifference} 전 (${bitcoinPrices[fromDateReverseStep].date.slice(0, 7)})`"
    >
        <USlider
            v-model="fromDateStep"
            size="xl"
            :min="0"
            :max="bitcoinPrices.length - 1"
        />
    </UFormField>

    <UFormField
        label="💰 매달 얼마씩 투자할껄?"
        class="mb-8"
        help="기본 금액을 설정하고, 테이블에서 각 월별로 개별 수정도 가능합니다"
    >
        <UButtonGroup orientation="horizontal" class="mb-3 flex-wrap gap-2">
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
                @click="() => { input = 0; customInvestments = {}; }"
            />
            <UButton
                v-if="input > 0"
                color="primary"
                variant="outline"
                label="전체 적용"
                @click="() => { customInvestments = {}; }"
            />
        </UButtonGroup>
        <br />
        <UInput v-model="input" type="number" size="xl" placeholder="금액을 입력하세요">
            <template #trailing>
                <span class="text-xs text-gray-500 dark:text-gray-400">원</span>
            </template>
        </UInput>
    </UFormField>

    <!-- 결과 요약 카드 -->
    <div v-if="input > 0" class="mb-8">
        <UCard>
            <template #header>
                <h3 class="text-lg font-semibold">💸 투자 결과</h3>
            </template>
            
            <div class="space-y-4">
                <!-- 투자 기간 및 금액 -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">투자 기간</div>
                        <div class="text-2xl font-bold">
                            <template v-if="validMonths >= 12">
                                {{ Math.floor(validMonths / 12) }}년 {{ validMonths % 12 }}개월
                            </template>
                            <template v-else>
                                {{ validMonths }}개월
                            </template>
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            (전체 {{ rows.length }}개월 중)
                        </div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">총 투자금</div>
                        <div class="text-2xl font-bold">{{ formatKoreanCurrency(totalInvestment) }}원</div>
                    </div>
                </div>

                <!-- 보유 현황 -->
                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">보유 비트코인</div>
                    <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {{ parseFloat(totalBtc).toFixed(6) }} BTC
                    </div>
                </div>

                <!-- 현재 평가액 -->
                <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">현재 평가액</div>
                    <div class="text-3xl font-bold text-green-600 dark:text-green-400">
                        {{ formatKoreanCurrency(currentValue) }}원
                    </div>
                </div>

                <!-- 수익률 -->
                <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                    <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">총 수익금</div>
                    <div class="text-3xl font-bold" :class="profit >= 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'">
                        {{ profit >= 0 ? '+' : '' }}{{ formatKoreanCurrency(profit) }}원
                    </div>
                    <div class="text-lg font-semibold mt-1" :class="profit >= 0 ? 'text-red-500 dark:text-red-300' : 'text-blue-500 dark:text-blue-300'">
                        ({{ profit >= 0 ? '+' : '' }}{{ profitRate }}%)
                    </div>
                </div>
            </div>
        </UCard>
    </div>

    <!-- 테이블 -->
    <div v-if="input > 0" class="mb-8">
        <h3 class="text-lg font-semibold mb-4">📊 월별 투자 내역</h3>
        <div class="space-y-2 mb-3">
            <div v-if="rows.filter(row => row.krw === 0).length > 0" class="text-sm text-gray-500 dark:text-gray-400">
                💡 거래소가 없던 {{ rows.filter(row => row.krw === 0).length }}개월은 투자 불가능으로 제외됩니다
            </div>
            <div class="text-sm text-blue-600 dark:text-blue-400">
                ✏️ '매달 투자' 열의 금액을 클릭하여 각 월별로 다른 금액을 설정할 수 있습니다
            </div>
        </div>
        <UTable
            v-model:sorting="sorting"
            :columns="columns"
            :data="rows.filter(row => row.krw > 0)"
            class="rounded-lg overflow-hidden"
        />
    </div>
    
    <div v-else class="text-center py-20 text-gray-400">
        <p class="text-lg">💡 금액을 입력하면 결과를 확인할 수 있어요</p>
    </div>
</template>
