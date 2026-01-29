/**
 * Enhanced script to generate fake transaction data for Minecraft top-up statistics
 * - 50+ records per day from Jan 2025 to Jan 2026
 * - Diverse anime + Vietnamese player names (200+ unique combinations)
 * - Monthly revenue targets based on seasonal patterns
 * Run with: node scripts/generateData.js
 */

const fs = require('fs');
const path = require('path');

// ============================================
// PLAYER NAME GENERATION (200+ unique names)
// ============================================

// Vietnamese first names
const vnFirstNames = ['Minh', 'Hoang', 'Anh', 'Hung', 'Duc', 'Tuan', 'Long', 'Phong', 'Khang', 'Bao', 
  'Nam', 'Dung', 'Tai', 'Kien', 'Thang', 'Hieu', 'Vinh', 'Quang', 'Hai', 'Cuong',
  'Dat', 'Huy', 'Trung', 'Thanh', 'Son', 'Duong', 'Nhat', 'Quan', 'Thinh', 'Viet'];

// Japanese/Anime names  
const animeNames = ['Kirito', 'Naruto', 'Sasuke', 'Goku', 'Vegeta', 'Luffy', 'Zoro', 'Ichigo', 
  'Natsu', 'Eren', 'Levi', 'Mikasa', 'Kaneki', 'Tanjiro', 'Todoroki', 'Deku', 'Bakugo',
  'Gojo', 'Sukuna', 'Itachi', 'Kakashi', 'Madara', 'Rimuru', 'Ainz', 'Saitama', 'Genos',
  'Light', 'Lelouch', 'Edward', 'Mustang', 'Spike', 'Gintoki', 'Roronoa', 'Shanks',
  'Yagami', 'Asta', 'Yuno', 'Tatsumaki', 'Fubuki', 'Nezuko', 'Zenitsu', 'Inosuke'];

// Gaming/Meme suffixes
const suffixes = ['Pro', 'Gaming', 'MC', 'VN', 'PVP', 'HD', 'YT', 'TTV', 'XD', 'OP', 
  'Noob', 'King', 'Boss', 'God', 'Legend', 'Master', 'Sama', 'Kun', 'Chan', 'San',
  'X', 'Z', 'Alpha', 'Omega', 'Prime', 'Ultra', 'Mega', 'Gamer', 'Streamer', 'NB'];

// Number variations
const numbers = ['', '01', '07', '69', '96', '123', '456', '789', '99', '00', '2k', '3k', 'x1', 'x2'];

// Separators for name parts
const separators = ['_', '', '.', 'x', 'X'];

// Generate unique player names pool (200+)
function generateNamePool() {
  const names = new Set();
  
  // Pattern 1: Anime + VN name
  animeNames.forEach(anime => {
    vnFirstNames.slice(0, 15).forEach(vn => {
      names.add(`${anime}_${vn}`);
    });
  });
  
  // Pattern 2: VN + Anime
  vnFirstNames.slice(0, 10).forEach(vn => {
    animeNames.slice(0, 20).forEach(anime => {
      names.add(`${vn}${anime}`);
    });
  });
  
  // Pattern 3: Anime + Suffix
  animeNames.forEach(anime => {
    suffixes.slice(0, 15).forEach(suffix => {
      names.add(`${anime}${suffix}`);
    });
  });
  
  // Pattern 4: VN + Suffix + Number
  vnFirstNames.forEach(vn => {
    suffixes.slice(0, 10).forEach(suffix => {
      numbers.slice(0, 5).forEach(num => {
        names.add(`${vn}_${suffix}${num}`);
      });
    });
  });
  
  // Pattern 5: Anime x Anime mashups
  for (let i = 0; i < animeNames.length - 1; i++) {
    names.add(`${animeNames[i]}x${animeNames[i+1]}`);
  }
  
  // Pattern 6: VN + Number + Suffix
  vnFirstNames.slice(0, 15).forEach(vn => {
    numbers.slice(1, 6).forEach(num => {
      names.add(`${vn}${num}Gaming`);
      names.add(`${vn}${num}Pro`);
    });
  });

  return Array.from(names);
}

