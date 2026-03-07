import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login();
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elegant Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-stone-100 rounded-full blur-3xl opacity-60"></div>
         <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-stone-200 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-stone-500 hover:text-black mb-8 transition-colors text-sm font-medium group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kthehu te Ballina
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-xl p-10 shadow-2xl shadow-stone-200/50 rounded-3xl border border-white"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold mb-3 tracking-tight">SALLONI IM</h1>
            <p className="text-stone-500 text-sm font-medium tracking-wide uppercase">Hyrje për Staf</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Email</label>
              <input 
                type="email" 
                defaultValue="admin@salloni.com"
                className="w-full bg-white border border-stone-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all shadow-sm"
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 ml-1">Fjalëkalimi</label>
              <input 
                type="password" 
                defaultValue="password"
                className="w-full bg-white border border-stone-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-stone-800 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-4"
            >
              {isLoading ? 'Duke u kyçur...' : 'Hyni në Panel'}
            </button>
          </form>
        </motion.div>
        
        <p className="text-center text-stone-400 text-xs mt-8">
          © 2024 Salloni Im. Të gjitha të drejtat e rezervuara.
        </p>
      </div>
    </div>
  );
}
