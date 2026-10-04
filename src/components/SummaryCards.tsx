import React from 'react';
import { formatINR, getCurrentMonthName } from '../utils/formatters';

interface SummaryCardsProps {
  totalSpent: number;
  thisMonthSpent: number;
  expenseCount: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalSpent,
  thisMonthSpent,
  expenseCount,
}) => {
  const currentMonth = getCurrentMonthName();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Spent Card */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500 uppercase tracking-wider">
          <span>Total Spent</span>
          <span className="text-zinc-400">All time</span>
        </div>
        <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono tabular-nums">
          {formatINR(totalSpent)}
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Cumulative recorded spending
        </p>
      </div>

      {/* This Month Card */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500 uppercase tracking-wider">
          <span>This Month</span>
          <span className="text-zinc-400">{currentMonth.split(' ')[0]}</span>
        </div>
        <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono tabular-nums">
          {formatINR(thisMonthSpent)}
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Spending in {currentMonth}
        </p>
      </div>

      {/* Number of Expenses Card */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500 uppercase tracking-wider">
          <span>Number of Expenses</span>
          <span className="text-zinc-400">Entries</span>
        </div>
        <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono tabular-nums">
          {expenseCount}
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          {expenseCount === 1 ? '1 active transaction' : `${expenseCount} active transactions`}
        </p>
      </div>
    </div>
  );
};
