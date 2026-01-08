export type YMDDifference = {
    years: number;
    months: number;
    days: number;
};

export function calculateYMDDiff(from: number, to: number): YMDDifference {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    let years = toDate.getFullYear() - fromDate.getFullYear();
    let months = toDate.getMonth() - fromDate.getMonth();
    let days = toDate.getDate() - fromDate.getDate();

    if (days < 0) {
        months -= 1;
        // Vegyük az előző hónap utolsó napját
        const prevMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months, days };
}

export function calculateDayDiff(from: number, to: number): number {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    return Math.floor(
        (Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate()) -
            Date.UTC(
                fromDate.getFullYear(),
                fromDate.getMonth(),
                fromDate.getDate()
            )) /
            (1000 * 60 * 60 * 24)
    );
}
