/**
 * Script to generate fake transaction data for Minecraft top-up statistics
 * Run with: npx ts-node scripts/generateData.ts
 */

import * as fs from 'fs';
import * as path from 'path';

type PaymentType = 'phone_card' | 'game_card' | 'bank_transfer';
type TransactionStatus = 'success' | 'pending' | 'failed';

interface Transaction {
    id: string;
    playerName: string;
    playerId: string;
    amount: number;
    type: PaymentType;
    provider: string;
    status: TransactionStatus;
    createdAt: string;
}

// Vietnamese player name parts for realistic data
const firstNames = ['Minh', 'Hoàng', 'Anh', 'Hùng', 'Đức', 'Tuấn', 'Long', 'Phong', 'Khang', 'Bảo', 'Nam', 'Dũng', 'Tài', 'Kiên', 'Thắng'];
const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];
const suffixes = ['Pro', 'Gaming', 'MC', 'VN', 'PVP', 'HD', 'YT', 'TTV', '123', '456', 'XD', 'OP', 'Noob', 'King', 'Boss'];

// Payment amounts - phone and game cards must be even numbers
const phoneCardAmounts = [10000, 20000, 30000, 50000, 100000, 200000, 500000];
const gameCardAmounts = [10000, 20000, 50000, 100000, 200000, 500000];
// Bank transfers can be any amount (including odd)
const bankTransferAmounts = [15000, 25000, 35000, 45000, 75000, 125000, 175000, 250000, 375000, 20000, 50000, 100000, 200000, 500000];

// Providers by type
const phoneProviders = ['Viettel', 'Mobifone', 'Vinaphone', 'Vietnamobile'];
const gameProviders = ['Garena', 'VTC', 'Gate', 'Zing', 'FPT'];
const bankProviders = ['VCB', 'TCB', 'MB', 'ACB', 'BIDV', 'VPBank', 'TPBank', 'Momo', 'ZaloPay', 'VNPay'];

function generateRandomId(): string {
    return 'TXN' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function generatePlayerId(): string {
    return 'MC' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

function generatePlayerName(): string {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${firstName}_${suffix}`;
}

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomDate(startDate: Date, endDate: Date): Date {
    const start = startDate.getTime();
    const end = endDate.getTime();
    return new Date(start + Math.random() * (end - start));
}

function generateTransaction(startDate: Date, endDate: Date): Transaction {
    // Weighted random for payment type (phone cards most popular)
    const typeRandom = Math.random();
    let type: PaymentType;
    let amount: number;
    let provider: string;

    if (typeRandom < 0.45) {
        // 45% phone cards
        type = 'phone_card';
        amount = getRandomElement(phoneCardAmounts);
        provider = getRandomElement(phoneProviders);
    } else if (typeRandom < 0.75) {
        // 30% game cards
        type = 'game_card';
        amount = getRandomElement(gameCardAmounts);
        provider = getRandomElement(gameProviders);
    } else {
        // 25% bank transfers
        type = 'bank_transfer';
        amount = getRandomElement(bankTransferAmounts);
        provider = getRandomElement(bankProviders);
    }

    // Status distribution: 85% success, 10% pending, 5% failed
    const statusRandom = Math.random();
    let status: TransactionStatus;
    if (statusRandom < 0.85) {
        status = 'success';
    } else if (statusRandom < 0.95) {
        status = 'pending';
    } else {
        status = 'failed';
    }

    const createdAt = generateRandomDate(startDate, endDate);

    return {
        id: generateRandomId(),
        playerName: generatePlayerName(),
        playerId: generatePlayerId(),
        amount,
        type,
        provider,
        status,
        createdAt: createdAt.toISOString(),
    };
}

function generateTransactions(count: number): Transaction[] {
    // Date range: January 2025 to January 2026 (current)
    const startDate = new Date('2025-01-01T00:00:00');
    const endDate = new Date('2026-01-29T23:59:59');

    const transactions: Transaction[] = [];

    for (let i = 0; i < count; i++) {
        transactions.push(generateTransaction(startDate, endDate));
    }

    // Sort by date descending (newest first)
    transactions.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return transactions;
}

// Generate and save data
function main() {
    console.log('🎮 Generating 1000 fake transaction records...');

    const transactions = generateTransactions(1000);

    // Ensure data directory exists
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write to JSON file
    const outputPath = path.join(dataDir, 'transactions.json');
    fs.writeFileSync(outputPath, JSON.stringify(transactions, null, 2), 'utf-8');

    // Print summary
    const summary = {
        total: transactions.length,
        byType: {
            phone_card: transactions.filter(t => t.type === 'phone_card').length,
            game_card: transactions.filter(t => t.type === 'game_card').length,
            bank_transfer: transactions.filter(t => t.type === 'bank_transfer').length,
        },
        byStatus: {
            success: transactions.filter(t => t.status === 'success').length,
            pending: transactions.filter(t => t.status === 'pending').length,
            failed: transactions.filter(t => t.status === 'failed').length,
        },
        totalRevenue: transactions
            .filter(t => t.status === 'success')
            .reduce((sum, t) => sum + t.amount, 0),
    };

    console.log('✅ Generated successfully!');
    console.log(`📁 Output: ${outputPath}`);
    console.log('\n📊 Summary:');
    console.log(`   Total records: ${summary.total}`);
    console.log(`   Phone cards: ${summary.byType.phone_card}`);
    console.log(`   Game cards: ${summary.byType.game_card}`);
    console.log(`   Bank transfers: ${summary.byType.bank_transfer}`);
    console.log(`   Success: ${summary.byStatus.success}`);
    console.log(`   Pending: ${summary.byStatus.pending}`);
    console.log(`   Failed: ${summary.byStatus.failed}`);
    console.log(`   Total Revenue: ${summary.totalRevenue.toLocaleString('vi-VN')} VND`);
}

main();
