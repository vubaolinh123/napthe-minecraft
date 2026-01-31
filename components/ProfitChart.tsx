'use client';

import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Cell,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import type { MonthlyExpense } from '@/types';

interface ProfitChartProps {
    data: MonthlyExpense[];
}

const formatCurrencyAxis = (value: number) => {
    if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; fill: string }>; label?: string }) => {
    if (!active || !payload?.length) return null;

    let formattedDate = label || '';
    if (label && label.length === 7) {
        formattedDate = format(parseISO(`${label}-01`), 'MMMM yyyy', { locale: vi });
    }

    // Find profit value
    const profitPayload = payload.find(p => p.name === 'Lãi/Lỗ');
    const profit = profitPayload?.value || 0;
    const isProfit = profit >= 0;

    return (
        <div className="glass-card p-4 !bg-gray-900/95 border border-white/20 shadow-xl min-w-[200px]">
            <p className="text-sm text-gray-300 mb-3 font-medium capitalize border-b border-white/10 pb-2">
                {formattedDate}
            </p>
            {payload.filter(p => p.name !== 'Lãi/Lỗ').map((entry, index) => (
                <div key={index} className="flex items-center justify-between gap-4 text-sm mb-1">
                    <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded" style={{ backgroundColor: entry.fill }} />
                        <span className="text-gray-400">{entry.name}</span>
                    </span>
                    <span className="font-medium text-white">{formatCurrency(entry.value)}</span>
                </div>
            ))}
            <div className="mt-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isProfit ? '📈 Lãi' : '📉 Lỗ'}
                    </span>
                    <span className={`font-bold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isProfit ? '+' : ''}{formatCurrency(profit)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default function ProfitChart({ data }: ProfitChartProps) {
    const chartData = useMemo(() => {
        return data.map(item => ({
            month: item.month,
            revenue: item.revenue,
            costs: item.costs.total,
            profit: item.profit,
        }));
    }, [data]);

    const formatXAxis = (value: string) => {
        if (!value || value.length !== 7) return value;
        return format(parseISO(`${value}-01`), 'MMM', { locale: vi });
    };

    if (!chartData.length) {
        return (
            <div className="glass-card p-6 h-80 flex items-center justify-center">
                <p className="text-gray-400">Không có dữ liệu để hiển thị</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                💹 Doanh thu, Chi phí & Lãi/Lỗ
            </h3>

            <div className="h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="month"
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={formatXAxis}
                        />
                        <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={formatCurrencyAxis}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ paddingTop: '10px' }}
                            formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
                        />
                        <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />

                        {/* Revenue bars */}
                        <Bar
                            dataKey="revenue"
                            name="Doanh thu"
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={30}
                        />

                        {/* Costs bars */}
                        <Bar
                            dataKey="costs"
                            name="Chi phí"
                            fill="#f59e0b"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={30}
                        />

                        {/* Profit/Loss bars with dynamic colors */}
                        <Bar
                            dataKey="profit"
                            name="Lãi/Lỗ"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={30}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.profit >= 0 ? '#22c55e' : '#ef4444'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
