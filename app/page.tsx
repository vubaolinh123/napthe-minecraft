'use client';

import { Suspense, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import transactionsData from '@/data/transactions.json';
import expensesData from '@/data/expenses.json';
import { useTransactions } from '@/hooks/useTransactions';
import { usePagination } from '@/hooks/usePagination';
import { groupByDate, formatCurrency } from '@/lib/utils';
import type { Transaction, MonthlyExpense } from '@/types';
import type { ChartPeriod } from '@/components/FilterBar';

// Dynamic imports
const DashboardHeader = dynamic(() => import('@/components/DashboardHeader'), {
  loading: () => <div className="glass-card h-20 animate-pulse mb-6" />,
});

const StatCard = dynamic(() => import('@/components/StatCard'), {
  loading: () => <div className="glass-card h-32 animate-pulse" />,
});

const FilterBar = dynamic(() => import('@/components/FilterBar'), {
  loading: () => <div className="glass-card h-32 animate-pulse mb-6" />,
});

const RevenueChart = dynamic(() => import('@/components/RevenueChart'), {
  loading: () => <div className="glass-card h-80 animate-pulse" />,
  ssr: false,
});

const ProfitChart = dynamic(() => import('@/components/ProfitChart'), {
  loading: () => <div className="glass-card h-80 animate-pulse" />,
  ssr: false,
});

const TransactionTable = dynamic(() => import('@/components/TransactionTable'), {
  loading: () => <div className="glass-card h-96 animate-pulse" />,
});

export default function Dashboard() {
  const transactions = transactionsData as Transaction[];
  const expenses = expensesData as MonthlyExpense[];
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('month');

  const {
    filteredTransactions,
    filters,
    setDateRange,
    setPaymentType,
    setStatus,
    resetFilters,
    stats,
  } = useTransactions({ transactions });

  const pagination = usePagination({
    totalItems: filteredTransactions.length,
    initialItemsPerPage: 10,
  });

  // Chart data
  const revenueChartData = useMemo(
    () => groupByDate(filteredTransactions, chartPeriod),
    [filteredTransactions, chartPeriod]
  );

  // Overall profit/loss summary
  const overallSummary = useMemo(() => {
    const totalRevenue = expenses.reduce((sum, e) => sum + e.revenue, 0);
    const totalCosts = expenses.reduce((sum, e) => sum + e.costs.total, 0);
    return {
      totalRevenue,
      totalCosts,
      netProfit: totalRevenue - totalCosts,
    };
  }, [expenses]);

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <Suspense fallback={<div className="glass-card h-20 animate-pulse mb-6" />}>
        <DashboardHeader />
      </Suspense>

      {/* Navigation */}
      <div className="flex items-center gap-4 mb-4">
        <Link
          href="/expenses"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition-colors border border-amber-500/20"
        >
          💰 Xem Chi phí & Lãi/Lỗ
        </Link>
      </div>

      {/* Filter Bar */}
      <Suspense fallback={<div className="glass-card h-32 animate-pulse mb-6" />}>
        <FilterBar
          currentFilters={filters}
          onDateChange={setDateRange}
          onPaymentTypeChange={setPaymentType}
          onStatusChange={setStatus}
          onChartPeriodChange={setChartPeriod}
          onReset={resetFilters}
          chartPeriod={chartPeriod}
        />
      </Suspense>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Suspense fallback={<div className="glass-card h-32 animate-pulse" />}>
          <StatCard
            title="Tổng Doanh Thu"
            value={stats.totalRevenue}
            isCurrency
            icon={<span className="text-xl">💰</span>}
            subtitle="Từ giao dịch thành công"
          />
        </Suspense>

        <Suspense fallback={<div className="glass-card h-32 animate-pulse" />}>
          <StatCard
            title="Tổng Chi Phí"
            value={overallSummary.totalCosts}
            isCurrency
            icon={<span className="text-xl">💸</span>}
            subtitle="Chi phí vận hành"
          />
        </Suspense>

        <Suspense fallback={<div className="glass-card h-32 animate-pulse" />}>
          <StatCard
            title="Lãi/Lỗ Ròng"
            value={overallSummary.netProfit}
            isCurrency
            icon={<span className="text-xl">{overallSummary.netProfit >= 0 ? '📈' : '📉'}</span>}
            subtitle={overallSummary.netProfit >= 0 ? 'Lãi' : 'Lỗ'}
            trend={{
              value: Math.abs(Math.round((overallSummary.netProfit / overallSummary.totalCosts) * 100)),
              isPositive: overallSummary.netProfit >= 0,
            }}
          />
        </Suspense>

        <Suspense fallback={<div className="glass-card h-32 animate-pulse" />}>
          <StatCard
            title="Tổng Giao Dịch"
            value={stats.totalTransactions}
            icon={<span className="text-xl">📊</span>}
            subtitle={`${stats.successfulTransactions} thành công`}
          />
        </Suspense>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Suspense fallback={<div className="glass-card h-80 animate-pulse" />}>
          <RevenueChart data={revenueChartData} showByType />
        </Suspense>

        <Suspense fallback={<div className="glass-card h-80 animate-pulse" />}>
          <ProfitChart data={expenses} />
        </Suspense>
      </div>

      {/* Payment Type Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
          <div>
            <p className="text-sm text-gray-400">Thẻ Điện Thoại</p>
            <p className="text-lg font-bold text-white">{formatCurrency(stats.revenueByType.phone_card)}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <span className="text-2xl">🎮</span>
          </div>
          <div>
            <p className="text-sm text-gray-400">Thẻ Game</p>
            <p className="text-lg font-bold text-white">{formatCurrency(stats.revenueByType.game_card)}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <span className="text-2xl">🏦</span>
          </div>
          <div>
            <p className="text-sm text-gray-400">Ngân Hàng</p>
            <p className="text-lg font-bold text-white">{formatCurrency(stats.revenueByType.bank_transfer)}</p>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <Suspense fallback={<div className="glass-card h-96 animate-pulse" />}>
        <TransactionTable
          transactions={filteredTransactions}
          page={pagination.page}
          totalPages={pagination.totalPages}
          itemsPerPage={pagination.itemsPerPage}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          onPageChange={pagination.setPage}
          onItemsPerPageChange={pagination.setItemsPerPage}
        />
      </Suspense>
    </main>
  );
}
