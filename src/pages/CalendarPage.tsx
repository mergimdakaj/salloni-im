import React, { useState } from 'react';
import { format, addDays, startOfWeek, addHours, startOfDay, isSameDay } from 'date-fns';
import { sq } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppointments } from '../lib/AppointmentsContext';
import { useData } from '../lib/DataContext';

export default function CalendarPage() {
  const { appointments, addAppointment, isSlotBooked } = useAppointments();
  const { services, staff: staffMembers } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // New Appointment Form State
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

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  const hours = Array.from({ length: 13 }).map((_, i) => addHours(startOfDay(currentDate), i + 8)); // 8 AM to 8 PM

  const getAppointmentsForTime = (time: Date, staffId?: string) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const isSameTime = aptDate.getHours() === time.getHours() && isSameDay(aptDate, time);
      if (staffId) return isSameTime && apt.staffId === staffId;
      return isSameTime;
    });
  };

  const handleAddAppointment = () => {
    if (!newAptClient || !newAptService || !newAptStaff || !newAptDate || !newAptTime) {
      alert('Ju lutem plotësoni të gjitha fushat!');
      return;
    }

    const dateTimeString = `${newAptDate}T${newAptTime}`;
    const dateObj = new Date(dateTimeString);

    addAppointment({
      client: newAptClient,
      serviceId: newAptService,
      staffId: newAptStaff,
      date: dateObj.toISOString(),
      status: 'confirmed'
    });

    setIsAppointmentModalOpen(false);
    setNewAptClient('');
    setNewAptService('');
    setNewAptStaff('');
    alert('Termini u shtua me sukses!');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-stone-100 relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-stone-200 pb-4 bg-white px-4 md:px-6 pt-6 rounded-t-xl shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">Kalendari</h1>
          <p className="text-stone-500 mt-1 text-sm md:text-base">Menaxhimi i Termineve</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
          <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200 flex-1 md:flex-none">
            <button 
              onClick={() => setView('day')}
              className={`flex-1 md:flex-none px-3 md:px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'day' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Ditore
            </button>
            <button 
              onClick={() => setView('week')}
              className={`flex-1 md:flex-none px-3 md:px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'week' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Javore
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 bg-white border border-stone-200 rounded-lg p-1 shadow-sm flex-1 md:flex-none">
            <button onClick={() => setCurrentDate(addDays(currentDate, -1))} className="p-1.5 md:p-2 hover:bg-stone-100 rounded-md text-stone-600 transition-colors"><ChevronLeft size={18} /></button>
            <span className="font-medium text-stone-900 px-2 md:px-4 text-xs md:text-sm text-center whitespace-nowrap">
              {format(currentDate, 'd MMM yyyy', { locale: sq })}
            </span>
            <button onClick={() => setCurrentDate(addDays(currentDate, 1))} className="p-1.5 md:p-2 hover:bg-stone-100 rounded-md text-stone-600 transition-colors"><ChevronRight size={18} /></button>
          </div>

          <button 
            onClick={() => setIsAppointmentModalOpen(true)}
            className="bg-stone-900 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm flex-1 md:flex-none"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Termin i Ri</span>
          </button>
          
          <button className="bg-white text-stone-600 border border-stone-200 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors flex items-center gap-2 shadow-sm" title="Sync with Google Calendar">
            <CalendarIcon size={18} />
            <span className="hidden md:inline">Sync</span>
          </button>
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto bg-white border border-stone-200 shadow-sm rounded-b-xl relative mx-2 md:mx-6 mb-6">
        <div className="min-w-[800px]"> {/* Force minimum width for horizontal scrolling on mobile */}
          {/* Header Row */}
          <div className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr] sticky top-0 z-20 bg-white border-b border-stone-200 shadow-sm">
            <div className="p-2 md:p-4 border-r border-stone-200 bg-stone-100 flex items-center justify-center font-bold text-stone-500 text-[10px] md:text-sm uppercase tracking-wider">
              Ora
            </div>
            <div 
              className="grid"
              style={{ gridTemplateColumns: view === 'day' ? `repeat(${staffMembers.length}, minmax(0, 1fr))` : `repeat(7, minmax(0, 1fr))` }}
            >
               {view === 'day' ? (
                 staffMembers.map(staff => (
                   <div key={staff.id} className="p-2 md:p-4 border-r border-stone-200 last:border-r-0 text-center bg-stone-50">
                     <div className="flex flex-col items-center gap-1 md:gap-2">
                       {staff.avatar ? (
                         <img 
                           src={staff.avatar} 
                           onError={(e) => e.currentTarget.src = staff.fallbackAvatar}
                           alt={staff.name} 
                           className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white shadow-sm" 
                         />
                       ) : (
                         <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-stone-200 flex items-center justify-center text-[10px] md:text-xs font-bold text-stone-600 border-2 border-white shadow-sm">
                           {staff.name.substring(0, 2).toUpperCase()}
                         </div>
                       )}
                       <div>
                         <div className="font-bold text-stone-900 text-xs md:text-sm truncate max-w-[80px] md:max-w-none">{staff.name}</div>
                         <div className="text-[9px] md:text-xs font-bold text-stone-500 uppercase tracking-wide truncate max-w-[80px] md:max-w-none">{staff.role}</div>
                       </div>
                     </div>
                   </div>
                 ))
               ) : (
                 weekDays.map((day, index) => (
                   <div key={index} className="p-2 md:p-4 border-r border-stone-200 last:border-r-0 text-center bg-stone-50">
                     <div className="font-bold text-stone-900 text-xs md:text-sm capitalize truncate">{format(day, 'EEEE', { locale: sq })}</div>
                     <div className="text-[10px] md:text-xs font-bold text-stone-500">{format(day, 'd MMM', { locale: sq })}</div>
                   </div>
                 ))
               )}
            </div>
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr]">
            {/* Time Column */}
            <div className="border-r border-stone-200 bg-stone-100">
              {hours.map(hour => (
                <div key={hour.toString()} className="h-24 md:h-32 border-b border-stone-200 flex items-start justify-center pt-2 md:pt-3 font-mono text-[10px] md:text-xs font-bold text-stone-500 relative group">
                  {format(hour, 'HH:00')}
                </div>
              ))}
            </div>

            {/* Appointments Grid */}
            <div 
              className="grid"
              style={{ gridTemplateColumns: view === 'day' ? `repeat(${staffMembers.length}, minmax(0, 1fr))` : `repeat(7, minmax(0, 1fr))` }}
            >
              {view === 'day' ? staffMembers.map(staff => (
                <div key={staff.id} className="border-r border-stone-200 last:border-r-0 relative bg-white">
                  {hours.map(hour => {
                     const appointments = getAppointmentsForTime(hour, staff.id);
                     return (
                       <div key={hour.toString()} className="h-24 md:h-32 border-b border-stone-100 relative group hover:bg-stone-50 transition-colors">
                          {/* Add Button on Hover */}
                          <button 
                            onClick={() => {
                              setNewAptStaff(staff.id);
                              setNewAptDate(format(currentDate, 'yyyy-MM-dd'));
                              setNewAptTime(format(hour, 'HH:mm'));
                              setIsAppointmentModalOpen(true);
                            }}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-0"
                          >
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:bg-stone-900 hover:text-white transition-all shadow-sm">
                              <Plus size={14} className="md:w-4 md:h-4" />
                            </div>
                          </button>

                          <div className="absolute inset-x-0.5 md:inset-x-1 top-0.5 md:top-1 bottom-0.5 md:bottom-1 flex flex-col gap-0.5 md:gap-1 overflow-y-auto z-10 custom-scrollbar">
                            {appointments.map(apt => {
                              const service = services.find(s => s.id === apt.serviceId);
                              return (
                                <motion.div
                                  key={apt.id}
                                  initial={{ scale: 0.95, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="bg-stone-900 text-white p-1.5 md:p-2 rounded-md md:rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col justify-between border-l-[3px] md:border-l-4 border-stone-400 min-h-[40px] md:min-h-[60px]"
                                >
                                  <div>
                                    <div className="font-bold text-[10px] md:text-xs leading-tight mb-0.5 truncate">{apt.client}</div>
                                    <div className="text-[8px] md:text-[10px] text-stone-300 font-medium truncate">{service?.name}</div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                       </div>
                     );
                  })}
                </div>
              )) : weekDays.map((day, dayIndex) => (
                <div key={dayIndex} className="border-r border-stone-200 last:border-r-0 relative bg-white">
                  {hours.map(hour => {
                     const cellTime = new Date(day);
                     cellTime.setHours(hour.getHours(), 0, 0, 0);
                     const appointments = getAppointmentsForTime(cellTime);
                     
                     return (
                       <div key={hour.toString()} className="h-24 md:h-32 border-b border-stone-100 relative group hover:bg-stone-50 transition-colors">
                          {/* Add Button on Hover */}
                          <button 
                            onClick={() => {
                              setNewAptDate(format(cellTime, 'yyyy-MM-dd'));
                              setNewAptTime(format(cellTime, 'HH:mm'));
                              setIsAppointmentModalOpen(true);
                            }}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-0"
                          >
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:bg-stone-900 hover:text-white transition-all shadow-sm">
                              <Plus size={14} className="md:w-4 md:h-4" />
                            </div>
                          </button>

                          <div className="absolute inset-x-0.5 md:inset-x-1 top-0.5 md:top-1 bottom-0.5 md:bottom-1 flex flex-col gap-0.5 md:gap-1 overflow-y-auto z-10 custom-scrollbar">
                            {appointments.map(apt => {
                              const service = services.find(s => s.id === apt.serviceId);
                              const staff = staffMembers.find(s => s.id === apt.staffId);
                              return (
                                <motion.div
                                  key={apt.id}
                                  initial={{ scale: 0.95, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="bg-stone-900 text-white p-1 md:p-2 rounded md:rounded-md shadow-sm cursor-pointer hover:shadow-md transition-all border-l-2 border-stone-400 min-h-[36px] md:min-h-[50px]"
                                >
                                  <div className="font-bold text-[9px] md:text-[11px] leading-tight truncate">{apt.client}</div>
                                  <div className="text-[8px] md:text-[9px] text-stone-300 truncate">{service?.name} • {staff?.name.split(' ')[0]}</div>
                                </motion.div>
                              );
                            })}
                          </div>
                       </div>
                     );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      <AnimatePresence>
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
                      {services.map(s => (
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
                      {staffMembers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
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
      </AnimatePresence>
    </div>
  );
}
