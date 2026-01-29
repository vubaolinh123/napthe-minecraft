import { format, parseISO, isWithinInterval, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Transaction, PaymentType } from '@/types';

/**
 * Format currency to Vietnamese Dong
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Format date to Vietnamese locale
 */
export function formatDate(dateString: string, formatStr: string = 'dd/MM/yyyy'): string {
    return format(parseISO(dateString), formatStr, { locale: vi });
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string): string {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
}

/**
 * Get payment type label in Vietnamese
 */
export function getPaymentTypeLabel(type: PaymentType): string {
    const labels: Record<PaymentType, string> = {
        phone_card: 'Thẻ điện thoại',
        game_card: 'Thẻ game',
        bank_transfer: 'Ngân hàng',
    };
    return labels[type];
}

/**
 * Get status label in Vietnamese
 */
export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        success: 'Thành công',
        pending: 'Đang xử lý',
        failed: 'Thất bại',
    };
    return labels[status] || status;
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        success: 'text-green-400 bg-green-400/10',
        pending: 'text-yellow-400 bg-yellow-400/10',
        failed: 'text-red-400 bg-red-400/10',
    };
    return colors[status] || 'text-gray-400 bg-gray-400/10';
}

/**
 * Get payment type icon color
 */
export function getPaymentTypeColor(type: PaymentType): string {
    const colors: Record<PaymentType, string> = {
        phone_card: 'text-blue-400',
        game_card: 'text-purple-400',
        bank_transfer: 'text-emerald-400',
    };
    return colors[type];
}

/**
 * Filter transactions by date range
 */
export function filterByDateRange(
    transactions: Transaction[],
    startDate: Date | null,
    endDate: Date | null
): Transaction[] {
    if (!startDate || !endDate) return transactions;

    return transactions.filter((tx) => {
        const txDate = parseISO(tx.createdAt);
        return isWithinInterval(txDate, {
            start: startOfDay(startDate),
            end: endOfDay(endDate),
        });
    });
}

/**
 * Calculate profit margin (assuming 15% for cards, 5% for bank)
 */
export function calculateProfit(amount: number, type: PaymentType): number {
    const margins: Record<PaymentType, number> = {
        phone_card: 0.15,
        game_card: 0.12,
        bank_transfer: 0.05,
    };
    return Math.round(amount * margins[type]);
}

/**
 * Get date range presets
 */
export function getDateRangePreset(preset: string): { start: Date; end: Date } {
    const now = new Date();

    switch (preset) {
        case 'today':
            return { start: startOfDay(now), end: endOfDay(now) };
        case 'week':
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - 7);
            return { start: startOfDay(weekStart), end: endOfDay(now) };
        case 'month':
            return { start: startOfMonth(now), end: endOfMonth(now) };
        case 'year':
            return { start: startOfYear(now), end: endOfYear(now) };
        default:
            return { start: startOfYear(now), end: endOfDay(now) };
    }
}

/**
 * Group transactions by date for chart
 */
export function groupByDate(transactions: Transaction[], groupBy: 'day' | 'month' = 'day') {
    const grouped = new Map<string, { revenue: number; count: number; byType: Record<PaymentType, number> }>();

    transactions
        .filter(tx => tx.status === 'success')
        .forEach(tx => {
            const date = parseISO(tx.createdAt);
            const key = groupBy === 'month'
                ? format(date, 'yyyy-MM')
                : format(date, 'yyyy-MM-dd');

            if (!grouped.has(key)) {
                grouped.set(key, {
                    revenue: 0,
                    count: 0,
                    byType: { phone_card: 0, game_card: 0, bank_transfer: 0 }
                });
            }

            const data = grouped.get(key)!;
            data.revenue += tx.amount;
            data.count += 1;
            data.byType[tx.type] += tx.amount;
        });

    return Array.from(grouped.entries())
        .map(([date, data]) => ({
            date,
            revenue: data.revenue,
            transactions: data.count,
            phone_card: data.byType.phone_card,
            game_card: data.byType.game_card,
            bank_transfer: data.byType.bank_transfer,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate monthly profit data
 */
export function calculateMonthlyProfit(transactions: Transaction[]) {
    const grouped = new Map<string, { revenue: number; profit: number }>();

    transactions
        .filter(tx => tx.status === 'success')
        .forEach(tx => {
            const date = parseISO(tx.createdAt);
            const key = format(date, 'yyyy-MM');

            if (!grouped.has(key)) {
                grouped.set(key, { revenue: 0, profit: 0 });
            }

            const data = grouped.get(key)!;
            data.revenue += tx.amount;
            data.profit += calculateProfit(tx.amount, tx.type);
        });

    const monthlyData = Array.from(grouped.entries())
        .map(([month, data], index, arr) => {
            const prevMonth = arr[index - 1];
            const growth = prevMonth
                ? ((data.revenue - prevMonth[1].revenue) / prevMonth[1].revenue) * 100
                : 0;

            return {
                month,
                revenue: data.revenue,
                profit: data.profit,
                growth: Math.round(growth * 10) / 10,
            };
        })
        .sort((a, b) => a.month.localeCompare(b.month));

    return monthlyData;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, length: number): string {
    return str.length > length ? str.slice(0, length) + '...' : str;
}
