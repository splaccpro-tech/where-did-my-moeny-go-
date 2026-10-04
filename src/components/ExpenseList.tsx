import React, { useState, useMemo } from 'react';
import { Trash2, Search, Download, RotateCcw, ArrowUpDown } from 'lucide-react';
import { Expense, CategoryId, CATEGORIES } from '../types';
import { formatINR, formatDateDisplay, exportExpensesToCSV } from '../utils/formatters';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onClearAllClick: () => void;
  onResetSampleData: () => void;
  selectedCategoryFilter: CategoryId | 'all';
  onCategoryFilterChange: (cat: CategoryId | 'all') => void;
}

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onDeleteExpense,
  onClearAllClick,
  onResetSampleData,
  selectedCategoryFilter,
  onCategoryFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Filter by category
    if (selectedCategoryFilter !== 'all') {
      result = result.filter(e => e.category === selectedCategoryFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        e =>
          e.description.toLowerCase().includes(q) ||
          CATEGORIES[e.category]?.name.toLowerCase().includes(q) ||
          e.amount.toString().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return b.date.localeCompare(a.date) || b.createdAt - a.createdAt;
        case 'date-asc':
          return a.date.localeCompare(b.date) || a.createdAt - b.createdAt;
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return result;
  }, [expenses, selectedCategoryFilter, searchTerm, sortBy]);

  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-900">Expenses History</h2>
            <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
              {filteredExpenses.length} {filteredExpenses.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Complete transaction record with live filtering
          </p>
        </div>

        {/* Global actions: CSV Export, Reset Sample, Clear All */}
        <div className="flex items-center gap-2 flex-wrap">
          {expenses.length > 0 && (
            <button
              onClick={() => exportExpensesToCSV(filteredExpenses)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Download filtered expenses as CSV file"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={onResetSampleData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Load initial starter sample data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
            <span>Sample Data</span>
          </button>

          {expenses.length > 0 && (
            <button
              onClick={onClearAllClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50/70 border border-red-200/60 rounded-lg hover:bg-red-100/70 transition-colors cursor-pointer"
              title="Delete all expenses from local storage"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-4">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search description or amount..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategoryFilter}
            onChange={e => onCategoryFilterChange(e.target.value as CategoryId | 'all')}
            className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors cursor-pointer"
          >
            <option value="all">All Categories</option>
            {Object.values(CATEGORIES).map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Option */}
        <div className="sm:col-span-3">
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2 text-xs bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors cursor-pointer appearance-none pr-7"
            >
              <option value="date-desc">Date (Newest first)</option>
              <option value="date-asc">Date (Oldest first)</option>
              <option value="amount-desc">Amount (Highest first)</option>
              <option value="amount-asc">Amount (Lowest first)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Expenses Table / List */}
      <div className="mt-4 overflow-x-auto">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-zinc-200 rounded-lg">
            <p className="text-sm font-medium text-zinc-700">No expenses found</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              {searchTerm || selectedCategoryFilter !== 'all'
                ? 'Try adjusting your search query or category filter.'
                : 'Your expense list is empty. Add a new expense above or reload sample data.'}
            </p>
            {expenses.length === 0 && (
              <button
                onClick={onResetSampleData}
                className="mt-4 px-3.5 py-1.5 text-xs font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
              >
                Load Starter Expenses
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {filteredExpenses.map(item => {
                const cat = CATEGORIES[item.category] || CATEGORIES.others;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50/70 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3 px-3 text-xs text-zinc-500 whitespace-nowrap font-mono">
                      {formatDateDisplay(item.date)}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-3 font-medium text-zinc-900 max-w-[200px] sm:max-w-xs truncate">
                      {item.description}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
                        <span className="text-sm">{cat.emoji}</span>
                        <span>{cat.name}</span>
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3 text-right font-bold text-zinc-900 font-mono tabular-nums whitespace-nowrap">
                      {formatINR(item.amount)}
                    </td>

                    {/* Delete action */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onDeleteExpense(item.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title={`Delete "${item.description}"`}
                        aria-label={`Delete ${item.description}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer summary bar */}
      {filteredExpenses.length > 0 && (
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-100 mt-2">
          <span>
            Showing {filteredExpenses.length} of {expenses.length} total recorded
          </span>
          <span className="font-mono font-medium text-zinc-700">
            Subtotal: {formatINR(filteredExpenses.reduce((sum, e) => sum + e.amount, 0))}
          </span>
        </div>
      )}
    </div>
  );
};
