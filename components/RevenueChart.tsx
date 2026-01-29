'use client';

import { useState, useMemo } from 'react';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { ChartDataPoint } from '@/types';

interface RevenueChartProps {
    data: ChartDataPoint[];
    showByType?: boolean;
}

type ChartType = 'area' | 'bar' | 'line';

const CHART_TYPES: { value: ChartType; label: string; icon: string }[] = [
    { value: 'area', label: 'Area', icon: '📈' },
    { value: 'bar', label: 'Bar', icon: '📊' },
    { value: 'line', label: 'Line', icon: '📉' },
];

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

    let formattedDate = label || '';
    if (label) {
        if (label.length === 10) {
            // Daily format: yyyy-MM-dd
            formattedDate = format(parseISO(label), 'EEEE, dd/MM/yyyy', { locale: vi });
        } else if (label.length === 7) {
            // Monthly format: yyyy-MM
            formattedDate = format(parseISO(`${label}-01`), 'MMMM yyyy', { locale: vi });
        } else if (label.includes('W')) {
            // Weekly format: yyyy-Www
            formattedDate = `Tuần ${label.split('W')[1]}, ${label.split('-')[0]}`;
        }
    }

    return (
        <div className="glass-card p-3 !bg-gray-900/95 border border-white/20 shadow-xl">
            <p className="text-sm text-gray-300 mb-2 font-medium capitalize">{formattedDate}</p>
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

// Gradient definitions for charts
const GradientDefs = () => (
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
);

export default function RevenueChart({ data, showByType = false }: RevenueChartProps) {
    const [chartType, setChartType] = useState<ChartType>('area');

    const formatXAxis = (value: string) => {
        if (!value) return '';
        if (value.length === 10) {
            return format(parseISO(value), 'dd/MM', { locale: vi });
        } else if (value.length === 7) {
            return format(parseISO(`${value}-01`), 'MMM', { locale: vi });
        } else if (value.includes('W')) {
            return `W${value.split('W')[1]}`;
        }
        return value;
    };

    if (!data.length) {
        return (
            <div className="glass-card p-6 h-80 flex items-center justify-center">
                <p className="text-gray-400">Không có dữ liệu để hiển thị</p>
            </div>
        );
    }

    const renderChart = () => {
        const commonProps = {
            data,
            margin: { top: 10, right: 10, left: 0, bottom: 0 },
        };

        const commonAxisProps = {
            XAxis: {
                dataKey: "date",
                stroke: "#6b7280",
                fontSize: 12,
                tickLine: false,
                axisLine: false,
                tickFormatter: formatXAxis,
            },
            YAxis: {
                stroke: "#6b7280",
                fontSize: 12,
                tickLine: false,
                axisLine: false,
                tickFormatter: formatCurrencyAxis,
            },
        };

        switch (chartType) {
            case 'bar':
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis {...commonAxisProps.XAxis} />
                        <YAxis {...commonAxisProps.YAxis} />
                        <Tooltip content={<CustomTooltip />} />
                        {showByType ? (
                            <>
                                <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>} />
                                <Bar dataKey="phone_card" name="Thẻ ĐT" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                                <Bar dataKey="game_card" name="Thẻ Game" fill="#a855f7" radius={[2, 2, 0, 0]} />
                                <Bar dataKey="bank_transfer" name="Ngân hàng" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                            </>
                        ) : (
                            <Bar dataKey="revenue" name="Doanh thu" fill="#10b981" radius={[4, 4, 0, 0]} />
                        )}
                    </BarChart>
                );

            case 'line':
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis {...commonAxisProps.XAxis} />
                        <YAxis {...commonAxisProps.YAxis} />
                        <Tooltip content={<CustomTooltip />} />
                        {showByType ? (
                            <>
                                <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>} />
                                <Line type="monotone" dataKey="phone_card" name="Thẻ ĐT" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="game_card" name="Thẻ Game" stroke="#a855f7" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="bank_transfer" name="Ngân hàng" stroke="#f59e0b" strokeWidth={2} dot={false} />
                            </>
                        ) : (
                            <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#10b981" strokeWidth={2} dot={false} />
                        )}
                    </LineChart>
                );

            case 'area':
            default:
                return (
                    <AreaChart {...commonProps}>
                        <GradientDefs />
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis {...commonAxisProps.XAxis} />
                        <YAxis {...commonAxisProps.YAxis} />
                        <Tooltip content={<CustomTooltip />} />
                        {showByType ? (
                            <>
                                <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>} />
                                <Area type="monotone" dataKey="phone_card" name="Thẻ ĐT" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPhone)" strokeWidth={2} />
                                <Area type="monotone" dataKey="game_card" name="Thẻ Game" stroke="#a855f7" fillOpacity={1} fill="url(#colorGame)" strokeWidth={2} />
                                <Area type="monotone" dataKey="bank_transfer" name="Ngân hàng" stroke="#f59e0b" fillOpacity={1} fill="url(#colorBank)" strokeWidth={2} />
                            </>
                        ) : (
                            <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                        )}
                    </AreaChart>
                );
        }
    };

    return (
        <div className="glass-card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    📈 Biểu đồ doanh thu
                </h3>

                {/* Chart Type Selector */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
                    {CHART_TYPES.map((type) => (
                        <button
                            key={type.value}
                            onClick={() => setChartType(type.value)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${chartType === type.value
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {type.icon} {type.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
