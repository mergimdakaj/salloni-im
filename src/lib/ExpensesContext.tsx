import React, { createContext, useContext, useState, useEffect } from 'react';

export type ExpenseCategory = 'products' | 'food';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string; // ISO string
}

interface ExpensesContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

// Initial mock data
const INITIAL_EXPENSES: Expense[] = [
  { id: '1', category: 'products', amount: 150.00, description: 'Shampo dhe Balsam', date: '2024-01-15T10:00:00.000Z' },
  { id: '2', category: 'food', amount: 45.50, description: 'Dreka për stafin', date: '2024-01-20T12:30:00.000Z' },
  { id: '3', category: 'products', amount: 320.00, description: 'Bojra flokësh', date: '2024-02-05T09:15:00.000Z' },
  { id: '4', category: 'food', amount: 25.00, description: 'Kafe dhe Ujë', date: '2024-02-10T08:45:00.000Z' },
  { id: '5', category: 'products', amount: 85.00, description: 'Llak dhe Shkumë', date: '2024-03-01T11:20:00.000Z' },
  { id: '6', category: 'food', amount: 30.00, description: 'Snacks', date: '2024-03-05T14:00:00.000Z' },
];

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    // Try to load from local storage first, otherwise use initial data
    const saved = localStorage.getItem('salon_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  useEffect(() => {
    localStorage.setItem('salon_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses(prev => [expense, ...prev]);
  };

  return (
    <ExpensesContext.Provider value={{ expenses, addExpense }}>
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
