/**
 * Generate fake transaction data with exact monthly revenue targets
 * Includes operating costs and profit/loss calculations
 * Run with: node scripts/generateData.js
 */

const fs = require('fs');
const path = require('path');

// ============================================
// PLAYER NAME GENERATION
// ============================================
const vnFirstNames = ['Minh', 'Hoang', 'Anh', 'Hung', 'Duc', 'Tuan', 'Long', 'Phong', 'Khang', 'Bao', 
  'Nam', 'Dung', 'Tai', 'Kien', 'Thang', 'Hieu', 'Vinh', 'Quang', 'Hai', 'Cuong',
  'Dat', 'Huy', 'Trung', 'Thanh', 'Son', 'Duong', 'Nhat', 'Quan', 'Thinh', 'Viet'];

const animeNames = ['Kirito', 'Naruto', 'Sasuke', 'Goku', 'Vegeta', 'Luffy', 'Zoro', 'Ichigo', 
  'Natsu', 'Eren', 'Levi', 'Mikasa', 'Kaneki', 'Tanjiro', 'Todoroki', 'Deku', 'Bakugo',
  'Gojo', 'Sukuna', 'Itachi', 'Kakashi', 'Madara', 'Rimuru', 'Ainz', 'Saitama', 'Genos',
  'Light', 'Lelouch', 'Edward', 'Mustang', 'Spike', 'Gintoki', 'Roronoa', 'Shanks',
  'Yagami', 'Asta', 'Yuno', 'Tatsumaki', 'Fubuki', 'Nezuko', 'Zenitsu', 'Inosuke'];

const suffixes = ['Pro', 'Gaming', 'MC', 'VN', 'PVP', 'HD', 'YT', 'TTV', 'XD', 'OP', 
  'Noob', 'King', 'Boss', 'God', 'Legend', 'Master', 'Sama', 'Kun', 'Chan', 'San'];

function generateNamePool() {
  const names = new Set();
  animeNames.forEach(anime => {
    vnFirstNames.slice(0, 10).forEach(vn => names.add(`${anime}_${vn}`));
  });
  vnFirstNames.slice(0, 10).forEach(vn => {
    animeNames.slice(0, 20).forEach(anime => names.add(`${vn}${anime}`));
  });
  animeNames.forEach(anime => {
    suffixes.forEach(suffix => names.add(`${anime}${suffix}`));
  });
  vnFirstNames.forEach(vn => {
    suffixes.slice(0, 10).forEach(suffix => names.add(`${vn}_${suffix}`));
  });
  return Array.from(names);
}

const NAME_POOL = generateNamePool();
console.log(`📝 Generated ${NAME_POOL.length} unique player names`);

// ============================================
// PROVIDERS
// ============================================
const phoneProviders = ['Viettel', 'Mobifone', 'Vinaphone', 'Vietnamobile'];
const gameProviders = ['Garena', 'VTC Gate', 'Zing', 'FPT', 'Gcoin', 'Steam'];
const bankProviders = ['VCB', 'TCB', 'MB Bank', 'ACB', 'BIDV', 'VPBank', 'Momo', 'ZaloPay', 'VNPay'];

// ============================================
// MONTHLY REVENUE & COSTS DATA
// Profit formula: profit = revenue - costs
// ============================================

// User specifications:
// Jan 2025: NO revenue
// Feb 2025: NO revenue
// Mar 2025: ~20M revenue, -8M loss (costs 28M)
// Apr 2025: NO revenue
// May 2025: 35M revenue, 5M profit (costs 30M)
// Jun-Oct 2025: costs 37M
// Nov 2025+: costs 47M

const MONTHLY_DATA = {
  // Phase 1: costs 28M (VPS 12M) - LOSS months unchanged
  '2025-01': { revenue: 0, costs: 28000000, targetProfit: -28000000 },         // No revenue = -28M loss
  '2025-02': { revenue: 0, costs: 28000000, targetProfit: -28000000 },         // No revenue = -28M loss
  '2025-03': { revenue: 20000000, costs: 28000000, targetProfit: -8000000 },   // ~20M revenue = -8M loss
  '2025-04': { revenue: 0, costs: 28000000, targetProfit: -28000000 },         // No revenue = -28M loss
  
  // Phase 2: costs 28M - Profitable months get +5M
  '2025-05': { revenue: 40000000, costs: 28000000, targetProfit: 12000000 },   // 7M+5M = 12M profit
  
  // Phase 3: costs 37M (VPS 21M) - Profitable months get +5M
  '2025-06': { revenue: 52000000, costs: 37000000, targetProfit: 15000000 },   // 10M+5M = 15M profit
  '2025-07': { revenue: 55000000, costs: 37000000, targetProfit: 18000000 },   // 13M+5M = 18M profit
  '2025-08': { revenue: 56000000, costs: 37000000, targetProfit: 19000000 },   // 14M+5M = 19M profit
  '2025-09': { revenue: 60000000, costs: 37000000, targetProfit: 23000000 },   // 18M+5M = 23M profit
  '2025-10': { revenue: 57000000, costs: 37000000, targetProfit: 20000000 },   // 15M+5M = 20M profit
  
  // Phase 4: costs 47M (VPS 25M, Admin 9M) - Profitable months get +5M
  '2025-11': { revenue: 72000000, costs: 47000000, targetProfit: 25000000 },   // 20M+5M = 25M profit
  '2025-12': { revenue: 74000000, costs: 47000000, targetProfit: 27000000 },   // 22M+5M = 27M profit
  '2026-01': { revenue: 77000000, costs: 47000000, targetProfit: 30000000 },   // 25M+5M = 30M profit
};

