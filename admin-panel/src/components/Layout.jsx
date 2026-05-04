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
  Home,
  Tag,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all duration-300 group
      ${isActive 
        ? 'bg-primary/10 text-primary font-black shadow-sm' 
        : 'text-text-muted hover:bg-surface hover:text-primary'}
    `}
  >
    <Icon size={22} className="group-hover:scale-110 transition-transform" />
    <span className="text-sm font-black tracking-tight">{label}</span>
  </NavLink>
);

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-surface text-text-main">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border flex flex-col p-8 fixed h-full bg-white z-50">
        <div className="flex items-center gap-4 px-2 mb-16">
          <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
            <ShoppingBag className="text-white" size={28} />
          </div>
          <span className="text-3xl font-black tracking-tighter">THE <span className="text-primary">STORE</span></span>
        </div>

        <nav className="flex-1 space-y-4">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" />
          <SidebarItem icon={Home} label="CMS Admin" to="/cms" />
          <SidebarItem icon={Package} label="Orders List" to="/orders" />
          <SidebarItem icon={Tag} label="Categories" to="/categories" />
          <SidebarItem icon={CreditCard} label="Payments" to="/payments" />
          <SidebarItem icon={ShoppingBag} label="Products" to="/products" />
          <SidebarItem icon={Users} label="Customers" to="/users" />
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-6 text-text-muted hover:text-primary hover:bg-primary/5 rounded-[24px] border border-transparent hover:border-primary/20 transition-all duration-300 mt-auto font-black text-sm uppercase tracking-widest"
        >
          <LogOut size={22} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 min-h-screen bg-surface">
        {/* Top Navbar */}
        <header className="h-24 border-b border-border flex items-center justify-between px-12 sticky top-0 bg-white/80 backdrop-blur-2xl z-40">
          <div className="flex items-center bg-surface border border-border rounded-2xl px-6 py-3.5 w-[500px] shadow-sm">
            <Search size={20} className="text-text-muted" />
            <input 
              type="text" 
              placeholder="Search store data..." 
              className="bg-transparent border-none outline-none text-sm ml-4 w-full text-text-main font-bold placeholder:text-text-muted"
            />
          </div>

          <div className="flex items-center gap-8">
            <button className="p-3 text-text-muted hover:text-primary hover:bg-primary/5 rounded-2xl transition-all relative">
              <Bell size={24} />
              <span className="absolute top-3 right-3 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-sm"></span>
            </button>
            
            <div className="h-12 w-px bg-border"></div>
            
            <div className="flex items-center gap-5">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Administrator</p>
                <p className="text-sm font-black text-primary tracking-widest uppercase">Master Control</p>
              </div>
              <div className="w-14 h-14 rounded-2xl gradient-bg p-0.5 shadow-xl shadow-primary-glow">
                <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
                  <span className="font-black text-primary text-lg">AD</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
