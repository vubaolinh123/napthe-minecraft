'use client';

import { formatCurrency, formatNumber } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    subtitle?: string;
    className?: string;
    isCurrency?: boolean;
}

export default function StatCard({
    title,
    value,
    icon,
    trend,
    subtitle,
    className = '',
    isCurrency = false,
}: StatCardProps) {
    const displayValue = isCurrency
        ? formatCurrency(typeof value === 'number' ? value : parseFloat(value))
        : typeof value === 'number' ? formatNumber(value) : value;

    return (
        <div className={`glass-card p-4 sm:p-5 group hover:scale-[1.02] transition-all duration-300 ${className}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trend.isPositive
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                        <span>{trend.isPositive ? '↑' : '↓'}</span>
                        <span>{Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="text-sm text-gray-400 font-medium">{title}</h3>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {displayValue}
                </p>
                {subtitle && (
                    <p className="text-xs text-gray-500">{subtitle}</p>
                )}
            </div>
        </div>
    );
}
