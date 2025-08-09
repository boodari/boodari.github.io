export const formatKoreanCurrency = (amount: number) => {
    const units = ["조", "억", "만"];
    const unitValues = [1e12, 1e8, 1e4];
    let result = "";

    for (let i = 0; i < units.length; i++) {
        const unitValue = unitValues[i];
        if (amount >= unitValue) {
            const unitAmount = Math.floor(amount / unitValue);
            result += `${unitAmount}${units[i]} `;
            amount %= unitValue;
        }
    }

    return result.trim() || "0";
};
