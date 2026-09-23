const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

// 'YYYY-MM' gives "April 2026", 'YYYY-MM-DD' gives "14 Aug 2022".
export function formatDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-').map(Number)
    const monthName = MONTHS[month - 1]
    return day
        ? `${day} ${monthName.slice(0, 3)} ${year}`
        : `${monthName} ${year}`
}

export function readTime(body: string): string {
    const wpm = 200
    const words = body.trim().split(/\s+/).length
    const time = Math.ceil(words / wpm)
    return time <= 1 ? '1 minute' : time + ' minutes'
}