// Cost breakdown by phase
const COST_PHASES = [
  {
    period: '2025-01 to 2025-04',
    months: ['2025-01', '2025-02', '2025-03', '2025-04'],
    breakdown: {
      dev: 8000000,
      design: 5000000,
      admin: 3000000,
      adminCount: 1,
      vps: 12000000,
    },
    total: 28000000,
  },
  {
    period: '2025-05',
    months: ['2025-05'],
    breakdown: {
      dev: 8000000,
      design: 5000000,
      admin: 3000000,
      adminCount: 1,
      vps: 12000000,
    },
    total: 28000000,
  },
  {
    period: '2025-06 to 2025-10',
    months: ['2025-06', '2025-07', '2025-08', '2025-09', '2025-10'],
    breakdown: {
      dev: 8000000,
      design: 5000000,
      admin: 3000000,
      adminCount: 1,
      vps: 21000000,
    },
    total: 37000000,
  },
  {
    period: '2025-11 onwards',
    months: ['2025-11', '2025-12', '2026-01'],
    breakdown: {
      dev: 8000000,
      design: 5000000,
      admin: 9000000,
      adminCount: 3,
      vps: 25000000,
    },
    total: 47000000,
  },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function generateRandomId() {
  return 'TXN' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function generatePlayerId() {
  return 'MC' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

// Generate random decimal amount close to target (e.g., 50256197 instead of 50000000)
function addRandomVariation(baseAmount, variationPercent = 0.02) {
  const variation = baseAmount * variationPercent;
  const randomOffset = Math.floor(Math.random() * variation * 2 - variation);
  // Add random hundreds/thousands for "lẻ" effect
  const randomDecimals = getRandomInRange(1000, 999999);
  return baseAmount + randomOffset + randomDecimals - (baseAmount % 1000000);
}

// ============================================
// TRANSACTION GENERATION
// ============================================

function generateMonthData(year, month, targetRevenue) {
  const transactions = [];
  
  // If no revenue for this month, return empty
  if (targetRevenue === 0) {
    return { transactions: [], actualRevenue: 0 };
  }
  
  const daysInMonth = getDaysInMonth(year, month);
  let currentRevenue = 0;
  
  // Amount pools with varied values (not round numbers)
  const smallAmounts = [10000, 15000, 20000, 25000, 30000, 35000, 50000];
  const mediumAmounts = [75000, 100000, 125000, 150000, 200000, 250000];
  const largeAmounts = [300000, 500000, 750000, 1000000, 1500000, 2000000];
  
  // Bank amounts (can include odd values)
  const bankAmounts = [13500, 27000, 45000, 67500, 89000, 125000, 178000, 235000, 450000];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const isWeekend = new Date(year, month - 1, day).getDay() % 6 === 0;
    
    // Calculate remaining and daily target
    const remainingDays = daysInMonth - day + 1;
    const remainingTarget = targetRevenue - currentRevenue;
    const dailyTarget = remainingTarget / remainingDays;
    
    // Adjust tx count based on remaining target
    const baseTxCount = isWeekend ? 60 : 50;
    const txCount = Math.max(30, Math.min(baseTxCount, Math.ceil(dailyTarget / 50000)));
    
    let dailyRevenue = 0;
    
    for (let i = 0; i < txCount && currentRevenue < targetRevenue * 1.05; i++) {
      const typeRnd = Math.random();
      let type, provider, amount;
      
      // Determine amount size based on remaining target
      const avgNeeded = (targetRevenue - currentRevenue) / Math.max(1, (daysInMonth - day) * 40);
      
      if (typeRnd < 0.45) {
        type = 'phone_card';
        provider = getRandomElement(phoneProviders);
        amount = avgNeeded > 100000 ? getRandomElement([...mediumAmounts, ...largeAmounts]) : getRandomElement(smallAmounts);
      } else if (typeRnd < 0.75) {
        type = 'game_card';
        provider = getRandomElement(gameProviders);
        amount = avgNeeded > 100000 ? getRandomElement([...mediumAmounts, ...largeAmounts]) : getRandomElement(smallAmounts);
      } else {
        type = 'bank_transfer';
        provider = getRandomElement(bankProviders);
        amount = getRandomElement(bankAmounts);
      }
      
      // Status: 88% success, 8% pending, 4% failed
      const statusRnd = Math.random();
      let status;
      if (statusRnd < 0.88) {
        status = 'success';
        dailyRevenue += amount;
        currentRevenue += amount;
      } else if (statusRnd < 0.96) {
        status = 'pending';
      } else {
        status = 'failed';
      }
      
      const hour = getRandomInRange(7, 23);
      const txDate = new Date(year, month - 1, day, hour, getRandomInRange(0, 59), getRandomInRange(0, 59));
      
      transactions.push({
        id: generateRandomId(),
        playerName: getRandomElement(NAME_POOL),
        playerId: generatePlayerId(),
        amount,
        type,
        provider,
        status,
        createdAt: txDate.toISOString(),
      });
    }
  }
  
  return { transactions, actualRevenue: currentRevenue };
}

// ============================================
// EXPENSES DATA GENERATION
// ============================================

function generateExpensesData(monthlyStats) {
  const expenses = [];
  
  Object.entries(MONTHLY_DATA).forEach(([month, data]) => {
    // Find the cost phase for this month
    const phase = COST_PHASES.find(p => p.months.includes(month));
    if (!phase) return;
    
    // Use actual revenue from generated transactions for realistic numbers
    const actualRevenue = monthlyStats[month]?.actual || data.revenue;
    const actualProfit = actualRevenue - phase.total;
    
    expenses.push({
      month,
      revenue: actualRevenue,
      costs: {
        dev: phase.breakdown.dev,
        design: phase.breakdown.design,
        admin: phase.breakdown.admin,
        adminCount: phase.breakdown.adminCount,
        vps: phase.breakdown.vps,
        total: phase.total,
      },
      profit: actualProfit,
    });
  });
  
  return expenses;
}

// ============================================
// MAIN
// ============================================

function main() {
  console.log('🎮 Generating transaction data with exact monthly targets...\n');
  
  const allTransactions = [];
  const monthlyStats = {};
  
  const months = [
    { year: 2025, month: 1 }, { year: 2025, month: 2 }, { year: 2025, month: 3 },
    { year: 2025, month: 4 }, { year: 2025, month: 5 }, { year: 2025, month: 6 },
    { year: 2025, month: 7 }, { year: 2025, month: 8 }, { year: 2025, month: 9 },
    { year: 2025, month: 10 }, { year: 2025, month: 11 }, { year: 2025, month: 12 },
    { year: 2026, month: 1 },
  ];
  
  for (const { year, month } of months) {
    const key = `${year}-${month.toString().padStart(2, '0')}`;
    const data = MONTHLY_DATA[key];
    
    if (!data) continue;
    
    const { transactions, actualRevenue } = generateMonthData(year, month, data.revenue);
    allTransactions.push(...transactions);
    
    const profit = actualRevenue - data.costs;
    monthlyStats[key] = {
      target: data.revenue,
      actual: actualRevenue,
      costs: data.costs,
      profit: profit,
      count: transactions.length,
    };
  }
  
  // Sort descending by date
  allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Ensure data directory exists
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  
  // Save transactions
  const txPath = path.join(dataDir, 'transactions.json');
  fs.writeFileSync(txPath, JSON.stringify(allTransactions, null, 2), 'utf-8');
  
  // Generate and save expenses with actual revenue data
  const expenses = generateExpensesData(monthlyStats);
  const expPath = path.join(dataDir, 'expenses.json');
  fs.writeFileSync(expPath, JSON.stringify(expenses, null, 2), 'utf-8');
  
  // Summary
  const successTx = allTransactions.filter(t => t.status === 'success');
  const totalRevenue = successTx.reduce((sum, t) => sum + t.amount, 0);
  const totalCosts = Object.values(MONTHLY_DATA).reduce((sum, d) => sum + d.costs, 0);
  const totalProfit = totalRevenue - totalCosts;
  
  console.log('✅ Generated successfully!');
  console.log(`📁 Transactions: ${txPath}`);
  console.log(`📁 Expenses: ${expPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   Total records: ${allTransactions.length.toLocaleString('vi-VN')}`);
  console.log(`   Total Revenue: ${totalRevenue.toLocaleString('vi-VN')} VND`);
  console.log(`   Total Costs: ${totalCosts.toLocaleString('vi-VN')} VND`);
  console.log(`   Net Profit: ${totalProfit.toLocaleString('vi-VN')} VND`);
  
  console.log('\n📈 Monthly Breakdown:');
  Object.entries(monthlyStats).sort((a, b) => a[0].localeCompare(b[0])).forEach(([m, s]) => {
    const profitStr = s.profit >= 0 ? `+${(s.profit/1000000).toFixed(1)}M` : `${(s.profit/1000000).toFixed(1)}M`;
    const status = s.profit >= 0 ? '✅' : '❌';
    console.log(`   ${m}: ${(s.actual/1000000).toFixed(1)}M rev - ${(s.costs/1000000).toFixed(0)}M costs = ${profitStr} ${status} (${s.count} tx)`);
  });
}

main();
