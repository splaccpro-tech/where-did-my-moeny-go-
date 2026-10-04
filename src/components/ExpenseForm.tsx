import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CategoryId, CATEGORIES, Expense } from '../types';
import { getTodayDateString } from '../utils/formatters';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<CategoryId>('food');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount.trim());
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid expense amount greater than 0.');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a short description for this expense.');
      return;
    }

    if (!date) {
      setError('Please select a valid date.');
      return;
    }

    onAddExpense({
      amount: parsedAmount,
      category,
      description: description.trim(),
      date,
    });

    // Reset form fields (retain date for convenience)
    setAmount('');
    setDescription('');
  };

  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Add Expense</h2>
          <p className="text-xs text-zinc-500">Record a new spending transaction</p>
        </div>
        <span className="text-xs text-zinc-400">All fields required</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Amount Input */}
          <div>
            <label htmlFor="expense-amount" className="block text-xs font-medium text-zinc-700 mb-1">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-400">
                ₹
              </span>
              <input
                id="expense-amount"
                type="number"
                step="any"
                min="1"
                placeholder="250"
                value={amount}
                onChange={e => {
                  setAmount(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full pl-7 pr-3 py-2 text-sm bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors font-mono tabular-nums"
                required
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="expense-category" className="block text-xs font-medium text-zinc-700 mb-1">
              Category
            </label>
            <select
              id="expense-category"
              value={category}
              onChange={e => setCategory(e.target.value as CategoryId)}
              className="w-full px-3 py-2 text-sm bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors cursor-pointer"
            >
              {Object.values(CATEGORIES).map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Short Description */}
          <div>
            <label htmlFor="expense-desc" className="block text-xs font-medium text-zinc-700 mb-1">
              Description
            </label>
            <input
              id="expense-desc"
              type="text"
              placeholder="e.g. Lunch with friends"
              value={description}
              maxLength={80}
              onChange={e => {
                setDescription(e.target.value);
                if (error) setError(null);
              }}
              className="w-full px-3 py-2 text-sm bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors"
              required
            />
          </div>

          {/* Date Picker */}
          <div>
            <label htmlFor="expense-date" className="block text-xs font-medium text-zinc-700 mb-1">
              Date
            </label>
            <input
              id="expense-date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors"
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 font-medium">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-zinc-400 hidden sm:block">
            Quick tip: Format example: ₹250 · Food · Lunch · Today
          </p>
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 active:scale-[0.99] transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
};
