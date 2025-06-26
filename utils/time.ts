export const calculateTimeDifference = (dateString: string) => {
    const now = new Date();
    const targetDate = new Date(dateString);

    let years = now.getFullYear() - targetDate.getFullYear();
    let months = now.getMonth() - targetDate.getMonth();
    let days = now.getDate() - targetDate.getDate();

    if (days < 0) {
        months -= 1;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    let result = "";
    if (years > 0) {
        result += `${years}년 `;
    }
    if (months > 0) {
        result += `${months}개월 `;
    }
    if (years === 0 && months === 0 && days > 0) {
        result += `${days}일 `;
    }

    return result.trim();
};
