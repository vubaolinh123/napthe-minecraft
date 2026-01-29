'use client';

import { useState } from 'react';
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import type { PaymentType, TransactionStatus } from '@/types';

export type ChartPeriod = 'day' | 'week' | 'month' | 'year';

interface FilterBarProps {
    onDateChange: (start: Date | null, end: Date | null) => void;
    onPaymentTypeChange: (type: PaymentType | 'all') => void;
    onStatusChange: (status: TransactionStatus | 'all') => void;
    onChartPeriodChange?: (period: ChartPeriod) => void;
    onReset: () => void;
    currentFilters: {
        startDate: Date | null;
        endDate: Date | null;
        paymentType: PaymentType | 'all';
        status: TransactionStatus | 'all';
    };
    chartPeriod?: ChartPeriod;
}

const quickDateRanges = [
    { label: 'Hôm nay', getValue: () => ({ start: startOfDay(new Date()), end: endOfDay(new Date()) }) },
    { label: '7 ngày', getValue: () => ({ start: startOfDay(subDays(new Date(), 6)), end: endOfDay(new Date()) }) },
    { label: '30 ngày', getValue: () => ({ start: startOfDay(subDays(new Date(), 29)), end: endOfDay(new Date()) }) },
    { label: 'Tuần này', getValue: () => ({ start: startOfWeek(new Date(), { weekStartsOn: 1 }), end: endOfWeek(new Date(), { weekStartsOn: 1 }) }) },
    { label: 'Tháng này', getValue: () => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }) },
    { label: 'Năm nay', getValue: () => ({ start: startOfYear(new Date()), end: endOfYear(new Date()) }) },
    { label: 'Tất cả', getValue: () => ({ start: new Date('2025-01-01'), end: new Date() }) },
];

const chartPeriodOptions: { value: ChartPeriod; label: string }[] = [
    { value: 'day', label: 'Theo ngày' },
    { value: 'week', label: 'Theo tuần' },
    { value: 'month', label: 'Theo tháng' },
    { value: 'year', label: 'Theo năm' },
];

export default function FilterBar({
    onDateChange,
    onPaymentTypeChange,
    onStatusChange,
    onChartPeriodChange,
    onReset,
    currentFilters,
    chartPeriod = 'month',
}: FilterBarProps) {
    const [showCustomDate, setShowCustomDate] = useState(false);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    const handleQuickDateSelect = (getValue: () => { start: Date; end: Date }) => {
        const { start, end } = getValue();
        onDateChange(start, end);
    };

    const handleCustomDateApply = () => {
        if (customStart && customEnd) {
            onDateChange(new Date(customStart), new Date(customEnd));
            setShowCustomDate(false);
        }
    };

    return (
        <div className="glass-card p-4 sm:p-5 mb-6 space-y-4">
            {/* Quick Date Filters */}
            <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-400 flex items-center mr-2">📅 Thời gian:</span>
                {quickDateRanges.map((range) => (
                    <button
                        key={range.label}
                        onClick={() => handleQuickDateSelect(range.getValue)}
                        className="px-3 py-1.5 text-sm rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 transition-all duration-200 border border-white/10 hover:border-emerald-500/30"
                    >
                        {range.label}
                    </button>
                ))}
                <button
                    onClick={() => setShowCustomDate(!showCustomDate)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 border ${showCustomDate
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 border-white/10 hover:border-emerald-500/30'
                        }`}
                >
                    Tùy chọn
                </button>
            </div>

            {/* Custom Date Range */}
            {showCustomDate && (
                <div className="flex flex-wrap items-end gap-3 pt-3 border-t border-white/10">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Từ ngày</label>
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Đến ngày</label>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                    </div>
                    <button
                        onClick={handleCustomDateApply}
                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
                    >
                        Áp dụng
                    </button>
                </div>
            )}

            {/* Chart Period & Type/Status Filters */}
            <div className="flex flex-wrap gap-4 pt-3 border-t border-white/10">
                {/* Chart Period Selector */}
                {onChartPeriodChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">📊 Biểu đồ:</span>
                        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                            {chartPeriodOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => onChartPeriodChange(option.value)}
                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${chartPeriod === option.value
                                            ? 'bg-emerald-500 text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Payment Type */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">💳 Loại:</span>
                    <select
                        value={currentFilters.paymentType}
                        onChange={(e) => onPaymentTypeChange(e.target.value as PaymentType | 'all')}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
                    >
                        <option value="all">Tất cả</option>
                        <option value="phone_card">Thẻ điện thoại</option>
                        <option value="game_card">Thẻ game</option>
                        <option value="bank_transfer">Ngân hàng</option>
                    </select>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">📊 Trạng thái:</span>
                    <select
                        value={currentFilters.status}
                        onChange={(e) => onStatusChange(e.target.value as TransactionStatus | 'all')}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
                    >
                        <option value="all">Tất cả</option>
                        <option value="success">Thành công</option>
                        <option value="pending">Đang xử lý</option>
                        <option value="failed">Thất bại</option>
                    </select>
                </div>

                {/* Reset Button */}
                <button
                    onClick={onReset}
                    className="ml-auto px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors border border-red-500/20 hover:border-red-500/30"
                >
                    🔄 Reset
                </button>
            </div>
        </div>
    );
}
