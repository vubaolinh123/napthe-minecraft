/**
 * Enhanced script to generate fake transaction data for Minecraft top-up statistics
 * Monthly revenue targets based on seasonal patterns
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
// AMOUNTS & PROVIDERS
// ============================================
const phoneProviders = ['Viettel', 'Mobifone', 'Vinaphone', 'Vietnamobile'];
const gameProviders = ['Garena', 'VTC Gate', 'Zing', 'FPT', 'Gcoin', 'Steam'];
const bankProviders = ['VCB', 'TCB', 'MB Bank', 'ACB', 'BIDV', 'VPBank', 'Momo', 'ZaloPay', 'VNPay'];

// MONTHLY REVENUE TARGETS (in VND)
const MONTHLY_REVENUE_TARGETS = {
  1: { min: 20000000, max: 30000000 },   // Jan: 20-30M
  2: { min: 22000000, max: 28000000 },   // Feb: 22-28M
  3: { min: 25000000, max: 32000000 },   // Mar: 25-32M
  4: { min: 40000000, max: 50000000 },   // Apr: 40-50M
  5: { min: 45000000, max: 55000000 },   // May: 45-55M
  6: { min: 50000000, max: 60000000 },   // Jun: 50-60M
  7: { min: 55000000, max: 65000000 },   // Jul: 55-65M
  8: { min: 50000000, max: 60000000 },   // Aug: 50-60M
  9: { min: 30000000, max: 38000000 },   // Sep: 30-38M
  10: { min: 25000000, max: 32000000 },  // Oct: 25-32M
  11: { min: 18000000, max: 25000000 },  // Nov: 18-25M
  12: { min: 15000000, max: 22000000 },  // Dec: 15-22M
};

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

// ============================================
// MAIN GENERATION - Revenue-controlled approach
// ============================================
function generateMonthData(year, month, targetRevenue) {
  const transactions = [];
  const daysInMonth = getDaysInMonth(year, month);
  
  // Calculate average amount per successful transaction to hit target
  // Aim for ~50-70 transactions per day, ~85% success rate
  const avgTxPerDay = 60;
  const successRate = 0.85;
  const totalExpectedSuccessTx = daysInMonth * avgTxPerDay * successRate;
  const targetAvgAmount = targetRevenue / totalExpectedSuccessTx;
  
  // Amount pools based on target average
  let amountsPool;
  if (targetAvgAmount < 15000) {
    amountsPool = [10000, 10000, 10000, 20000, 20000, 30000]; // Heavy on small
  } else if (targetAvgAmount < 25000) {
    amountsPool = [10000, 20000, 20000, 30000, 50000]; 
  } else if (targetAvgAmount < 40000) {
    amountsPool = [20000, 30000, 50000, 50000, 100000];
  } else {
    amountsPool = [30000, 50000, 100000, 100000, 200000];
  }
  
  // Bank amounts (can be odd)
  const bankPool = [15000, 25000, 35000, 50000, 75000, 100000, 150000];
  
  let monthRevenue = 0;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const txCount = isWeekend ? getRandomInRange(55, 75) : getRandomInRange(45, 65);
    
    // Calculate remaining target
    const remainingDays = daysInMonth - day + 1;
    const remainingTarget = targetRevenue - monthRevenue;
    const dailyTarget = remainingTarget / remainingDays;
    let dailyRevenue = 0;
    
    for (let i = 0; i < txCount; i++) {
      // Payment type
      const typeRnd = Math.random();
      let type, provider, amount;
      
      if (typeRnd < 0.45) {
        type = 'phone_card';
        provider = getRandomElement(phoneProviders);
        amount = getRandomElement(amountsPool);
      } else if (typeRnd < 0.75) {
        type = 'game_card';
        provider = getRandomElement(gameProviders);
        amount = getRandomElement(amountsPool);
      } else {
        type = 'bank_transfer';
        provider = getRandomElement(bankProviders);
        amount = getRandomElement(bankPool);
      }
      
      // Adjust amount if we're approaching target
      if (dailyRevenue > dailyTarget * 0.8 && Math.random() > 0.3) {
        // Reduce amount for remaining transactions
        amount = Math.min(amount, 20000);
      }
      
      // Status
      const statusRnd = Math.random();
      let status;
      if (statusRnd < 0.85) {
        status = 'success';
        // Only add to revenue if success
        dailyRevenue += amount;
        monthRevenue += amount;
      } else if (statusRnd < 0.95) {
        status = 'pending';
      } else {
        status = 'failed';
      }
      
      // Random time
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
  
  return { transactions, actualRevenue: monthRevenue };
}

function main() {
  console.log('🎮 Generating transaction data with revenue targets...\n');
  
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
    const targetKey = year === 2026 ? 1 : month;
    const target = MONTHLY_REVENUE_TARGETS[targetKey];
    const targetRevenue = getRandomInRange(target.min, target.max);
    
    const { transactions, actualRevenue } = generateMonthData(year, month, targetRevenue);
    allTransactions.push(...transactions);
    
    const key = `${year}-${month.toString().padStart(2, '0')}`;
    monthlyStats[key] = { target: targetRevenue, actual: actualRevenue, count: transactions.length };
  }
  
  // Sort descending by date
  allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Save
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  
  const outputPath = path.join(dataDir, 'transactions.json');
  fs.writeFileSync(outputPath, JSON.stringify(allTransactions, null, 2), 'utf-8');
  
  // Summary
  const successTx = allTransactions.filter(t => t.status === 'success');
  const totalRevenue = successTx.reduce((sum, t) => sum + t.amount, 0);
  
  console.log('✅ Generated successfully!');
  console.log(`📁 Output: ${outputPath}`);
  console.log(`\n📊 Summary: ${allTransactions.length.toLocaleString()} records, ${(totalRevenue/1000000).toFixed(1)}M VND total\n`);
  
  console.log('📈 Monthly Breakdown:');
  Object.entries(monthlyStats).sort((a, b) => a[0].localeCompare(b[0])).forEach(([m, s]) => {
    const accuracy = ((s.actual / s.target) * 100).toFixed(0);
    console.log(`   ${m}: ${(s.actual/1000000).toFixed(1)}M / ${(s.target/1000000).toFixed(1)}M target (${accuracy}%) - ${s.count} tx`);
  });
}

main();
