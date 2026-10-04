import { Expense, CATEGORIES } from '../types';

/**
 * Format a number into Indian Rupee format with ₹ symbol
 * E.g., 250 -> ₹250, 1850 -> ₹1,850, 150000 -> ₹1,50,000
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const formatted = Math.round(amount).toLocaleString('en-IN');
  return `₹${formatted}`;
}

/**
 * Format a date string 'YYYY-MM-DD' into 'DD Mon YYYY'
 * E.g., '2026-10-04' -> '04 Oct 2026'
 */
export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Get today's date in YYYY-MM-DD format based on local time
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date string belongs to the current calendar month and year
 */
export function isCurrentMonth(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 1-12

  const [year, month] = dateStr.split('-').map(Number);
  return year === currentYear && month === currentMonth;
}

/**
 * Get human readable current month name
 */
export function getCurrentMonthName(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Export expenses list to a clean CSV file
 */
export function exportExpensesToCSV(expenses: Expense[]) {
  if (expenses.length === 0) return;

  const headers = ['Date', 'Category', 'Description', 'Amount (INR)'];
  const rows = expenses.map(exp => [
    exp.date,
    CATEGORIES[exp.category]?.name || exp.category,
    `"${exp.description.replace(/"/g, '""')}"`,
    exp.amount,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_${getTodayDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
