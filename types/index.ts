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
    totalPages: number;
}

export interface StatsSummary {
    totalRevenue: number;
    totalTransactions: number;
    successfulTransactions: number;
    averageTransaction: number;
    revenueByType: Record<PaymentType, number>;
}

export interface ChartDataPoint {
    date: string;
    revenue: number;
    transactions?: number;
    phone_card?: number;
    game_card?: number;
    bank_transfer?: number;
}

// Cost breakdown interface
export interface CostBreakdown {
    dev: number;
    design: number;
    admin: number;
    adminCount: number;
    vps: number;
    total: number;
}

// Monthly expense record
export interface MonthlyExpense {
    month: string;
    revenue: number;
    costs: CostBreakdown;
    profit: number;
}

// Profit/Loss summary
export interface ProfitLossSummary {
    month: string;
    revenue: number;
    costs: number;
    profit: number;
    isProfit: boolean;
    growth: number;
}

// Overall summary
export interface OverallSummary {
    totalRevenue: number;
    totalCosts: number;
    netProfit: number;
    profitableMonths: number;
    lossMonths: number;
}
