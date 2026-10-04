import React, { useState, useEffect, useMemo } from 'react';
import { CategoryId, CATEGORIES, Expense, INITIAL_EXPENSES } from './types';
import { isCurrentMonth } from './utils/formatters';
import { SummaryCards } from './components/SummaryCards';
import { CategoryBreakdown, CategorySummary } from './components/CategoryBreakdown';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ClearConfirmModal } from './components/ClearConfirmModal';

const STORAGE_KEY = 'where_did_my_money_go_expenses_v1';

export default function App() {
  // Initialize expenses from localStorage or default sample data
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to read expenses from localStorage:', e);
    }
    return INITIAL_EXPENSES;
  });

  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Sync expenses to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save expenses to localStorage:', e);
    }
  }, [expenses]);

  // Total spent calculation
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  // This month spent calculation
  const thisMonthSpent = useMemo(() => {
    return expenses
      .filter(item => isCurrentMonth(item.date))
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  // Category breakdown calculation for all 5 predefined categories
  const categorySummaries: CategorySummary[] = useMemo(() => {
    const categoryIds: CategoryId[] = ['food', 'shopping', 'transport', 'entertainment', 'others'];

    return categoryIds.map(catId => {
      const catInfo = CATEGORIES[catId];
      const matchingExpenses = expenses.filter(e => e.category === catId);
      const catTotal = matchingExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      const percentage = totalSpent > 0 ? (catTotal / totalSpent) * 100 : 0;

      return {
        id: catId,
        name: catInfo.name,
        emoji: catInfo.emoji,
        color: catInfo.color,
        bgColor: catInfo.bgColor,
        amount: catTotal,
        percentage,
        count: matchingExpenses.length,
      };
    });
  }, [expenses, totalSpent]);

  // Add new expense handler
  const handleAddExpense = (newExpenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  // Delete individual expense
  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Clear all expenses
  const handleConfirmClearAll = () => {
    setExpenses([]);
    setIsClearModalOpen(false);
  };

  // Reset sample data
  const handleResetSampleData = () => {
    setExpenses(INITIAL_EXPENSES);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-zinc-900 pb-16 selection:bg-zinc-200">
      {/* Top Header */}
      <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-xs sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shadow-xs select-none">
              ₹
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 leading-tight">
                Where Did My Money Go?
              </h1>
              <p className="text-xs text-zinc-500">
                Track your spending without the complicated stuff.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Offline localStorage</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* 1. Summary Cards */}
        <section aria-label="Spending Summary">
          <SummaryCards
            totalSpent={totalSpent}
            thisMonthSpent={thisMonthSpent}
            expenseCount={expenses.length}
          />
        </section>

        {/* 2. Spending Breakdown & Donut Chart */}
        <section aria-label="Category Breakdown">
          <CategoryBreakdown
            categorySummaries={categorySummaries}
            totalSpent={totalSpent}
            activeCategory={activeCategory}
            onHoverCategory={setActiveCategory}
            selectedCategoryFilter={selectedCategoryFilter}
            onSelectCategoryFilter={setSelectedCategoryFilter}
          />
        </section>

        {/* 3. Add Expense Form */}
        <section aria-label="Add Expense">
          <ExpenseForm onAddExpense={handleAddExpense} />
        </section>

        {/* 4. Expense List / History */}
        <section aria-label="Expense History">
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
            onClearAllClick={() => setIsClearModalOpen(true)}
            onResetSampleData={handleResetSampleData}
            selectedCategoryFilter={selectedCategoryFilter}
            onCategoryFilterChange={setSelectedCategoryFilter}
          />
        </section>
      </main>

      {/* Clear Confirmation Modal */}
      <ClearConfirmModal
        isOpen={isClearModalOpen}
        itemCount={expenses.length}
        onConfirm={handleConfirmClearAll}
        onCancel={() => setIsClearModalOpen(false)}
      />

      {/* Quiet Minimal Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 text-center text-xs text-zinc-400">
        <p>Where Did My Money Go? · Simple, private, browser-based personal finance.</p>
      </footer>
    </div>
  );
}
