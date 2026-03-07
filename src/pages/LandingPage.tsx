import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Check, Star, Instagram, Phone, MapPin, Award, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, addDays, startOfToday } from 'date-fns';
import { sq } from 'date-fns/locale';
import { useAppointments } from '../lib/AppointmentsContext';
import { useData } from '../lib/DataContext';

// Placeholder for the background image path as requested
const HERO_IMAGE_PATH = "/background.jpg";
const HERO_IMAGE_FALLBACK = "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574&auto=format&fit=crop";

export default function LandingPage() {
  const { addAppointment, isSlotBooked } = useAppointments();
  const { services: SERVICES, staff: STAFF } = useData();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStaffMember, setSelectedStaffMember] = useState<typeof STAFF[0] | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Generate hours from 09:00 to 18:00
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Filter services based on selected staff
  const availableServices = selectedStaff 
    ? SERVICES.filter(s => STAFF.find(staff => staff.id === selectedStaff)?.serviceIds.includes(s.id))
    : SERVICES;

  // Filter staff based on selected service
  const availableStaff = selectedService
    ? STAFF.filter(s => s.serviceIds.includes(selectedService))
    : STAFF;

  const selectedServiceDetails = SERVICES.find(s => s.id === selectedService);

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBooking = async () => {
    if (!selectedService || !selectedStaff || !selectedTime) return;

    // Create the appointment date object
    const appointmentDate = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // Add to context
    await addAppointment({
      client: `${formData.name} ${formData.surname}`,
      serviceId: selectedService,
      staffId: selectedStaff,
      date: appointmentDate.toISOString()
    });

    console.log('Booking Confirmed:', {
      service: selectedService,
      staff: selectedStaff,
      date: selectedDate,
      time: selectedTime,
      client: formData
    });

    setBookingSuccess(true);
    
    // Reset form after delay or manual close (optional, but here we keep the success state)
    // setSelectedService(null);
    // setSelectedStaff(null);
    // setSelectedTime(null);
    // setFormData({ name: '', surname: '', phone: '' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Success Modal */}
      <AnimatePresence>
        {bookingSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative"
            >
              <button 
                onClick={() => {
                  setBookingSuccess(false);
                  // Reset form
                  setSelectedService(null);
                  setSelectedStaff(null);
                  setSelectedTime(null);
                  setFormData({ name: '', surname: '', phone: '' });
                }}
                className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full"
              >
                <X size={24} />
              </button>
              
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} />
              </div>
              
              <h3 className="text-2xl font-serif font-bold mb-2">Rezervimi u krye me sukses!</h3>
              <p className="text-stone-500 mb-6">
                Faleminderit {formData.name}! Rezervimi juaj për <strong>{selectedServiceDetails?.name}</strong> me <strong>{STAFF.find(s => s.id === selectedStaff)?.name}</strong> u konfirmua për datën <strong>{format(selectedDate, 'd MMM', { locale: sq })}</strong> në ora <strong>{selectedTime}</strong>.
              </p>
              
              <button 
                onClick={() => {
                  setBookingSuccess(false);
                  // Reset form
                  setSelectedService(null);
                  setSelectedStaff(null);
                  setSelectedTime(null);
                  setFormData({ name: '', surname: '', phone: '' });
                }}
                className="w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors"
              >
                Mbyll
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-2xl font-serif font-bold tracking-tight">SALLONI IM</div>
          <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-stone-600">
            <a href="#sherbimet" className="hover:text-black transition-colors">Shërbimet</a>
            <a href="#stafi" className="hover:text-black transition-colors">Stafi</a>
            <a href="#terminet" className="hover:text-black transition-colors">Rezervo</a>
          </div>
          <Link to="/login" className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors">
            Hyrje Stafi
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_IMAGE_PATH}
            onError={(e) => e.currentTarget.src = HERO_IMAGE_FALLBACK}
            alt="Salon Interior" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-serif font-medium mb-6 leading-tight"
          >
            Bukuria fillon këtu.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl font-light tracking-wide mb-10 text-white/90"
          >
            Elegancë, Profesionalizëm dhe Përkushtim për çdo detaj.
          </motion.p>
          <motion.a 
            href="#terminet"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="inline-block px-10 py-4 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-stone-100 transition-colors"
          >
            Rezervo Termin
          </motion.a>
        </div>
      </section>

      {/* Services Section */}
      <section id="sherbimet" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Shërbimet Tona</h2>
          <div className="w-20 h-[1px] bg-black mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {SERVICES.map((service) => (
            <div 
              key={service.id} 
              onClick={() => {
                setSelectedService(service.id);
                document.getElementById('terminet')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex justify-between items-baseline border-b border-stone-200 pb-4 group hover:border-black transition-colors cursor-pointer ${selectedService === service.id ? 'border-black bg-stone-50 px-2' : ''}`}
            >
              <div>
                <h3 className="text-xl font-serif group-hover:pl-2 transition-all duration-300">{service.name}</h3>
                <p className="text-sm text-stone-500 mt-1">{service.duration} min • {service.category}</p>
              </div>
              <div className="text-xl font-medium">€{service.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Staff Section */}
      <section id="stafi" className="py-24 px-6 bg-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Ekipi Profesional</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">Klikoni mbi foton e anëtarit për të parë biografinë dhe diplomat.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STAFF.map((member) => (
              <div 
                key={member.id} 
                onClick={() => setSelectedStaffMember(member)}
                className="group bg-white p-4 pb-8 text-center transition-all duration-500 hover:-translate-y-2 cursor-pointer relative"
              >
                {member.isSenior && (
                  <div className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold uppercase px-2 py-1 tracking-widest z-10">
                    Senior
                  </div>
                )}
                <div className="aspect-[3/4] overflow-hidden mb-6 bg-stone-200 relative">
                  <img 
                    src={member.avatar} 
                    onError={(e) => e.currentTarget.src = member.fallbackAvatar}
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-bold uppercase tracking-widest border border-white px-4 py-2">Shiko Profilin</span>
                  </div>
                </div>
                <h3 className="text-xl font-serif mb-1">{member.name}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">{member.role}</p>
                {member.experience > 5 && (
                  <div className="flex justify-center items-center gap-1 text-xs text-stone-400 mb-2">
                    <Star size={12} fill="currentColor" />
                    <span>{member.experience} Vite Eksperiencë</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Modal */}
      <AnimatePresence>
        {selectedStaffMember && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStaffMember(null)}
            className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedStaffMember(null)}
                className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full transition-colors z-10"
              >
                <X size={24} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-full bg-stone-200">
                  <img 
                    src={selectedStaffMember.avatar} 
                    onError={(e) => e.currentTarget.src = selectedStaffMember.fallbackAvatar}
                    alt={selectedStaffMember.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-3xl font-serif font-bold mb-2">{selectedStaffMember.name}</h3>
                    <p className="text-sm font-bold uppercase tracking-widest text-stone-500">{selectedStaffMember.role}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold uppercase mb-2 flex items-center gap-2">
                        <User size={16} /> Biografia
                      </h4>
                      <p className="text-stone-600 text-sm leading-relaxed">
                        {selectedStaffMember.bio}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold uppercase mb-2 flex items-center gap-2">
                        <Award size={16} /> Diplomat & Çertifikatat
                      </h4>
                      <ul className="space-y-2">
                        {selectedStaffMember.diplomas.map((diploma, index) => (
                          <li key={index} className="text-sm text-stone-600 flex items-start gap-2">
                            <Check size={14} className="mt-1 text-green-600 shrink-0" />
                            <span>{diploma}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-stone-100">
                      <button 
                        onClick={() => {
                          setSelectedStaff(selectedStaffMember.id);
                          setSelectedStaffMember(null);
                          document.getElementById('terminet')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full bg-black text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors"
                      >
                        Rezervo me {selectedStaffMember.name.split(' ')[0]}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Section */}
      <section id="terminet" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="bg-white p-8 md:p-12 shadow-2xl shadow-stone-200/50 border border-stone-100 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-2">Rezervo Termin</h2>
            <p className="text-stone-500">Plotësoni të dhënat për të rezervuar terminin tuaj</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Selection */}
            <div className="lg:col-span-2 space-y-8">
              {/* 1. Select Staff */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">1</span>
                  Zgjidh Stafin
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {availableStaff.map((member) => (
                    <div 
                      key={member.id}
                      onClick={() => setSelectedStaff(member.id)}
                      className={`cursor-pointer border rounded-xl p-3 text-center transition-all ${
                        selectedStaff === member.id 
                          ? 'border-black bg-stone-50 ring-1 ring-black' 
                          : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-2 bg-stone-200">
                         <img 
                           src={member.avatar} 
                           onError={(e) => e.currentTarget.src = member.fallbackAvatar}
                           alt={member.name} 
                           className="w-full h-full object-cover"
                         />
                      </div>
                      <div className="font-bold text-sm">{member.name}</div>
                      <div className="text-[10px] text-stone-500 uppercase">{member.role}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Select Service */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">2</span>
                  Zgjidh Shërbimin
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableServices.map((service) => (
                    <div 
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`cursor-pointer border rounded-xl p-4 flex justify-between items-center transition-all ${
                        selectedService === service.id 
                          ? 'border-black bg-stone-50 ring-1 ring-black' 
                          : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">{service.name}</div>
                        <div className="text-xs text-stone-500">{service.duration} min</div>
                      </div>
                      <div className="font-bold">€{service.price}</div>
                    </div>
                  ))}
                  {availableServices.length === 0 && (
                    <div className="col-span-2 text-center py-4 text-stone-500 text-sm italic border border-dashed border-stone-300 rounded-xl">
                      Ju lutem zgjidhni një anëtar tjetër të stafit për të parë shërbimet.
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Select Date */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">3</span>
                  Zgjidh Datën
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                    const date = addDays(new Date(), offset);
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    return (
                      <button
                        key={offset}
                        onClick={() => setSelectedDate(date)}
                        className={`min-w-[100px] flex flex-col items-center p-3 rounded-xl border transition-all ${
                          isSelected 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <span className="text-xs font-bold uppercase mb-1">{format(date, 'EEE', { locale: sq })}</span>
                        <span className="text-2xl font-serif font-bold">{format(date, 'd')}</span>
                        <span className="text-xs opacity-70">{format(date, 'MMM')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Select Time */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">4</span>
                  Zgjidh Orën
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                  {timeSlots.map((time) => {
                    const isBooked = selectedStaff ? isSlotBooked(selectedDate, time, selectedStaff) : false;
                    
                    return (
                      <button 
                        key={time}
                        onClick={() => !isBooked && setSelectedTime(time)}
                        disabled={isBooked}
                        className={`py-2 px-1 rounded-lg border text-sm font-medium transition-all ${
                          isBooked 
                            ? 'bg-red-50 border-red-100 text-red-400 cursor-not-allowed line-through'
                            : selectedTime === time
                              ? 'bg-black text-white border-black'
                              : 'bg-white border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Details & Confirm */}
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 h-fit sticky top-24">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">5</span>
                Të Dhënat Tuaja
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Emri</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="Emri juaj"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Mbiemri</label>
                  <input 
                    type="text" 
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="Mbiemri juaj"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Numri i Telefonit</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="+383 44 ..."
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-200">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-stone-500">Shërbimi:</span>
                  <span className="font-bold">{selectedServiceDetails?.name || 'I pazgjedhur'}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-stone-500">Stafi:</span>
                  <span className="font-bold">{selectedStaff ? STAFF.find(s => s.id === selectedStaff)?.name : 'I pazgjedhur'}</span>
                </div>
                <div className="flex justify-between mb-6 text-sm">
                  <span className="text-stone-500">Data & Ora:</span>
                  <span className="font-bold">
                    {format(selectedDate, 'd MMM', { locale: sq })} {selectedTime ? `në ${selectedTime}` : ''}
                  </span>
                </div>

                <div className="flex justify-between mt-4 pt-4 border-t border-stone-200 text-lg font-serif font-bold">
                  <span>Totali:</span>
                  <span>€{selectedServiceDetails?.price || 0}</span>
                </div>

                <button 
                  onClick={handleBooking}
                  disabled={!selectedStaff || !selectedService || !selectedTime || !formData.name || !formData.phone || (selectedStaff && selectedTime ? isSlotBooked(selectedDate, selectedTime, selectedStaff) : false)}
                  className="w-full mt-6 bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  Konfirmo Rezervimin
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="text-2xl font-serif font-bold mb-6">SALLONI IM</div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Destinacioni juaj për bukuri dhe relaks. Ne ofrojmë shërbime premium me produktet më cilësore në treg.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Kontakt</h4>
            <div className="space-y-4 text-stone-400 text-sm">
              <div className="flex items-center gap-3">
                <MapPin size={16} />
                <span>Rruga Nënë Tereza, Prishtinë</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} />
                <span>+383 44 123 456</span>
              </div>
              <div className="flex items-center gap-3">
                <Instagram size={16} />
                <span>@salloniim_official</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Orari</h4>
            <div className="space-y-2 text-stone-400 text-sm">
              <div className="flex justify-between">
                <span>Hënë - Premte</span>
                <span>09:00 - 20:00</span>
              </div>
              <div className="flex justify-between">
                <span>Shtunë</span>
                <span>10:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Diele</span>
                <span>Mbyllur</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-xs text-stone-600">
          © 2024 Salloni Im. Të gjitha të drejtat e rezervuara.
        </div>
      </footer>
    </div>
  );
}
