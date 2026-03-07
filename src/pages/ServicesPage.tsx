import React, { useState } from 'react';
import { useData, Service } from '../lib/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export default function ServicesPage() {
  const { services, addService, updateService } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    price: 0,
    duration: 30,
    category: 'Flokë',
    color: 'bg-pink-500'
  });

  const categories = Array.from(new Set(services.map(s => s.category)));

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        price: 0,
        duration: 30,
        category: 'Flokë',
        color: 'bg-pink-500'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateService(editingService.id, formData);
    } else {
      addService(formData as Omit<Service, 'id'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('A jeni i sigurt që doni ta fshini këtë shërbim?')) {
      // Assuming deleteService exists or just filter out (need to add delete to context if not present)
      // For now, let's just alert or implement delete in context later if needed.
      // The user asked to change prices and add services.
      alert('Fshirja nuk është implementuar ende.');
    }
  };

  return (
    <div className="space-y-8 relative">
      <header className="flex justify-between items-end border-b-4 border-black pb-6">
        <div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter">Shërbimet</h1>
          <p className="text-xl font-bold text-gray-500 mt-2">Lista e Çmimeve & Kategoritë</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#7928CA] text-white border-2 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_#000000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000000] transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Shto Shërbim
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map(category => (
          <div key={category} className="space-y-4">
            <h2 className="text-3xl font-black uppercase bg-black text-white inline-block px-4 py-2 transform -rotate-1">
              {category}
            </h2>
            
            <div className="space-y-4">
              {services.filter(s => s.category === category).map(service => (
                <motion.div 
                  key={service.id}
                  whileHover={{ x: 5 }}
                  className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000000] relative group"
                >
                  <div className={`absolute top-0 right-0 w-4 h-4 ${service.color} border-l-2 border-b-2 border-black`}></div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg uppercase leading-tight w-3/4">{service.name}</h3>
                    <span className="font-mono font-black text-xl">€{service.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-gray-500 uppercase bg-gray-100 px-2 py-1 border border-black">
                      {service.duration} min
                    </span>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(service)}
                        className="p-1 hover:bg-gray-100 border border-black"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="p-1 hover:bg-red-100 border border-black text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
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
                <h2 className="text-2xl font-black uppercase italic">
                  {editingService ? 'Ndrysho Shërbimin' : 'Shto Shërbim'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Emri i Shërbimit</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Çmimi (€)</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full p-3 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Kohëzgjatja (min)</label>
                    <input 
                      type="number" 
                      required
                      min="5"
                      step="5"
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                      className="w-full p-3 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Kategoria</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                    className="w-full p-3 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="Flokë">Flokë</option>
                    <option value="Thonjtë">Thonjtë</option>
                    <option value="Grim">Grim</option>
                    <option value="Fytyrë">Fytyrë</option>
                    <option value="Trup">Trup</option>
                    <option value="Nuse">Nuse</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 mt-6"
                >
                  <Check size={20} />
                  {editingService ? 'Ruaj Ndryshimet' : 'Shto Shërbimin'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
