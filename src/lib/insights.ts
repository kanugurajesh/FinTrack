import { Transaction, Insight } from '@/types';
import { getCategoryBreakdown, getMonthlyExpenses, getMonthlyIncome, getTotals } from './computations';
import { format, parseISO, subMonths } from 'date-fns';

export function generateInsights(transactions: Transaction[]): Insight[] {
  const insights: Insight[] = [];

  if (transactions.length === 0) return insights;

  const now = new Date('2026-03-31'); // relative to our mock data's "present"
  const currentMonth = format(now, 'MMM yyyy');
  const prevMonth = format(subMonths(now, 1), 'MMM yyyy');
  const prevPrevMonth = format(subMonths(now, 2), 'MMM yyyy');

  const currentExpenses = getMonthlyExpenses(transactions, currentMonth);
  const prevExpenses = getMonthlyExpenses(transactions, prevMonth);
  const currentIncome = getMonthlyIncome(transactions, currentMonth);
  const prevIncome = getMonthlyIncome(transactions, prevMonth);

  // 1. Month-over-month expense change
  if (prevExpenses > 0 && currentExpenses > 0) {
    const change = ((currentExpenses - prevExpenses) / prevExpenses) * 100;
    const abs = Math.abs(change).toFixed(1);
    if (change > 10) {
      insights.push({
        id: 'expense-increase',
        icon: 'TrendingUp',
        title: 'Spending Increased',
        description: `Your expenses in ${currentMonth} are ${abs}% higher than ${prevMonth} ($${currentExpenses.toFixed(0)} vs $${prevExpenses.toFixed(0)}). Consider reviewing discretionary spending.`,
        severity: 'warning',
      });
    } else if (change < -5) {
      insights.push({
        id: 'expense-decrease',
        icon: 'TrendingDown',
        title: 'Great Spending Control',
        description: `You reduced expenses by ${abs}% compared to ${prevMonth}. Keep it up!`,
        severity: 'positive',
      });
    }
  }

  // 2. Savings rate
  if (currentIncome > 0) {
    const savings = currentIncome - currentExpenses;
    const rate = (savings / currentIncome) * 100;
    const prevSavings = prevIncome - prevExpenses;
    const prevRate = prevIncome > 0 ? (prevSavings / prevIncome) * 100 : 0;

    if (rate >= 20) {
      insights.push({
        id: 'savings-rate',
        icon: 'PiggyBank',
        title: 'Healthy Savings Rate',
        description: `You saved ${rate.toFixed(0)}% of your income this month${prevRate > 0 ? `, up from ${prevRate.toFixed(0)}% last month` : ''}. Financial advisors recommend at least 20%.`,
        severity: 'positive',
      });
    } else if (rate > 0) {
      insights.push({
        id: 'savings-rate',
        icon: 'PiggyBank',
        title: 'Low Savings Rate',
        description: `Your savings rate is ${rate.toFixed(0)}% this month. Try to aim for 20% or more by reducing non-essential expenses.`,
        severity: 'warning',
      });
    }
  }

  // 3. Top spending category
  const breakdown = getCategoryBreakdown(transactions);
  if (breakdown.length > 0) {
    const top = breakdown[0];
    insights.push({
      id: 'top-category',
      icon: 'ShoppingCart',
      title: `Top Spend: ${top.category}`,
      description: `${top.category} accounts for ${top.percentage.toFixed(1)}% of your total expenses ($${top.amount.toFixed(0)} across ${top.count} transactions).`,
      severity: top.percentage > 40 ? 'warning' : 'neutral',
    });
  }

  // 4. Housing ratio warning
  const housingExpenses = transactions
    .filter((t) => t.type === 'expense' && t.category === 'Housing')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = getTotals(transactions).income;
  if (totalIncome > 0 && housingExpenses > 0) {
    const ratio = (housingExpenses / totalIncome) * 100;
    if (ratio > 30) {
      insights.push({
        id: 'housing-ratio',
        icon: 'Home',
        title: 'High Housing Cost',
        description: `You're spending ${ratio.toFixed(0)}% of income on housing. Financial advisors recommend keeping this under 30%.`,
        severity: 'warning',
      });
    } else {
      insights.push({
        id: 'housing-ratio',
        icon: 'Home',
        title: 'Housing Cost on Track',
        description: `Housing is ${ratio.toFixed(0)}% of your total income — within the recommended 30% threshold.`,
        severity: 'positive',
      });
    }
  }

  // 5. Entertainment spike check
  const currentEntertainment = transactions
    .filter(
      (t) =>
        t.type === 'expense' &&
        t.category === 'Entertainment' &&
        format(parseISO(t.date), 'MMM yyyy') === currentMonth
    )
    .reduce((sum, t) => sum + t.amount, 0);
  const prevEntertainment = transactions
    .filter(
      (t) =>
        t.type === 'expense' &&
        t.category === 'Entertainment' &&
        format(parseISO(t.date), 'MMM yyyy') === prevMonth
    )
    .reduce((sum, t) => sum + t.amount, 0);

  if (prevEntertainment > 0 && currentEntertainment > prevEntertainment * 1.3) {
    const change = (((currentEntertainment - prevEntertainment) / prevEntertainment) * 100).toFixed(0);
    insights.push({
      id: 'entertainment-spike',
      icon: 'Tv',
      title: 'Entertainment Spending Spike',
      description: `Entertainment costs jumped ${change}% this month ($${currentEntertainment.toFixed(0)} vs $${prevEntertainment.toFixed(0)} last month).`,
      severity: 'warning',
    });
  }

  // 6. Freelance income trend
  const currentFreelance = getMonthlyIncome(
    transactions.filter((t) => t.category === 'Freelance'),
    currentMonth
  );
  const prevFreelance = getMonthlyIncome(
    transactions.filter((t) => t.category === 'Freelance'),
    prevMonth
  );
  const prevPrevFreelance = getMonthlyIncome(
    transactions.filter((t) => t.category === 'Freelance'),
    prevPrevMonth
  );

  if (currentFreelance > 0 && prevFreelance > 0 && currentFreelance >= prevFreelance) {
    insights.push({
      id: 'freelance-income',
      icon: 'Briefcase',
      title: 'Freelance Income Stable',
      description: `You earned $${currentFreelance.toFixed(0)} in freelance income this month${prevPrevFreelance > 0 ? ` (3-month average: $${((currentFreelance + prevFreelance + prevPrevFreelance) / 3).toFixed(0)})` : ''}.`,
      severity: 'positive',
    });
  }

  return insights;
}
