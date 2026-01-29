// Transaction data types for Minecraft top-up statistics dashboard

export type PaymentType = 'phone_card' | 'game_card' | 'bank_transfer';
export type TransactionStatus = 'success' | 'pending' | 'failed';

export interface Transaction {
    id: string;
    playerName: string;
    playerId: string;
    amount: number;
    type: PaymentType;
    provider: string;
    status: TransactionStatus;
    createdAt: string;
}

export interface FilterState {
    startDate: Date | null;
    endDate: Date | null;
    paymentType: PaymentType | 'all';
    status: TransactionStatus | 'all';
}

export interface PaginationState {
    page: number;
    itemsPerPage: number;
    totalItems: number;
}

export interface StatsSummary {
    totalRevenue: number;
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    averageTransaction: number;
    revenueByType: Record<PaymentType, number>;
}

export interface ChartDataPoint {
    date: string;
    revenue: number;
    transactions: number;
    phone_card?: number;
    game_card?: number;
    bank_transfer?: number;
}

export interface MonthlyProfitData {
    month: string;
    revenue: number;
    profit: number;
    growth: number;
}
