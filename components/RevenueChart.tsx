'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { ChartDataPoint } from '@/types';

interface RevenueChartProps {
    data: ChartDataPoint[];
    showByType?: boolean;
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

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
    if (!active || !payload?.length) return null;

    const formattedDate = label?.length === 7
        ? format(parseISO(`${label}-01`), 'MMMM yyyy', { locale: vi })
        : format(parseISO(label || ''), 'dd MMMM yyyy', { locale: vi });

    return (
        <div className="glass-card p-3 !bg-gray-900/95 border border-white/20 shadow-xl">
            <p className="text-sm text-gray-300 mb-2 font-medium">{formattedDate}</p>
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-gray-400">{entry.name}:</span>
                    <span className="font-medium text-white">{formatTooltipValue(entry.value)}</span>
                </div>
            ))}
        </div>
    );
};

export default function RevenueChart({ data, showByType = false }: RevenueChartProps) {
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
                    📈 Biểu đồ doanh thu
                </h3>
            </div>

            <div className="h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPhone" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorGame" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorBank" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="date"
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                value.length === 7
                                    ? format(parseISO(`${value}-01`), 'MMM', { locale: vi })
                                    : format(parseISO(value), 'dd/MM', { locale: vi })
                            }
                        />
                        <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={formatCurrencyAxis}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {showByType ? (
                            <>
                                <Legend
                                    wrapperStyle={{ paddingTop: '20px' }}
                                    formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="phone_card"
                                    name="Thẻ ĐT"
                                    stroke="#3b82f6"
                                    fillOpacity={1}
                                    fill="url(#colorPhone)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="game_card"
                                    name="Thẻ Game"
                                    stroke="#a855f7"
                                    fillOpacity={1}
                                    fill="url(#colorGame)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="bank_transfer"
                                    name="Ngân hàng"
                                    stroke="#f59e0b"
                                    fillOpacity={1}
                                    fill="url(#colorBank)"
                                    strokeWidth={2}
                                />
                            </>
                        ) : (
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                name="Doanh thu"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                strokeWidth={2}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
