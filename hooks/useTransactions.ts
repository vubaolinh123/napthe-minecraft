'use client';

import { useState, useMemo, useCallback } from 'react';
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import type { Transaction, PaymentType, TransactionStatus, FilterState } from '@/types';

interface UseTransactionsProps {
    transactions: Transaction[];
}

interface UseTransactionsReturn {
    filteredTransactions: Transaction[];
    filters: FilterState;
    setDateRange: (start: Date | null, end: Date | null) => void;
    setPaymentType: (type: PaymentType | 'all') => void;
    setStatus: (status: TransactionStatus | 'all') => void;
    resetFilters: () => void;
    stats: {
        totalRevenue: number;
        totalTransactions: number;
        successfulTransactions: number;
        failedTransactions: number;
        pendingTransactions: number;
        averageTransaction: number;
        revenueByType: Record<PaymentType, number>;
    };
}

const initialFilters: FilterState = {
    startDate: null,
    endDate: null,
    paymentType: 'all',
    status: 'all',
};

export function useTransactions({ transactions }: UseTransactionsProps): UseTransactionsReturn {
    const [filters, setFilters] = useState<FilterState>(initialFilters);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((tx) => {
            // Date filter
            if (filters.startDate && filters.endDate) {
                const txDate = parseISO(tx.createdAt);
                if (!isWithinInterval(txDate, {
                    start: startOfDay(filters.startDate),
                    end: endOfDay(filters.endDate),
                })) {
                    return false;
                }
            }

            // Payment type filter
            if (filters.paymentType !== 'all' && tx.type !== filters.paymentType) {
                return false;
            }

            // Status filter
            if (filters.status !== 'all' && tx.status !== filters.status) {
                return false;
            }

            return true;
        });
    }, [transactions, filters]);

    const stats = useMemo(() => {
        const successfulTx = filteredTransactions.filter(tx => tx.status === 'success');
        const totalRevenue = successfulTx.reduce((sum, tx) => sum + tx.amount, 0);

        const revenueByType: Record<PaymentType, number> = {
            phone_card: 0,
            game_card: 0,
            bank_transfer: 0,
        };

        successfulTx.forEach(tx => {
            revenueByType[tx.type] += tx.amount;
        });

        return {
            totalRevenue,
            totalTransactions: filteredTransactions.length,
            successfulTransactions: successfulTx.length,
            failedTransactions: filteredTransactions.filter(tx => tx.status === 'failed').length,
            pendingTransactions: filteredTransactions.filter(tx => tx.status === 'pending').length,
            averageTransaction: successfulTx.length > 0
                ? Math.round(totalRevenue / successfulTx.length)
                : 0,
            revenueByType,
        };
    }, [filteredTransactions]);

    const setDateRange = useCallback((start: Date | null, end: Date | null) => {
        setFilters(prev => ({ ...prev, startDate: start, endDate: end }));
    }, []);

    const setPaymentType = useCallback((type: PaymentType | 'all') => {
        setFilters(prev => ({ ...prev, paymentType: type }));
    }, []);

    const setStatus = useCallback((status: TransactionStatus | 'all') => {
        setFilters(prev => ({ ...prev, status }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
    }, []);

    return {
        filteredTransactions,
        filters,
        setDateRange,
        setPaymentType,
        setStatus,
        resetFilters,
        stats,
    };
}
