import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Users, Calendar, DollarSign, Clock, X, Plus, Check, Trash2, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, isSameDay, addHours, startOfToday } from 'date-fns';
import { sq } from 'date-fns/locale';

import { useExpenses, ExpenseCategory } from '../lib/ExpensesContext';
import { useAppointments } from '../lib/AppointmentsContext';
import { useData } from '../lib/DataContext';

const data = [
  { name: 'Hën', visits: 40 },
  { name: 'Mar', visits: 30 },
  { name: 'Mër', visits: 55 },
  { name: 'Enj', visits: 45 },
  { name: 'Pre', visits: 80 },
  { name: 'Sht', visits: 95 },
  { name: 'Die', visits: 20 },
];

export default function DashboardPage() {
  const { addExpense } = useExpenses();
  const { appointments, addAppointment, isSlotBooked } = useAppointments();
  const { services: SERVICES, staff: STAFF } = useData();

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  
  // PIN and Clear Stats State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isDailyStatsCleared, setIsDailyStatsCleared] = useState(false);

  // Check if stats were cleared today on mount
  useEffect(() => {
    const clearedDate = localStorage.getItem('salon_daily_stats_cleared_date');
    if (clearedDate === format(new Date(), 'yyyy-MM-dd')) {
      setIsDailyStatsCleared(true);
    }
  }, []);

  // Expense State
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('products');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');

  // Appointment State
  const [newAptClient, setNewAptClient] = useState('');
  const [newAptService, setNewAptService] = useState('');
  const [newAptStaff, setNewAptStaff] = useState('');
  const [newAptDate, setNewAptDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newAptTime, setNewAptTime] = useState('');

  // Generate time slots (09:00 - 20:00)
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      category: expenseCategory,
      amount: parseFloat(expenseAmount),
      description: expenseDescription,
      date: new Date().toISOString()
    });
    setIsExpenseModalOpen(false);
    setExpenseAmount('');
    setExpenseDescription('');
    alert('Shpenzimi u shtua me sukses!');
  };

  const handleAddAppointment = () => {
    if (!newAptClient || !newAptService || !newAptStaff || !newAptDate || !newAptTime) {
      alert('Ju lutem plotësoni të gjitha fushat!');
      return;
    }

    const dateTimeString = `${newAptDate}T${newAptTime}`;
    const dateObj = new Date(dateTimeString);

    if (isSlotBooked(dateObj, newAptTime, newAptStaff)) {
      alert('Ky termin është i zënë! Ju lutem zgjidhni një orar tjetër.');
      return;
    }

    addAppointment({
      client: newAptClient,
      serviceId: newAptService,
      staffId: newAptStaff,
      date: dateObj.toISOString(),
      status: 'booked'
    });

    setIsAppointmentModalOpen(false);
    setNewAptClient('');
    setNewAptService('');
    setNewAptStaff('');
    setNewAptTime('');
    alert('Termini u shtua me sukses!');
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1994') {
      setIsDailyStatsCleared(true);
      localStorage.setItem('salon_daily_stats_cleared_date', format(new Date(), 'yyyy-MM-dd'));
      setIsPinModalOpen(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  // Filter today's appointments for the table
  const todaysAppointments = isDailyStatsCleared ? [] : appointments.filter(apt => isSameDay(new Date(apt.date), new Date()));
  
  // Calculate real revenue from today's appointments
  const todaysRevenue = todaysAppointments.reduce((sum, apt) => {
    const service = SERVICES.find(s => s.id === apt.serviceId);
    return sum + (service?.price || 0);
  }, 0);

  // Stats values based on clear state
  const displayRevenue = isDailyStatsCleared ? '€0' : `€${todaysRevenue}`;
  const displayAppointments = isDailyStatsCleared ? '0' : todaysAppointments.length.toString();
  const displayNewClients = isDailyStatsCleared ? '0' : '5'; // Hardcoded 5 for demo, but clears to 0

  return (
    <div className="space-y-8 relative">
      <header className="flex justify-between items-end border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Paneli Kryesor</h1>
          <p className="text-stone-500 mt-1">Mirësevini, shikoni aktivitetin e sotëm.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm font-medium text-stone-500 uppercase tracking-wider">Data e Sotme</div>
            <div className="text-2xl font-serif font-bold mt-1">{format(new Date(), 'd MMMM yyyy', { locale: sq })}</div>
          </div>
          <button 
            onClick={() => setIsPinModalOpen(true)}
            className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
            title="Fshi Statistikat e Sotme"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Të Ardhurat Sot" 
          value={displayRevenue} 
          icon={<DollarSign size={24} />} 
          trend={isDailyStatsCleared ? "0%" : "+12%"}
          color="bg-stone-900 text-white"
        />
        <StatCard 
          title="Termine Aktive" 
          value={displayAppointments} 
          icon={<Calendar size={24} />} 
          trend={isDailyStatsCleared ? "0" : "+4"}
          color="bg-white text-stone-900 border border-stone-200"
        />
        <StatCard 
          title="Klientë të Rinj" 
          value={displayNewClients} 
          icon={<Users size={24} />} 
          trend={isDailyStatsCleared ? "0" : "+2"}
          color="bg-white text-stone-900 border border-stone-200"
        />
        <StatCard 
          title="Stafi Aktiv" 
          value={`${STAFF.length}/6`} 
          icon={<TrendingUp size={24} />} 
          trend="OK"
          color="bg-white text-stone-900 border border-stone-200"
        />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Appointments List (Staff View) */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 bg-stone-50/50">
            <h2 className="text-xl font-serif font-bold flex items-center gap-2">
              Terminet e Sotme
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200 bg-stone-100/50">
                  <th className="py-4 pl-6">Ora</th>
                  <th className="py-4">Klienti</th>
                  <th className="py-4">Shërbimi</th>
                  <th className="py-4">Stafi</th>
                  <th className="py-4 text-right">Shuma</th>
                  <th className="py-4 pr-6 text-right">Statusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {todaysAppointments.length > 0 ? (
                  todaysAppointments.map((apt) => {
                    const service = SERVICES.find(s => s.id === apt.serviceId);
                    const staffMember = STAFF.find(s => s.id === apt.staffId);
                    return (
                      <tr key={apt.id} className="group hover:bg-stone-50 transition-colors">
                        <td className="py-4 pl-6 font-mono text-sm font-bold text-stone-900">
                          {format(new Date(apt.date), 'HH:mm')}
                        </td>
                        <td className="py-4 font-medium text-stone-900">{apt.client}</td>
                        <td className="py-4 text-stone-600">{service?.name || 'Unknown'}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            {staffMember?.avatar ? (
                              <img 
                                src={staffMember.avatar} 
                                alt={staffMember.name}
                                className="w-8 h-8 rounded-full object-cover border border-stone-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = staffMember.fallbackAvatar || '';
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600">
                                {staffMember?.name?.substring(0, 2).toUpperCase() || '?'}
                              </div>
                            )}
                            <span className="font-medium text-sm text-stone-900">
                              {staffMember?.name || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-right font-medium">€{service?.price || 0}</td>
                        <td className="py-4 pr-6 text-right">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-500 italic">
                      Nuk ka termine për sot.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Revenue Chart */}
        <div className="space-y-8">
          <div className="bg-stone-900 text-white rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-serif font-bold mb-4">Aksione të Shpejta</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setIsAppointmentModalOpen(true)}
                className="w-full bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors"
              >
                <Calendar size={18} />
                Shto Termin të Ri
              </button>
              <button 
                onClick={() => setIsClientModalOpen(true)}
                className="w-full bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors"
              >
                <Users size={18} />
                Regjistro Klient
              </button>
              <button 
                onClick={() => setIsExpenseModalOpen(true)}
                className="w-full bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors"
              >
                <DollarSign size={18} />
                Shto Shpenzim
              </button>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-serif font-bold mb-4">Statistikat Javore</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
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
                  />
                  <Bar dataKey="visits" radius={[4, 4, 0, 0]} fill="#a8a29e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isExpenseModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-stone-100">
                <h3 className="text-xl font-serif font-bold">Shto Shpenzim</h3>
                <button onClick={() => setIsExpenseModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddExpense} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Kategoria</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setExpenseCategory('products')}
                      className={`p-2 text-xs font-bold uppercase rounded-lg border ${expenseCategory === 'products' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-500 border-stone-200'}`}
                    >
                      Produkte
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpenseCategory('food')}
                      className={`p-2 text-xs font-bold uppercase rounded-lg border ${expenseCategory === 'food' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-500 border-stone-200'}`}
                    >
                      Ushqim
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Shuma (€)</label>
                  <input 
                    type="number" 
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Përshkrimi</label>
                  <textarea 
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 h-24 resize-none"
                    placeholder="Detaje rreth shpenzimit..."
                  />
                </div>
                <button type="submit" className="w-full bg-stone-900 text-white py-3 rounded-lg font-bold hover:bg-stone-800 transition-colors">
                  Ruaj Shpenzimin
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isAppointmentModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-6 border-b border-stone-100 sticky top-0 bg-white z-10">
                <h3 className="text-xl font-serif font-bold">Shto Termin të Ri</h3>
                <button onClick={() => setIsAppointmentModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Klienti</label>
                  <input 
                    type="text" 
                    value={newAptClient}
                    onChange={(e) => setNewAptClient(e.target.value)}
                    className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900" 
                    placeholder="Emri dhe Mbiemri" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Shërbimi</label>
                  <select 
                    value={newAptService}
                    onChange={(e) => setNewAptService(e.target.value)}
                    className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
                  >
                    <option value="">Zgjidh Shërbimin</option>
                    {SERVICES.map(s => (
                      <option key={s.id} value={s.id}>{s.name} - €{s.price}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Stafi</label>
                  <select 
                    value={newAptStaff}
                    onChange={(e) => setNewAptStaff(e.target.value)}
                    className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
                  >
                    <option value="">Zgjidh Stafin</option>
                    {STAFF.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Data</label>
                  <input 
                    type="date" 
                    value={newAptDate}
                    onChange={(e) => setNewAptDate(e.target.value)}
                    className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900" 
                  />
                </div>
                
                {/* Time Slot Picker */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Ora (Terminat e Zëne me të Kuqe)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(time => {
                      const isBooked = newAptStaff && newAptDate 
                        ? isSlotBooked(new Date(newAptDate), time, newAptStaff)
                        : false;
                      
                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked || !newAptStaff}
                          onClick={() => setNewAptTime(time)}
                          className={`
                            p-2 rounded-lg text-xs font-bold border transition-all
                            ${newAptTime === time 
                              ? 'bg-stone-900 text-white border-stone-900' 
                              : isBooked 
                                ? 'bg-red-100 text-red-400 border-red-200 cursor-not-allowed' 
                                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-900'
                            }
                            ${!newAptStaff ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                  {!newAptStaff && (
                    <p className="text-xs text-stone-400 mt-1 italic">Zgjidhni stafin për të parë oraret e lira.</p>
                  )}
                </div>

                <button 
                  type="button" 
                  onClick={handleAddAppointment} 
                  className="w-full bg-stone-900 text-white py-3 rounded-lg font-bold hover:bg-stone-800 transition-colors mt-4"
                >
                  Ruaj Terminin
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isClientModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-stone-100">
                <h3 className="text-xl font-serif font-bold">Regjistro Klient</h3>
                <button onClick={() => setIsClientModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Emri</label>
                    <input type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900" placeholder="Emri" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Mbiemri</label>
                    <input type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900" placeholder="Mbiemri" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Telefoni</label>
                  <input type="tel" className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900" placeholder="+383 44 ..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email (Opsionale)</label>
                  <input type="email" className="w-full p-3 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900" placeholder="email@example.com" />
                </div>
                <button type="button" onClick={() => { setIsClientModalOpen(false); alert('Klienti u regjistrua me sukses!'); }} className="w-full bg-stone-900 text-white py-3 rounded-lg font-bold hover:bg-stone-800 transition-colors mt-4">
                  Regjistro Klientin
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* PIN Modal for Clearing Stats */}
        {isPinModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
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
                  Ju lutem shkruani kodin për të fshirë statistikat e sotme (Të ardhurat, Terminet, Klientët e rinj).
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
                  Konfirmo Fshirjen
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
