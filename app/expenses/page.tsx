'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import expensesData from '@/data/expenses.json';
import transactionsData from '@/data/transactions.json';
import { formatCurrency, calculateMonthlyProfitLoss } from '@/lib/utils';
import type { MonthlyExpense, Transaction, OverallSummary } from '@/types';

const DashboardHeader = dynamic(() => import('@/components/DashboardHeader'), {
    loading: () => <div className="glass-card h-20 animate-pulse mb-6" />,
});

const ExpenseCard = dynamic(() => import('@/components/ExpenseCard'), {
    loading: () => <div className="glass-card h-64 animate-pulse" />,
});

const ProfitChart = dynamic(() => import('@/components/ProfitChart'), {
    loading: () => <div className="glass-card h-80 animate-pulse" />,
    ssr: false,
});

const ProfitLossIndicator = dynamic(() => import('@/components/ProfitLossIndicator'), {
    loading: () => <div className="h-8 w-32 animate-pulse rounded bg-white/10" />,
});

export default function ExpensesPage() {
    const expenses = expensesData as MonthlyExpense[];
    const transactions = transactionsData as Transaction[];
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

    // Calculate overall summary
    const summary: OverallSummary = useMemo(() => {
        const totalRevenue = expenses.reduce((sum, e) => sum + e.revenue, 0);
        const totalCosts = expenses.reduce((sum, e) => sum + e.costs.total, 0);
        const profitableMonths = expenses.filter(e => e.profit >= 0).length;
        const lossMonths = expenses.filter(e => e.profit < 0).length;

        return {
            totalRevenue,
            totalCosts,
            netProfit: totalRevenue - totalCosts,
            profitableMonths,
            lossMonths,
        };
    }, [expenses]);

    // Get current expense details
    const currentExpense = selectedMonth
        ? expenses.find(e => e.month === selectedMonth)
        : expenses[expenses.length - 1];

    return (
        <main className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <DashboardHeader />

            {/* Navigation */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                >
                    ← Quay lại Dashboard
                </Link>
                <h2 className="text-xl font-bold text-white">📊 Thống kê Chi phí</h2>
            </div>

            {/* Overall Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="glass-card p-4">
                    <p className="text-sm text-gray-400 mb-1">Tổng Doanh thu</p>
                    <p className="text-2xl font-bold text-emerald-400">{formatCurrency(summary.totalRevenue)}</p>
                </div>
                <div className="glass-card p-4">
                    <p className="text-sm text-gray-400 mb-1">Tổng Chi phí</p>
                    <p className="text-2xl font-bold text-amber-400">{formatCurrency(summary.totalCosts)}</p>
                </div>
                <div className="glass-card p-4">
                    <p className="text-sm text-gray-400 mb-1">Lãi/Lỗ Ròng</p>
                    <p className={`text-2xl font-bold ${summary.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {summary.netProfit >= 0 ? '+' : ''}{formatCurrency(summary.netProfit)}
                    </p>
                </div>
                <div className="glass-card p-4">
                    <p className="text-sm text-gray-400 mb-1">Thống kê</p>
                    <div className="flex items-center gap-4">
                        <span className="text-emerald-400 font-bold">{summary.profitableMonths} lãi</span>
                        <span className="text-red-400 font-bold">{summary.lossMonths} lỗ</span>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Chart Section */}
                <div className="lg:col-span-2">
                    <ProfitChart data={expenses} />
                </div>

                {/* Expense Breakdown */}
                <div>
                    <div className="mb-4">
                        <label className="text-sm text-gray-400">Chọn tháng:</label>
                        <select
                            value={selectedMonth || ''}
                            onChange={(e) => setSelectedMonth(e.target.value || null)}
                            className="w-full mt-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
                        >
                            {expenses.map((e) => (
                                <option key={e.month} value={e.month}>
                                    {e.month}
                                </option>
                            ))}
                        </select>
                    </div>
                    {currentExpense && (
                        <ExpenseCard
                            title={`Chi phí tháng ${currentExpense.month}`}
                            breakdown={currentExpense.costs}
                        />
                    )}
                </div>
            </div>

            {/* Monthly Details Table */}
            <div className="glass-card p-4 sm:p-6 overflow-x-auto">
                <h3 className="text-lg font-semibold text-white mb-4">📋 Chi tiết theo tháng</h3>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-gray-400 border-b border-white/10">
                            <th className="text-left py-3 px-2">Tháng</th>
                            <th className="text-right py-3 px-2">Doanh thu</th>
                            <th className="text-right py-3 px-2">Chi phí</th>
                            <th className="text-right py-3 px-2">Lãi/Lỗ</th>
                            <th className="text-center py-3 px-2">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr
                                key={expense.month}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                                <td className="py-3 px-2 text-white font-medium">{expense.month}</td>
                                <td className="py-3 px-2 text-right text-emerald-400">
                                    {expense.revenue > 0 ? formatCurrency(expense.revenue) : '-'}
                                </td>
                                <td className="py-3 px-2 text-right text-amber-400">
                                    {formatCurrency(expense.costs.total)}
                                </td>
                                <td className={`py-3 px-2 text-right font-bold ${expense.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {expense.profit >= 0 ? '+' : ''}{formatCurrency(expense.profit)}
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${expense.profit >= 0
                                            ? 'bg-emerald-400/10 text-emerald-400'
                                            : 'bg-red-400/10 text-red-400'
                                        }`}>
                                        {expense.profit >= 0 ? '✅ Lãi' : '❌ Lỗ'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
