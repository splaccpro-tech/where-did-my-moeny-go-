import React from 'react';
import { CategoryId, CATEGORIES } from '../types';
import { formatINR } from '../utils/formatters';
import { DonutChart } from './DonutChart';

export interface CategorySummary {
  id: CategoryId;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  amount: number;
  percentage: number;
  count: number;
}

interface CategoryBreakdownProps {
  categorySummaries: CategorySummary[];
  totalSpent: number;
  activeCategory: CategoryId | null;
  onHoverCategory: (id: CategoryId | null) => void;
  onSelectCategoryFilter?: (id: CategoryId | 'all') => void;
  selectedCategoryFilter?: CategoryId | 'all';
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categorySummaries,
  totalSpent,
  activeCategory,
  onHoverCategory,
  onSelectCategoryFilter,
  selectedCategoryFilter,
}) => {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Spending Breakdown</h2>
          <p className="text-xs text-zinc-500">Distribution across categories</p>
        </div>
        {selectedCategoryFilter && selectedCategoryFilter !== 'all' && (
          <button
            onClick={() => onSelectCategoryFilter?.('all')}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Reset filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
        {/* Donut Chart section */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-100 pb-4 lg:pb-0 lg:pr-4">
          <DonutChart
            slices={categorySummaries}
            totalSpent={totalSpent}
            activeCategory={activeCategory}
            onHoverCategory={onHoverCategory}
          />
        </div>

        {/* Categories list section */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {categorySummaries.map(cat => {
            const isHovered = activeCategory === cat.id;
            const isFiltered = selectedCategoryFilter === cat.id;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => onHoverCategory(cat.id)}
                onMouseLeave={() => onHoverCategory(null)}
                onClick={() => onSelectCategoryFilter?.(isFiltered ? 'all' : cat.id)}
                className={`group p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isHovered || isFiltered
                    ? 'border-zinc-300 bg-zinc-50'
                    : 'border-transparent hover:border-zinc-200 hover:bg-zinc-50/60'
                }`}
                title={`Click to filter expenses by ${cat.name}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{cat.emoji}</span>
                    <span className="text-sm font-medium text-zinc-900 truncate">
                      {cat.name}
                    </span>
                    <span className="text-xs text-zinc-400 font-normal shrink-0">
                      ({cat.count})
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold text-zinc-600 font-mono tabular-nums">
                      {cat.percentage.toFixed(1)}%
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 font-mono tabular-nums w-20 text-right">
                      {formatINR(cat.amount)}
                    </span>
                  </div>
                </div>

                {/* Clean progress ratio bar */}
                <div className="mt-2 w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.max(0, cat.percentage))}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
