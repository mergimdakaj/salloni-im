import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Scissors, LogOut, Settings, Menu, X, DollarSign, TrendingUp } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { motion } from 'motion/react';

export default function DashboardLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#F5F5F4] text-stone-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-stone-200 flex flex-col transition-all duration-300 z-20`}
      >
        <div className="p-6 flex items-center justify-between border-b border-stone-100 h-20">
          {isSidebarOpen ? (
            <h1 className="text-xl font-serif font-bold tracking-tight">SALLONI IM</h1>
          ) : (
            <span className="text-xl font-serif font-bold mx-auto">S</span>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-stone-100 rounded-lg text-stone-400">
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-lg">
              {user?.name.charAt(0)}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.name}</p>
                <p className="text-xs text-stone-500 truncate">{user?.role}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Paneli" isOpen={isSidebarOpen} />
          <NavItem to="/dashboard/calendar" icon={<Calendar size={20} />} label="Kalendari" isOpen={isSidebarOpen} />
          <NavItem to="/dashboard/services" icon={<Scissors size={20} />} label="Shërbimet" isOpen={isSidebarOpen} />
          <NavItem to="/dashboard/staff" icon={<Users size={20} />} label="Stafi" isOpen={isSidebarOpen} />
          <NavItem to="/dashboard/expenses" icon={<DollarSign size={20} />} label="Shpenzimet" isOpen={isSidebarOpen} />
          <NavItem to="/dashboard/finances" icon={<TrendingUp size={20} />} label="Financat" isOpen={isSidebarOpen} />
          <NavItem to="/dashboard/settings" icon={<Settings size={20} />} label="Cilësimet" isOpen={isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-stone-100">
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Dilni</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, isOpen }: { to: string; icon: React.ReactNode; label: string; isOpen: boolean }) {
  return (
    <NavLink
      to={to}
      end={to === '/dashboard'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-lg ${
          isActive
            ? 'bg-stone-900 text-white shadow-md'
            : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
        } ${!isOpen && 'justify-center px-2'}`
      }
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </NavLink>
  );
}
