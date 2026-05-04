import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Users, Package, LogOut,
  Menu, Bell, Search, Home, Tag, CreditCard, X
} from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive
          ? 'bg-primary/10 text-primary font-bold'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`
    }
  >
    <Icon size={20} className="shrink-0" />
    <span className="text-sm font-semibold">{label}</span>
  </NavLink>
);

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/30">
              <ShoppingBag className="text-white" size={18} />
            </div>
            <span className="text-xl font-black tracking-tighter">
              THE <span className="text-primary">STORE</span>
            </span>
          </div>
          <button
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={closeSidebar}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest px-4 mb-3">Main</p>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" onClick={closeSidebar} />
          <SidebarItem icon={Package} label="Orders" to="/orders" onClick={closeSidebar} />
          <SidebarItem icon={ShoppingBag} label="Products" to="/products" onClick={closeSidebar} />
          <SidebarItem icon={Tag} label="Categories" to="/categories" onClick={closeSidebar} />
          <SidebarItem icon={Users} label="Customers" to="/users" onClick={closeSidebar} />

          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest px-4 mb-3 pt-4">Settings</p>
          <SidebarItem icon={CreditCard} label="Payments" to="/payments" onClick={closeSidebar} />
          <SidebarItem icon={Home} label="CMS Admin" to="/cms" onClick={closeSidebar} />
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 gap-4">
          {/* Mobile menu btn */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-primary transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 flex-1 max-w-sm group focus-within:border-primary/50 focus-within:bg-white transition-all">
            <Search size={16} className="text-gray-400 group-focus-within:text-primary transition-colors shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 font-medium placeholder:text-gray-300 w-full"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2.5 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-900 leading-tight">Administrator</p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Master Control</p>
              </div>
              <div className="w-9 h-9 rounded-xl gradient-bg p-0.5 shadow-lg shadow-primary/20 shrink-0">
                <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                  <span className="font-black text-primary text-xs">AD</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
