import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { sq } from 'date-fns/locale';
import { DollarSign, Filter, Calendar as CalendarIcon, Download, Trash2, AlertTriangle, X, Plus, Lock } from 'lucide-react';
import { useExpenses, ExpenseCategory } from '../lib/ExpenseContext';
import { motion, AnimatePresence } from 'motion/react';

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
  const { expenses, addExpense, deleteExpenses, deleteAllExpenses } = useExpenses();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'products' | 'food' | 'salaries'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all'); // 'all' or month index string
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // PIN Protection State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinAction, setPinAction] = useState<'unlock_salaries' | 'manage_deletion' | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [isSalariesUnlocked, setIsSalariesUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);

  // New Expense Form State
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'products' as ExpenseCategory,
    date: format(new Date(), 'yyyy-MM-dd')
  });

  // Filter Logic
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const expenseMonth = expenseDate.getMonth().toString();

    const categoryMatch = selectedCategory === 'all' 
      ? (isSalariesUnlocked ? true : expense.category !== 'salaries') // If unlocked, show all. If locked, hide salaries from 'all' view.
      : expense.category === selectedCategory;
      
    const monthMatch = selectedMonth === 'all' || expenseMonth === selectedMonth;

    return categoryMatch && monthMatch;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleCategoryChange = (category: 'all' | 'products' | 'food' | 'salaries') => {
    if (category === 'salaries' && !isSalariesUnlocked) {
      setPinAction('unlock_salaries');
      setIsPinModalOpen(true);
    } else {
      setSelectedCategory(category);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1994') {
      if (pinAction === 'unlock_salaries') {
        setIsSalariesUnlocked(true);
        setSelectedCategory('salaries');
      } else if (pinAction === 'manage_deletion') {
        setIsDeleteModalOpen(true);
      }
      setIsPinModalOpen(false);
      setPinInput('');
      setPinError(false);
      setPinAction(null);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleExportReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const dateStr = format(new Date(), 'dd/MM/yyyy HH:mm');
    const periodStr = selectedMonth === 'all' ? 'Të gjithë muajt' : MONTHS.find(m => m.value === selectedMonth)?.label;
    const categoryStr = selectedCategory === 'all' ? 'Të gjitha' : selectedCategory === 'products' ? 'Produkte' : selectedCategory === 'food' ? 'Ushqim' : 'Paga';

    const html = `
      <html>
        <head>
          <title>Raporti i Shpenzimeve - ${dateStr}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1c1917; }
            h1 { font-family: serif; font-size: 24px; margin-bottom: 8px; }
            .meta { font-size: 14px; color: #78716c; margin-bottom: 32px; border-bottom: 1px solid #e7e5e4; padding-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; background: #f5f5f4; padding: 12px; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #e7e5e4; }
            td { padding: 12px; border-bottom: 1px solid #e7e5e4; font-size: 14px; }
            .total { margin-top: 32px; text-align: right; font-size: 18px; font-weight: bold; }
            .footer { margin-top: 64px; font-size: 12px; color: #a8a29e; text-align: center; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Raporti i Shpenzimeve</h1>
          <div class="meta">
            Gjeneruar më: ${dateStr}<br>
            Periudha: ${periodStr}<br>
            Kategoria: ${categoryStr}
          </div>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Kategoria</th>
                <th>Përshkrimi</th>
                <th style="text-align: right;">Shuma</th>
              </tr>
            </thead>
            <tbody>
              ${filteredExpenses.map(exp => `
                <tr>
                  <td>${format(new Date(exp.date), 'dd/MM/yyyy')}</td>
                  <td>${exp.category === 'products' ? 'Produkte' : exp.category === 'food' ? 'Ushqim' : 'Paga'}</td>
                  <td>${exp.description}</td>
                  <td style="text-align: right;">€${exp.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Totali: €${totalExpenses.toFixed(2)}</div>
          <div class="footer">Ky raport është gjeneruar automatikisht nga Sistemi i Menaxhimit të Sallonit.</div>
          <script>
            window.onload = () => {
              window.print();
              // window.close(); // Optional: close window after printing
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date(newExpense.date).toISOString()
    });
    setIsAddModalOpen(false);
    setNewExpense({
      description: '',
      amount: '',
      category: 'products',
      date: format(new Date(), 'yyyy-MM-dd')
    });
  };

  const handleDeleteAll = () => {
    deleteAllExpenses();
    setIsDeleteModalOpen(false);
  };

  const handleDeleteMonthly = () => {
    if (selectedMonth === 'all') return;
    const expensesToDelete = expenses.filter(e => new Date(e.date).getMonth().toString() === selectedMonth);
    deleteExpenses(expensesToDelete.map(e => e.id));
    setIsDeleteModalOpen(false);
  };

  const handleDeleteDaily = () => {
    const today = new Date();
    const expensesToDelete = expenses.filter(e => isSameDay(new Date(e.date), today));
    
    if (expensesToDelete.length === 0) {
      alert('Nuk ka shpenzime për ditën e sotme.');
      return;
    }

    deleteExpenses(expensesToDelete.map(e => e.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-8 relative">
      <header className="flex justify-between items-end border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Shpenzimet</h1>
          <p className="text-stone-500 mt-1">Menaxhimi i shpenzimeve të sallonit</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white border border-stone-900 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Shto Shpenzim
          </button>
          <button 
            onClick={() => {
              setPinAction('manage_deletion');
              setIsPinModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={18} />
            Menaxho Fshirjen
          </button>
          <button 
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50"
          >
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
                  onClick={() => handleCategoryChange('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${selectedCategory === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
                >
                  Të Gjitha
                </button>
                <button
                  onClick={() => handleCategoryChange('products')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${selectedCategory === 'products' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
                >
                  Produkte
                </button>
                <button
                  onClick={() => handleCategoryChange('food')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${selectedCategory === 'food' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
                >
                  Ushqim
                </button>
                <button
                  onClick={() => handleCategoryChange('salaries')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${selectedCategory === 'salaries' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
                >
                  {isSalariesUnlocked ? 'Paga' : <><Lock size={14} /> Paga</>}
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
                        : expense.category === 'food'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {expense.category === 'products' ? 'Produkte' : expense.category === 'food' ? 'Ushqim' : 'Paga'}
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

      {/* Add Expense Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-stone-900">Shto Shpenzim të Ri</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddExpense} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Përshkrimi</label>
                  <input 
                    type="text" 
                    required
                    value={newExpense.description}
                    onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    placeholder="p.sh. Blerje shampo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Shuma (€)</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      step="0.01"
                      value={newExpense.amount}
                      onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                      className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Data</label>
                    <input 
                      type="date" 
                      required
                      value={newExpense.date}
                      onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                      className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Kategoria</label>
                  <select 
                    value={newExpense.category}
                    onChange={e => setNewExpense({...newExpense, category: e.target.value as ExpenseCategory})}
                    className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                  >
                    <option value="products">Produkte</option>
                    <option value="food">Ushqim</option>
                    <option value="salaries">Paga</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-stone-900 text-white py-3 rounded-lg font-bold hover:bg-stone-800 transition-colors mt-4"
                >
                  Shto Shpenzimin
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PIN Modal */}
      <AnimatePresence>
        {isPinModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Lock size={20} />
                  Kërkohet Kod Sigurie
                </h3>
                <button onClick={() => { setIsPinModalOpen(false); setPinInput(''); setPinError(false); }} className="text-stone-400 hover:text-stone-600">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <p className="text-sm text-stone-600">
                  {pinAction === 'unlock_salaries' 
                    ? 'Ju lutem shkruani kodin për të aksesuar kategorinë e Pagave.'
                    : 'Ju lutem shkruani kodin për të hapur menunë e fshirjes.'}
                </p>
                
                <div>
                  <input 
                    type="password" 
                    autoFocus
                    value={pinInput}
                    onChange={e => setPinInput(e.target.value)}
                    className={`w-full p-3 text-center text-2xl tracking-widest border rounded-lg focus:ring-2 focus:outline-none ${pinError ? 'border-red-500 focus:ring-red-200' : 'border-stone-300 focus:ring-stone-500'}`}
                    placeholder="••••"
                    maxLength={4}
                  />
                  {pinError && <p className="text-xs text-red-500 mt-1 text-center">Kodi i gabuar. Provoni përsëri.</p>}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-stone-900 text-white py-3 rounded-lg font-bold hover:bg-stone-800 transition-colors"
                >
                  Konfirmo
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Trash2 className="text-red-500" />
                  Fshi Shpenzimet
                </h3>
                <button onClick={() => setIsDeleteModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-stone-600 mb-4">
                  Zgjidhni cilat shpenzime dëshironi të fshini. <span className="font-bold text-red-600">Kujdes: Ky veprim nuk mund të kthehet prapa!</span>
                </p>

                <button 
                  onClick={handleDeleteDaily}
                  className="w-full flex items-center justify-between p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors group"
                >
                  <div className="text-left">
                    <div className="font-bold text-stone-900 group-hover:text-red-600 transition-colors">Fshi të Sotmet</div>
                    <div className="text-xs text-stone-500">Fshin vetëm shpenzimet e datës {format(new Date(), 'd MMM yyyy', { locale: sq })}</div>
                  </div>
                  <Trash2 size={18} className="text-stone-300 group-hover:text-red-500" />
                </button>

                <button 
                  onClick={handleDeleteMonthly}
                  disabled={selectedMonth === 'all'}
                  className={`w-full flex items-center justify-between p-4 border border-stone-200 rounded-lg transition-colors group ${
                    selectedMonth === 'all' ? 'opacity-50 cursor-not-allowed bg-stone-50' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-bold text-stone-900 group-hover:text-red-600 transition-colors">
                      {selectedMonth === 'all' ? 'Zgjidhni një muaj fillimisht' : `Fshi të Muajit ${MONTHS.find(m => m.value === selectedMonth)?.label}`}
                    </div>
                    <div className="text-xs text-stone-500">
                      {selectedMonth === 'all' ? 'Përdorni filtrin e muajit për të aktivizuar këtë opsion' : 'Fshin të gjitha shpenzimet e këtij muaji'}
                    </div>
                  </div>
                  <Trash2 size={18} className="text-stone-300 group-hover:text-red-500" />
                </button>

                <button 
                  onClick={handleDeleteAll}
                  className="w-full flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group"
                >
                  <div className="text-left">
                    <div className="font-bold text-red-700">Fshi TË GJITHA</div>
                    <div className="text-xs text-red-500">Fshin çdo shpenzim nga baza e të dhënave</div>
                  </div>
                  <AlertTriangle size={18} className="text-red-500" />
                </button>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 font-medium text-stone-600 hover:text-stone-900"
                >
                  Anulo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
