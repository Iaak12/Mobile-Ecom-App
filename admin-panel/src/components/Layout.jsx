import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  LogOut, 
  Menu,
  Bell,
  Search,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
      ${isActive 
        ? 'bg-primary/10 text-primary font-bold shadow-sm' 
        : 'text-text-muted hover:bg-background hover:text-primary'}
    `}
  >
    <Icon size={20} className="group-hover:scale-110 transition-transform" />
    <span className="font-semibold">{label}</span>
  </NavLink>
);

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-background text-text-main">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col p-6 fixed h-full bg-surface z-50">
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-10 h-10 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
            <ShoppingBag className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter">THE <span className="text-primary">STORE</span></span>
        </div>

        <nav className="flex-1 space-y-3">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" />
          <SidebarItem icon={Home} label="CMS Admin" to="/cms" />
          <SidebarItem icon={Package} label="Orders List" to="/orders" />
          <SidebarItem icon={ShoppingBag} label="Products" to="/products" />
          <SidebarItem icon={Users} label="Customers" to="/users" />
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-4 text-text-muted hover:text-accent-error hover:bg-accent-error/5 rounded-2xl transition-all duration-200 mt-auto font-bold"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Top Navbar */}
        <header className="h-20 border-b border-border flex items-center justify-between px-10 sticky top-0 bg-surface/80 backdrop-blur-xl z-40">
          <div className="flex items-center bg-background border border-border rounded-2xl px-4 py-2.5 w-[450px]">
            <Search size={18} className="text-text-muted" />
            <input 
              type="text" 
              placeholder="Search store data..." 
              className="bg-transparent border-none outline-none text-sm ml-3 w-full text-text-main font-medium placeholder:text-text-muted"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2.5 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative">
              <Bell size={22} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface shadow-sm"></span>
            </button>
            
            <div className="h-10 w-px bg-border"></div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-text-main">ADMINISTRATOR</p>
                <p className="text-xs text-primary font-black tracking-widest uppercase">Master Control</p>
              </div>
              <div className="w-12 h-12 rounded-2xl gradient-bg p-0.5 shadow-lg shadow-primary-glow">
                <div className="w-full h-full rounded-[14px] bg-surface flex items-center justify-center">
                  <span className="font-black text-primary text-base">AD</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
