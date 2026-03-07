import React, { createContext, useContext, useState, useEffect } from 'react';

export type ExpenseCategory = 'products' | 'food' | 'salaries';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

interface ExpensesContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpenses: (ids: string[]) => void;
  deleteAllExpenses: () => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('salloni_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('salloni_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expenseData,
      id: crypto.randomUUID(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpenses = (ids: string[]) => {
    setExpenses(prev => prev.filter(expense => !ids.includes(expense.id)));
  };

  const deleteAllExpenses = () => {
    setExpenses([]);
  };

  return (
    <ExpensesContext.Provider value={{ expenses, addExpense, deleteExpenses, deleteAllExpenses }}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
}
