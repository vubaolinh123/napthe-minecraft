'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { MonthlyProfitData } from '@/types';

interface ProfitChartProps {
    data: MonthlyProfitData[];
}

const formatCurrencyAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
};

const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value);
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) => {
    if (!active || !payload?.length) return null;

    const monthLabel = format(parseISO(`${label}-01`), 'MMMM yyyy', { locale: vi });
    const profitData = payload.find(p => p.dataKey === 'profit');
    const revenueData = payload.find(p => p.dataKey === 'revenue');
    const growthData = payload[0] && 'payload' in payload[0] ? (payload[0] as unknown as { payload: MonthlyProfitData }).payload.growth : 0;

    return (
        <div className="glass-card p-3 !bg-gray-900/95 border border-white/20 shadow-xl">
            <p className="text-sm text-gray-300 mb-2 font-medium capitalize">{monthLabel}</p>
            {revenueData && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-gray-400">Doanh thu:</span>
                    <span className="font-medium text-white">{formatTooltipValue(revenueData.value)}</span>
                </div>
            )}
            {profitData && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-gray-400">Lợi nhuận:</span>
                    <span className="font-medium text-white">{formatTooltipValue(profitData.value)}</span>
                </div>
            )}
            <div className="flex items-center gap-2 text-sm mt-1 pt-1 border-t border-white/10">
                <span className="text-gray-400">Tăng trưởng:</span>
                <span className={`font-medium ${growthData >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {growthData >= 0 ? '+' : ''}{growthData}%
                </span>
            </div>
        </div>
    );
};

export default function ProfitChart({ data }: ProfitChartProps) {
    if (!data.length) {
        return (
            <div className="glass-card p-6 h-80 flex items-center justify-center">
                <p className="text-gray-400">Không có dữ liệu để hiển thị</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    💰 Lợi nhuận theo tháng
                </h3>
            </div>

            <div className="h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="month"
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => format(parseISO(`${value}-01`), 'MMM', { locale: vi })}
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
                            wrapperStyle={{ paddingTop: '20px' }}
                            formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
                        />
                        <Bar
                            dataKey="revenue"
                            name="Doanh thu"
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-revenue-${index}`}
                                    fill={entry.growth >= 0 ? '#10b981' : '#ef4444'}
                                    fillOpacity={0.8}
                                />
                            ))}
                        </Bar>
                        <Bar
                            dataKey="profit"
                            name="Lợi nhuận"
                            fill="#f59e0b"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
