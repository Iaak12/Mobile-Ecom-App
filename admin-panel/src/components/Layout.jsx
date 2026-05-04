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
  CreditCard,
  X
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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-surface text-text-main relative">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-text-main/20 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 border-r border-border flex flex-col p-8 bg-white z-[70] transition-transform duration-500 ease-[0.16, 1, 0.3, 1]
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-16 px-2">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 shrink-0">
                    <ShoppingBag className="text-white" size={28} />
                </div>
                <span className="text-3xl font-black tracking-tighter whitespace-nowrap">THE <span className="text-primary">STORE</span></span>
            </div>
            <button className="lg:hidden p-2 text-text-muted hover:text-primary transition-colors" onClick={() => setIsSidebarOpen(false)}>
                <X size={24} />
            </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
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
          className="flex items-center gap-4 px-6 py-5 text-text-muted hover:text-primary hover:bg-primary/5 rounded-[24px] border border-transparent hover:border-primary/20 transition-all duration-300 mt-auto font-black text-sm uppercase tracking-widest shrink-0"
        >
          <LogOut size={22} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen bg-surface flex flex-col transition-all duration-500">
        {/* Top Navbar */}
        <header className="h-24 border-b border-border flex items-center justify-between px-6 md:px-12 sticky top-0 bg-white/80 backdrop-blur-2xl z-40 gap-6">
          <div className="flex items-center gap-4 lg:hidden">
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-3 bg-surface border border-border rounded-xl text-text-muted hover:text-primary transition-all active:scale-95 shadow-sm"
            >
                <Menu size={24} />
            </button>
          </div>

          <div className="hidden md:flex items-center bg-surface border border-border rounded-2xl px-6 py-3.5 flex-1 max-w-[500px] shadow-sm group focus-within:border-primary/20 transition-all">
            <Search size={20} className="text-text-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search store data..." 
              className="bg-transparent border-none outline-none text-sm ml-4 w-full text-text-main font-bold placeholder:text-text-muted"
            />
          </div>

          <div className="flex items-center gap-4 md:gap-8 ml-auto">
            <button className="p-3 text-text-muted hover:text-primary hover:bg-primary/5 rounded-2xl transition-all relative">
              <Bell size={24} />
              <span className="absolute top-3 right-3 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-sm"></span>
            </button>
            
            <div className="h-10 w-px bg-border hidden md:block"></div>
            
            <div className="flex items-center gap-3 md:gap-5">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-0.5">Administrator</p>
                <p className="text-sm font-black text-primary tracking-widest uppercase">Master Control</p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl gradient-bg p-0.5 shadow-xl shadow-primary/20 shrink-0">
                <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
                  <span className="font-black text-primary text-base md:text-lg">AD</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-10 lg:p-12 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
