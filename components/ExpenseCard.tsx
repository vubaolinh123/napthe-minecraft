'use client';

import { formatCurrency } from '@/lib/utils';
import type { CostBreakdown } from '@/types';

interface ExpenseCardProps {
    title: string;
    breakdown: CostBreakdown;
    month?: string;
}

export default function ExpenseCard({ title, breakdown }: ExpenseCardProps) {
    const items = [
        { label: 'Thuê DEV', value: breakdown.dev, icon: '👨‍💻' },
        { label: 'Thuê Designer', value: breakdown.design, icon: '🎨' },
        { label: `Server Admin (${breakdown.adminCount} người)`, value: breakdown.admin, icon: '🛡️' },
        { label: 'VPS Hosting', value: breakdown.vps, icon: '🖥️' },
    ];

    return (
        <div className="glass-card p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                💰 {title}
            </h3>

            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                        <span className="text-gray-400 flex items-center gap-2">
                            <span>{item.icon}</span>
                            {item.label}
                        </span>
                        <span className="text-white font-medium">
                            {formatCurrency(item.value)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-semibold">Tổng chi phí</span>
                    <span className="text-xl font-bold text-amber-400">
                        {formatCurrency(breakdown.total)}
                    </span>
                </div>
            </div>
        </div>
    );
}
