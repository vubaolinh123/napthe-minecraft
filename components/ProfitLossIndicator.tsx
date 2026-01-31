'use client';

import { formatCurrency } from '@/lib/utils';

interface ProfitLossIndicatorProps {
    profit: number;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function ProfitLossIndicator({
    profit,
    showLabel = true,
    size = 'md'
}: ProfitLossIndicatorProps) {
    const isProfit = profit >= 0;

    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-2xl',
    };

    return (
        <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
            {showLabel && (
                <span className="text-gray-400 text-sm">
                    {isProfit ? 'Lãi' : 'Lỗ'}:
                </span>
            )}
            <span
                className={`font-bold flex items-center gap-1 ${isProfit
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
            >
                <span>{isProfit ? '📈' : '📉'}</span>
                {isProfit ? '+' : '-'}{formatCurrency(Math.abs(profit))}
            </span>
        </div>
    );
}
