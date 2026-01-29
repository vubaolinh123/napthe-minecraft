'use client';

import { formatCurrency, formatDateTime, getPaymentTypeLabel, getStatusLabel, getStatusColor, getPaymentTypeColor } from '@/lib/utils';
import Pagination from './Pagination';
import type { Transaction } from '@/types';

interface TransactionTableProps {
    transactions: Transaction[];
    page: number;
    totalPages: number;
    itemsPerPage: number;
    startIndex: number;
    endIndex: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (count: number) => void;
}

export default function TransactionTable({
    transactions,
    page,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    onPageChange,
    onItemsPerPageChange,
}: TransactionTableProps) {
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    return (
        <div className="glass-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    📋 Lịch sử giao dịch
                </h3>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Mã GD</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Người chơi</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Loại</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Nhà cung cấp</th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">Số tiền</th>
                            <th className="text-center px-4 py-3 text-sm font-medium text-gray-400">Trạng thái</th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">Thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTransactions.map((tx) => (
                            <tr
                                key={tx.id}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                                <td className="px-4 py-3 text-sm font-mono text-gray-300">{tx.id}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center text-sm">
                                            ⛏️
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-white">{tx.playerName}</p>
                                            <p className="text-xs text-gray-500">{tx.playerId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`text-sm ${getPaymentTypeColor(tx.type)}`}>
                                        {getPaymentTypeLabel(tx.type)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-300">{tx.provider}</td>
                                <td className="px-4 py-3 text-sm font-medium text-white text-right">
                                    {formatCurrency(tx.amount)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                                        {getStatusLabel(tx.status)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-400 text-right">
                                    {formatDateTime(tx.createdAt)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-white/10">
                {paginatedTransactions.map((tx) => (
                    <div key={tx.id} className="p-4 hover:bg-white/5 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center text-sm">
                                    ⛏️
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-white">{tx.playerName}</p>
                                    <p className="text-xs text-gray-500">{tx.playerId}</p>
                                </div>
                            </div>
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                                {getStatusLabel(tx.status)}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-gray-500">Mã GD:</span>
                                <span className="ml-1 text-gray-300 font-mono text-xs">{tx.id}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-gray-500">Số tiền:</span>
                                <span className="ml-1 text-white font-medium">{formatCurrency(tx.amount)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Loại:</span>
                                <span className={`ml-1 ${getPaymentTypeColor(tx.type)}`}>{getPaymentTypeLabel(tx.type)}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-gray-500">NCC:</span>
                                <span className="ml-1 text-gray-300">{tx.provider}</span>
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                            {formatDateTime(tx.createdAt)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {paginatedTransactions.length === 0 && (
                <div className="p-12 text-center">
                    <span className="text-4xl mb-4 block">📭</span>
                    <p className="text-gray-400">Không có giao dịch nào</p>
                </div>
            )}

            {/* Pagination */}
            <Pagination
                page={page}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={transactions.length}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={onPageChange}
                onItemsPerPageChange={onItemsPerPageChange}
            />
        </div>
    );
}
