import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Calendar, DollarSign, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { STAFF } from '../lib/data';

const initialData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Shk', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Pri', revenue: 2780 },
  { name: 'Maj', revenue: 1890 },
  { name: 'Qer', revenue: 2390 },
  { name: 'Kor', revenue: 3490 },
  { name: 'Gus', revenue: 4200 },
  { name: 'Sht', revenue: 3800 },
  { name: 'Tet', revenue: 3100 },
  { name: 'Nën', revenue: 2500 },
  { name: 'Dhj', revenue: 5000 },
];

export default function FinancesPage() {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '1Y'>('1Y');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');

  // Filter logic (mock)
  const filteredData = initialData.map(d => ({
    ...d,
    revenue: selectedStaff === 'all' ? d.revenue : d.revenue * 0.3 // Mocking individual staff revenue
  })).filter((_, index) => {
    if (timeframe === '1M') return index === 11;
    if (timeframe === '3M') return index >= 9;
    return true;
  });

  const totalRevenue = filteredData.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Financat</h1>
          <p className="text-stone-500 mt-1">Pasqyra e të ardhurave dhe performanca</p>
        </div>
        <div className="flex gap-4">
          <select 
            className="bg-white border border-stone-300 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:border-black"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
          >
            <option value="all">I gjithë Stafi</option>
            {STAFF.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <div className="flex bg-stone-100 rounded-lg p-1">
            {['1M', '3M', '1Y'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t as any)}
                className={`px-4 py-1 text-sm font-bold rounded-md transition-all ${
                  timeframe === t ? 'bg-white shadow-sm text-black' : 'text-stone-500 hover:text-black'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black text-white p-8 rounded-2xl shadow-xl">
          <p className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-2">Totali i të Ardhurave</p>
          <h2 className="text-5xl font-serif font-bold">€{totalRevenue.toLocaleString()}</h2>
          <div className="mt-6 flex items-center gap-2 text-green-400 text-sm font-bold">
            <TrendingUp size={16} />
            <span>+12.5% nga periudha e kaluar</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
          <p className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-2">Mesatarja Ditore</p>
          <h2 className="text-4xl font-serif font-bold text-stone-900">€{(totalRevenue / (filteredData.length * 30)).toFixed(0)}</h2>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
          <p className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-2">Termine të Paguara</p>
          <h2 className="text-4xl font-serif font-bold text-stone-900">142</h2>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
        <h3 className="text-lg font-bold mb-6">Grafiku i të Ardhurave</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#78716c', fontSize: 12 }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: '#f5f5f4' }}
                contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`€${value}`, 'Të Ardhurat']}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]} fill="#d6d3d1">
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === filteredData.length - 1 ? '#44403c' : '#a8a29e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
