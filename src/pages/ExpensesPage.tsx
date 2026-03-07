import React, { useState } from 'react';
import { format } from 'date-fns';
import { sq } from 'date-fns/locale';
import { DollarSign, Filter, Calendar as CalendarIcon, Download } from 'lucide-react';
import { useExpenses } from '../lib/ExpensesContext';

const MONTHS = [
  { value: 'all', label: 'Të gjithë muajt' },
  { value: '0', label: 'Janar' },
  { value: '1', label: 'Shkurt' },
  { value: '2', label: 'Mars' },
  { value: '3', label: 'Prill' },
  { value: '4', label: 'Maj' },
  { value: '5', label: 'Qershor' },
  { value: '6', label: 'Korrik' },
  { value: '7', label: 'Gusht' },
  { value: '8', label: 'Shtator' },
  { value: '9', label: 'Tetor' },
  { value: '10', label: 'Nëntor' },
  { value: '11', label: 'Dhjetor' },
];

export default function ExpensesPage() {
  const { expenses } = useExpenses();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'products' | 'food'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all'); // 'all' or month index string

  // Filter Logic
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const expenseMonth = expenseDate.getMonth().toString();

    const categoryMatch = selectedCategory === 'all' || expense.category === selectedCategory;
    const monthMatch = selectedMonth === 'all' || expenseMonth === selectedMonth;

    return categoryMatch && monthMatch;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Shpenzimet</h1>
          <p className="text-stone-500 mt-1">Menaxhimi i shpenzimeve të sallonit</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50">
            <Download size={18} />
            Eksporto Raportin
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-end">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">Kategoria</label>
              <div className="flex bg-stone-100 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${selectedCategory === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
                >
                  Të Gjitha
                </button>
                <button
                  onClick={() => setSelectedCategory('products')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${selectedCategory === 'products' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
                >
                  Produkte
                </button>
                <button
                  onClick={() => setSelectedCategory('food')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${selectedCategory === 'food' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
                >
                  Ushqim
                </button>
              </div>
            </div>

            {/* Month Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">Periudha</label>
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none bg-stone-100 border-none text-stone-900 text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-48 p-2.5 font-medium cursor-pointer"
                >
                  {MONTHS.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-500">
                  <CalendarIcon size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Total Summary */}
          <div className="bg-stone-900 text-white px-6 py-4 rounded-xl min-w-[200px] text-right">
            <div className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">Totali i Shpenzimeve</div>
            <div className="text-2xl font-serif font-bold">€{totalExpenses.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-left">
              <th className="py-4 pl-6 text-xs font-bold uppercase tracking-wider text-stone-500">Data</th>
              <th className="py-4 text-xs font-bold uppercase tracking-wider text-stone-500">Kategoria</th>
              <th className="py-4 text-xs font-bold uppercase tracking-wider text-stone-500">Përshkrimi</th>
              <th className="py-4 pr-6 text-right text-xs font-bold uppercase tracking-wider text-stone-500">Shuma</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-4 pl-6 font-mono text-sm text-stone-600">
                    {format(new Date(expense.date), 'd MMM yyyy', { locale: sq })}
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      expense.category === 'products' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {expense.category === 'products' ? 'Produkte' : 'Ushqim'}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-stone-900 font-medium">
                    {expense.description}
                  </td>
                  <td className="py-4 pr-6 text-right font-mono text-sm font-bold text-stone-900">
                    €{expense.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-12 text-center text-stone-400 italic">
                  Nuk u gjetën shpenzime për kriteret e zgjedhura.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