const NAME_POOL = generateNamePool();
console.log(`📝 Generated ${NAME_POOL.length} unique player names`);

// ============================================
// PAYMENT CONFIGURATION
// ============================================

// Card amounts - must be even for phone/game cards
const phoneCardAmounts = [10000, 20000, 30000, 50000, 100000, 200000, 500000, 1000000];
const gameCardAmounts = [10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000];

// Bank transfer amounts - can be any value including odd
const bankSmallAmounts = [15000, 25000, 35000, 45000, 55000, 65000, 75000, 85000, 95000];
const bankMediumAmounts = [100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000];
const bankLargeAmounts = [500000, 750000, 1000000, 1500000, 2000000, 2500000, 3000000, 5000000];

// Providers by type
const phoneProviders = ['Viettel', 'Mobifone', 'Vinaphone', 'Vietnamobile', 'Gmobile'];
const gameProviders = ['Garena', 'VTC Gate', 'Zing', 'FPT', 'ViettelPay', 'Gcoin', 'Steam'];
const bankProviders = ['VCB', 'TCB', 'MB Bank', 'ACB', 'BIDV', 'VPBank', 'TPBank', 'Momo', 'ZaloPay', 'VNPay', 'ShopeePay'];

// ============================================
// MONTHLY REVENUE TARGETS (in VND)
// ============================================
const MONTHLY_REVENUE_TARGETS = {
  1: { min: 20000000, max: 30000000 },   // Jan: 20-30M
  2: { min: 22000000, max: 28000000 },   // Feb: 22-28M (Lunar New Year dip)
  3: { min: 25000000, max: 32000000 },   // Mar: 25-32M
  4: { min: 40000000, max: 50000000 },   // Apr: 40-50M (summer starts)
  5: { min: 45000000, max: 55000000 },   // May: 45-55M
  6: { min: 50000000, max: 60000000 },   // Jun: 50-60M (summer peak)
  7: { min: 55000000, max: 65000000 },   // Jul: 55-65M (peak summer vacation)
  8: { min: 50000000, max: 60000000 },   // Aug: 50-60M (end summer)
  9: { min: 35000000, max: 42000000 },   // Sep: 35-42M (back to school)
  10: { min: 28000000, max: 35000000 },  // Oct: 28-35M
  11: { min: 20000000, max: 28000000 },  // Nov: 20-28M
  12: { min: 15000000, max: 25000000 },  // Dec: 15-25M (year end)
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateRandomId() {
  return 'TXN' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function generatePlayerId() {
  return 'MC' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// Generate amount based on type and target average
function generateAmount(type, targetAvg) {
  // Adjust amount distribution based on target average per transaction
  let amounts;
  
  if (type === 'phone_card') {
    amounts = phoneCardAmounts;
  } else if (type === 'game_card') {
    amounts = gameCardAmounts;
  } else {
    // Bank: mix of small, medium, large based on target
    if (targetAvg < 100000) {
      amounts = [...bankSmallAmounts, ...bankMediumAmounts.slice(0, 3)];
    } else if (targetAvg < 300000) {
      amounts = [...bankMediumAmounts, ...bankLargeAmounts.slice(0, 3)];
    } else {
      amounts = [...bankMediumAmounts, ...bankLargeAmounts];
    }
  }
  
  return getRandomElement(amounts);
}

// ============================================
// TRANSACTION GENERATION BY DAY
// ============================================

function generateDayTransactions(date, targetRevenue, minTransactions = 50) {
  const transactions = [];
  let currentRevenue = 0;
  const targetAvg = targetRevenue / minTransactions;
  
  // Generate at least minTransactions
  while (transactions.length < minTransactions || currentRevenue < targetRevenue * 0.9) {
    // Prevent infinite loop
    if (transactions.length > minTransactions * 3) break;
    
    // Payment type distribution
    const typeRandom = Math.random();
    let type, provider, amount;
    
    if (typeRandom < 0.40) {
      type = 'phone_card';
      provider = getRandomElement(phoneProviders);
      amount = getRandomElement(phoneCardAmounts);
    } else if (typeRandom < 0.70) {
      type = 'game_card';
      provider = getRandomElement(gameProviders);
      amount = getRandomElement(gameCardAmounts);
    } else {
      type = 'bank_transfer';
      provider = getRandomElement(bankProviders);
      amount = generateAmount(type, targetAvg);
    }
    
    // Status distribution: 87% success, 9% pending, 4% failed
    const statusRandom = Math.random();
    let status;
    if (statusRandom < 0.87) {
      status = 'success';
      currentRevenue += amount;
    } else if (statusRandom < 0.96) {
      status = 'pending';
    } else {
      status = 'failed';
    }
    
    // Random time during the day (more active 9AM-11PM)
    const hour = getRandomInRange(0, 23);
    const minute = getRandomInRange(0, 59);
    const second = getRandomInRange(0, 59);
    const txDate = new Date(date);
    txDate.setHours(hour, minute, second, getRandomInRange(0, 999));
    
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
  
  return transactions;
}

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

function generateAllTransactions() {
  const allTransactions = [];
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2026-01-29');
  
  let currentDate = new Date(startDate);
  let monthlyStats = {};
  
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const daysInMonth = getDaysInMonth(year, month);
    
    // Get monthly target
    const monthKey = year === 2026 ? 1 : month; // Use January target for 2026
    const monthTarget = MONTHLY_REVENUE_TARGETS[monthKey];
    const monthRevenue = getRandomInRange(monthTarget.min, monthTarget.max);
    
    // Calculate daily target (with some variation)
    const dailyBaseTarget = monthRevenue / daysInMonth;
    const dailyVariation = dailyBaseTarget * 0.3; // 30% variation
    const dailyTarget = dailyBaseTarget + getRandomInRange(-dailyVariation, dailyVariation);
    
    // Weekend bonus (slightly more transactions)
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const minTx = isWeekend ? 60 : 50;
    
    // Generate day's transactions
    const dayTransactions = generateDayTransactions(currentDate, dailyTarget, minTx);
    allTransactions.push(...dayTransactions);
    
    // Track monthly stats
    const monthYearKey = `${year}-${month.toString().padStart(2, '0')}`;
    if (!monthlyStats[monthYearKey]) {
      monthlyStats[monthYearKey] = { count: 0, revenue: 0 };
    }
    dayTransactions.forEach(tx => {
      if (tx.status === 'success') {
        monthlyStats[monthYearKey].revenue += tx.amount;
      }
      monthlyStats[monthYearKey].count++;
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Sort by date descending
  allTransactions.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return { transactions: allTransactions, monthlyStats };
}

// ============================================
// RUN GENERATION
// ============================================

function main() {
  console.log('🎮 Generating enhanced transaction data...');
  console.log('📅 Date range: Jan 2025 - Jan 2026');
  console.log('📊 Target: 50+ transactions per day\n');
  
  const { transactions, monthlyStats } = generateAllTransactions();
  
  // Ensure data directory exists
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write to JSON file
  const outputPath = path.join(dataDir, 'transactions.json');
  fs.writeFileSync(outputPath, JSON.stringify(transactions, null, 2), 'utf-8');

  // Print summary
  const successTx = transactions.filter(t => t.status === 'success');
  const totalRevenue = successTx.reduce((sum, t) => sum + t.amount, 0);
  
  console.log('✅ Generated successfully!');
  console.log(`📁 Output: ${outputPath}`);
  console.log(`\n📊 Overall Summary:`);
  console.log(`   Total records: ${transactions.length.toLocaleString('vi-VN')}`);
  console.log(`   Success: ${successTx.length.toLocaleString('vi-VN')}`);
  console.log(`   Total Revenue: ${totalRevenue.toLocaleString('vi-VN')} VND`);
  
  console.log('\n📈 Monthly Revenue Breakdown:');
  Object.entries(monthlyStats)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([month, stats]) => {
      console.log(`   ${month}: ${stats.revenue.toLocaleString('vi-VN')} VND (${stats.count.toLocaleString('vi-VN')} tx)`);
    });
}

main();
