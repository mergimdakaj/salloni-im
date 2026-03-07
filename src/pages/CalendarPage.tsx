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
      <header className="flex justify-between items-center mb-6 border-b border-stone-200 pb-4 bg-white px-6 pt-6 rounded-t-xl shadow-sm">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Kalendari</h1>
          <p className="text-stone-500 mt-1">Menaxhimi i Termineve</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button 
              onClick={() => setView('day')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'day' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Ditore
            </button>
            <button 
              onClick={() => setView('week')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'week' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Javore
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg p-1 shadow-sm">
            <button onClick={() => setCurrentDate(addDays(currentDate, -1))} className="p-2 hover:bg-stone-100 rounded-md text-stone-600 transition-colors"><ChevronLeft size={20} /></button>
            <span className="font-medium text-stone-900 px-4 min-w-[150px] text-center">
              {format(currentDate, 'd MMMM yyyy', { locale: sq })}
            </span>
            <button onClick={() => setCurrentDate(addDays(currentDate, 1))} className="p-2 hover:bg-stone-100 rounded-md text-stone-600 transition-colors"><ChevronRight size={20} /></button>
          </div>

          <button 
            onClick={() => setIsAppointmentModalOpen(true)}
            className="bg-stone-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Termin i Ri
          </button>
          
          <button className="bg-white text-stone-600 border border-stone-200 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors flex items-center gap-2 shadow-sm" title="Sync with Google Calendar">
            <CalendarIcon size={18} />
            <span className="hidden md:inline">Sync</span>
          </button>
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto bg-white border border-stone-200 shadow-sm rounded-b-xl relative mx-6 mb-6">
        {/* Header Row */}
        <div className="grid grid-cols-[80px_1fr] sticky top-0 z-20 bg-white border-b border-stone-200 shadow-sm">
          <div className="p-4 border-r border-stone-200 bg-stone-100 flex items-center justify-center font-bold text-stone-500 text-sm uppercase tracking-wider">
            Ora
          </div>
          <div 
            className="grid"
            style={{ gridTemplateColumns: view === 'day' ? `repeat(${staffMembers.length}, minmax(0, 1fr))` : '1fr' }}
          >
             {view === 'day' ? (
               staffMembers.map(staff => (
                 <div key={staff.id} className="p-4 border-r border-stone-200 last:border-r-0 text-center bg-stone-50">
                   <div className="flex flex-col items-center gap-2">
                     {staff.avatar ? (
                       <img 
                         src={staff.avatar} 
                         onError={(e) => e.currentTarget.src = staff.fallbackAvatar}
                         alt={staff.name} 
                         className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" 
                       />
                     ) : (
                       <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600 border-2 border-white shadow-sm">
                         {staff.name.substring(0, 2).toUpperCase()}
                       </div>
                     )}
                     <div>
                       <div className="font-bold text-stone-900 text-sm">{staff.name}</div>
                       <div className="text-xs font-bold text-stone-500 uppercase tracking-wide">{staff.role}</div>
                     </div>
                   </div>
                 </div>
               ))
             ) : (
               <div className="p-8 text-center text-stone-400 font-medium">
                 Pamja Javore (Së shpejti)
               </div>
             )}
          </div>
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-[80px_1fr]">
          {/* Time Column */}
          <div className="border-r border-stone-200 bg-stone-100">
            {hours.map(hour => (
              <div key={hour.toString()} className="h-32 border-b border-stone-200 flex items-start justify-center pt-3 font-mono text-xs font-bold text-stone-500 relative group">
                {format(hour, 'HH:00')}
              </div>
            ))}
          </div>

          {/* Appointments Grid */}
          <div 
            className="grid"
            style={{ gridTemplateColumns: view === 'day' ? `repeat(${staffMembers.length}, minmax(0, 1fr))` : '1fr' }}
          >
            {view === 'day' && staffMembers.map(staff => (
              <div key={staff.id} className="border-r border-stone-200 last:border-r-0 relative bg-white">
                {hours.map(hour => {
                   const appointments = getAppointmentsForTime(hour, staff.id);
                   return (
                     <div key={hour.toString()} className="h-32 border-b border-stone-100 relative group hover:bg-stone-50 transition-colors">
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
                          <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:bg-stone-900 hover:text-white transition-all shadow-sm">
                            <Plus size={16} />
                          </div>
                        </button>

                        {appointments.map(apt => {
                          const service = services.find(s => s.id === apt.serviceId);
                          return (
                            <motion.div
                              key={apt.id}
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="absolute top-1 left-1 right-1 bottom-1 bg-stone-900 text-white p-3 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all z-10 flex flex-col justify-between border-l-4 border-stone-400"
                            >
                              <div>
                                <div className="font-bold text-sm leading-tight mb-1">{apt.client}</div>
                                <div className="text-xs text-stone-300 font-medium">{service?.name}</div>
                              </div>
                              <div className="text-[10px] font-mono text-stone-400 bg-white/10 self-start px-1.5 py-0.5 rounded">
                                {format(new Date(apt.date), 'HH:mm')} - {format(addHours(new Date(apt.date), 1), 'HH:mm')}
                              </div>
                            </motion.div>
                          );
                        })}
                     </div>
                   );
                })}
              </div>
            ))}
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
