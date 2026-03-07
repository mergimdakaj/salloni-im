import React, { useState } from 'react';
import { useData, Staff } from '../lib/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Mail, Phone, Instagram, X, Check, Trash2 } from 'lucide-react';

export default function StaffPage() {
  const { staff, addStaff, deleteStaff } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Staff>>({
    name: '',
    role: 'Stiliste',
    avatar: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=2669',
    fallbackAvatar: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=2669',
    bio: 'Profesioniste e përkushtuar...',
    experience: 1,
    diplomas: ['Diplomë Profesionale'],
    serviceIds: ['1', '2', '3'] // Default services for simplicity
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStaff(formData as Omit<Staff, 'id'>);
    setIsModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      role: 'Stiliste',
      avatar: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=2669',
      fallbackAvatar: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=2669',
      bio: 'Profesioniste e përkushtuar...',
      experience: 1,
      diplomas: ['Diplomë Profesionale'],
      serviceIds: ['1', '2', '3']
    });
  };

  return (
    <div className="space-y-8 relative">
      <header className="flex justify-between items-end border-b-4 border-black pb-6">
        <div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter">Stafi</h1>
          <p className="text-xl font-bold text-gray-500 mt-2">Ekipi Profesional</p>

        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0070F3] text-white border-2 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_#000000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000000] transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Shto Anëtar
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {staff.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] overflow-hidden group relative"
          >
            <div className="absolute top-2 right-2 z-10 bg-black text-white text-xs font-bold px-2 py-1 uppercase border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]">
              ID: {member.id}
            </div>
            <button
              onClick={() => setDeleteId(member.id)}
              className="absolute top-2 left-2 z-20 bg-red-600 text-white p-1.5 hover:bg-red-700 transition-colors border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000000]"
              title="Fshi Anëtarin"
            >
              <Trash2 size={14} />
            </button>
            <div className="h-48 bg-gray-200 border-b-4 border-black relative overflow-hidden">
              <img 
                src={member.avatar} 
                onError={(e) => e.currentTarget.src = member.fallbackAvatar}
                alt={member.name} 
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-black uppercase leading-none mb-1">{member.name}</h3>
              <p className="text-sm font-bold text-[#FF4D00] uppercase tracking-wider mb-4">{member.role}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Mail size={16} />
                  <span>{member.name.split(' ')[0].toLowerCase()}@salloni.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Phone size={16} />
                  <span>+383 44 000 000</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-black flex justify-between items-center">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
                   <span className="text-xs font-bold uppercase">Online</span>
                </div>
                <button className="p-2 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all">
                  <Instagram size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-4 border-black p-8 max-w-md w-full shadow-[8px_8px_0px_0px_#ffffff]"
            >
              <h2 className="text-2xl font-black uppercase italic mb-4 text-red-600">Konfirmo Fshirjen</h2>
              <p className="font-bold mb-8">A jeni i sigurt që doni ta fshini këtë anëtar? Ky veprim nuk mund të kthehet prapa.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 font-bold uppercase border-2 border-black hover:bg-gray-100 transition-colors"
                >
                  Anulo
                </button>
                <button 
                  onClick={() => {
                    if (deleteId) {
                      deleteStaff(deleteId);
                      setDeleteId(null);
                    }
                  }}
                  className="flex-1 py-3 font-bold uppercase bg-red-600 text-white border-2 border-black hover:bg-red-700 transition-colors shadow-[4px_4px_0px_0px_#000000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000000]"
                >
                  Fshi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Member Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-4 border-black p-8 max-w-md w-full shadow-[8px_8px_0px_0px_#ffffff]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase italic">Shto Anëtar</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Emri dhe Mbiemri</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Roli</label>
                  <select 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full p-3 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="Stiliste">Stiliste</option>
                    <option value="Grimere">Grimere</option>
                    <option value="Estetiste">Estetiste</option>
                    <option value="Menaxhere">Menaxhere</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Vite Eksperiencë</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.experience}
                    onChange={e => setFormData({...formData, experience: Number(e.target.value)})}
                    className="w-full p-3 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 mt-6"
                >
                  <Check size={20} />
                  Shto Anëtarin
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
