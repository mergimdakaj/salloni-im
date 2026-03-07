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
    color: 'bg-stone-500' // Default neutral color
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
        color: 'bg-stone-500'
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
      alert('Fshirja nuk është implementuar ende.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-stone-200 pb-8 gap-6">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif text-stone-900 tracking-tight">Shërbimet</h1>
          <div className="h-1 w-20 bg-stone-900"></div>
          <p className="text-stone-500 font-light text-lg max-w-md">
            Eksploroni menunë tonë të kuruar të trajtimeve ekskluzive për bukurinë tuaj.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-stone-900 text-white px-8 py-3 font-medium tracking-wide hover:bg-stone-800 transition-all flex items-center gap-2 rounded-sm"
        >
          <Plus size={18} />
          SHTO SHËRBIM
        </button>
      </header>

      {/* Services Grid - Menu Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
        {categories.map(category => (
          <div key={category} className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-serif text-stone-800 italic">
                {category}
              </h2>
              <div className="flex-1 h-px bg-stone-200 mt-2"></div>
            </div>
            
            <div className="space-y-6">
              {services.filter(s => s.category === category).map(service => (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="group relative flex justify-between items-baseline py-2 border-b border-stone-100 hover:border-stone-300 transition-colors"
                >
                  <div className="flex-1 pr-8">
                    <h3 className="font-medium text-lg text-stone-900 tracking-wide group-hover:text-stone-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-stone-400 font-light mt-1">
                      {service.duration} min
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="font-serif text-xl text-stone-900">
                      €{service.price}
                    </span>
                    
                    {/* Action Buttons - Visible on Hover */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 -top-2 bg-white shadow-sm border border-stone-100 p-1 rounded-md">
                      <button 
                        onClick={() => handleOpenModal(service)}
                        className="p-1.5 hover:bg-stone-100 text-stone-600 transition-colors rounded-sm"
                        title="Ndrysho"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="p-1.5 hover:bg-red-50 text-red-500 transition-colors rounded-sm"
                        title="Fshi"
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

      {/* Add/Edit Modal - Luxury Style */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white p-8 max-w-md w-full shadow-2xl rounded-sm"
            >
              <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
                <h2 className="text-2xl font-serif text-stone-900 italic">
                  {editingService ? 'Ndrysho Shërbimin' : 'Shto Shërbim të Ri'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-stone-500 mb-2">Emri i Shërbimit</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-500 focus:ring-0 transition-colors rounded-sm text-stone-900"
                    placeholder="p.sh. Prerje Flokësh"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-widest text-stone-500 mb-2">Çmimi (€)</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full p-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-500 focus:ring-0 transition-colors rounded-sm text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-widest text-stone-500 mb-2">Kohëzgjatja (min)</label>
                    <input 
                      type="number" 
                      required
                      min="5"
                      step="5"
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                      className="w-full p-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-500 focus:ring-0 transition-colors rounded-sm text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-stone-500 mb-2">Kategoria</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                    className="w-full p-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-500 focus:ring-0 transition-colors rounded-sm text-stone-900"
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
                  className="w-full bg-stone-900 text-white py-4 font-medium tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 mt-8 rounded-sm"
                >
                  <Check size={18} />
                  {editingService ? 'RUAJ NDRYSHIMET' : 'SHTO SHËRBIMIN'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
