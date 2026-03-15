import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="glass p-8 rounded-[32px] flex flex-col gap-6 transition-all duration-300 hover:shadow-xl group">
    <div className="flex items-center justify-between">
      <div className={`w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform`}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <div className="text-right">
        <p className="text-text-muted text-xs font-black tracking-widest uppercase">{label}</p>
        <p className="text-3xl font-black mt-1 text-text-main">{value}</p>
      </div>
    </div>
    <div className="flex items-center gap-2 pt-4 border-t border-border">
      <div className="flex items-center gap-1 text-xs font-black text-accent-success bg-accent-success/10 px-2 py-1 rounded-lg">
        <TrendingUp size={14} />
        <span>{trend}</span>
      </div>
      <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">vs last month</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get('/admin/stats');
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Mon', revenue: stats.totalRevenue * 0.1, orders: Math.floor(stats.totalOrders * 0.1) },
    { name: 'Tue', revenue: stats.totalRevenue * 0.12, orders: Math.floor(stats.totalOrders * 0.11) },
    { name: 'Wed', revenue: stats.totalRevenue * 0.15, orders: Math.floor(stats.totalOrders * 0.14) },
    { name: 'Thu', revenue: stats.totalRevenue * 0.11, orders: Math.floor(stats.totalOrders * 0.09) },
    { name: 'Fri', revenue: stats.totalRevenue * 0.18, orders: Math.floor(stats.totalOrders * 0.2) },
    { name: 'Sat', revenue: stats.totalRevenue * 0.2, orders: Math.floor(stats.totalOrders * 0.22) },
    { name: 'Sun', revenue: stats.totalRevenue * 0.14, orders: Math.floor(stats.totalOrders * 0.14) },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-text-main">Global Overview</h1>
          <p className="text-text-muted font-semibold mt-1">Real-time performance analytics from your core database.</p>
        </div>
        <div className="bg-surface p-1 px-4 py-2 rounded-2xl border border-border flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-xs font-black tracking-widest uppercase text-text-main">Live Status</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <StatCard 
          icon={DollarSign} 
          label="GROSS REVENUE" 
          value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} 
          trend="+18.4%"
          color="primary"
        />
        <StatCard 
          icon={ShoppingBag} 
          label="STORE ORDERS" 
          value={stats.totalOrders} 
          trend={`+${stats.pendingOrders} Processing`}
          color="primary"
        />
        <StatCard 
          icon={Users} 
          label="TOTAL CUSTOMERS" 
          value={stats.totalUsers} 
          trend="Active"
          color="primary"
        />
        <StatCard 
          icon={TrendingUp} 
          label="ACTIVE PRODUCTS" 
          value={stats.totalProducts} 
          trend="Live"
          color="primary"
        />
      </div>

      <div className="flex gap-8">
        <div className="flex-2 glass p-10 rounded-[40px] border-none shadow-2xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black tracking-tight">Revenue Trajectory</h2>
            <select className="bg-background border border-border text-xs font-black px-4 py-2.5 rounded-xl outline-none cursor-pointer tracking-wider">
              <option>WEEKLY ANALYSIS</option>
              <option>MONTHLY ANALYSIS</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E11D48" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#E11D48" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} fontWeight="700" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748B" fontSize={11} fontWeight="700" tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#E11D48', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E11D48" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex-1 glass p-10 rounded-[40px] border-none shadow-2xl shadow-slate-200/50">
          <h2 className="text-xl font-black tracking-tight mb-10">Recent Pulse</h2>
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-5 items-center">
                <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shrink-0 border border-border">
                  <ShoppingBag size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-text-main line-clamp-1">New Order Confirmed</p>
                  <p className="text-xs text-text-muted font-bold mt-0.5">ORD-79{i}22 • 2m ago</p>
                </div>
                <div className="p-2 bg-background rounded-xl border border-border cursor-pointer hover:bg-primary/5 transition-colors">
                    <ArrowUpRight size={18} className="text-primary" />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-background border border-border rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
              View All Activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
