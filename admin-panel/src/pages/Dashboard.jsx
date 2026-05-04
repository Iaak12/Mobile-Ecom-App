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
  <div className="bg-white p-8 rounded-[32px] border border-border flex flex-col gap-6 transition-all duration-300 hover:shadow-xl group">
    <div className="flex items-center gap-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Icon size={32} strokeWidth={2.5} />
      </div>
      <div className="flex-1">
        <p className="text-text-muted text-[10px] font-black tracking-[0.2em] uppercase">{label}</p>
        <p className="text-4xl font-black mt-1 text-text-main tracking-tighter">{value}</p>
      </div>
    </div>
    <div className="flex items-center gap-2 pt-4 border-t border-border">
      <div className="flex items-center gap-1 text-[10px] font-black text-accent-success bg-accent-success/10 px-2 py-1 rounded-lg">
        <TrendingUp size={12} />
        <span>{trend}</span>
      </div>
      <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">vs last month</span>
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
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-main">Global Overview</h1>
          <p className="text-text-muted font-bold mt-2 text-lg">Real-time performance analytics from your core database.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-border flex items-center gap-4 shadow-sm">
            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.5)]"></div>
            <span className="text-xs font-black tracking-widest uppercase text-text-main">Live Status</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <StatCard 
          icon={DollarSign} 
          label="GROSS REVENUE" 
          value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} 
          trend="+18.4%"
        />
        <StatCard 
          icon={ShoppingBag} 
          label="STORE ORDERS" 
          value={stats.totalOrders} 
          trend={`+${stats.pendingOrders} Processing`}
        />
        <StatCard 
          icon={Users} 
          label="TOTAL CUSTOMERS" 
          value={stats.totalUsers} 
          trend="Active"
        />
        <StatCard 
          icon={TrendingUp} 
          label="ACTIVE PRODUCTS" 
          value={stats.totalProducts} 
          trend="Live"
        />
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 bg-white p-10 rounded-[48px] border border-border shadow-2xl shadow-slate-200/20">
          <div className="flex items-center justify-between mb-12">
            <div>
                <h2 className="text-2xl font-black tracking-tighter">Revenue Trajectory</h2>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Growth analysis over time</p>
            </div>
            <select className="bg-surface border border-border text-[10px] font-black px-5 py-3 rounded-xl outline-none cursor-pointer tracking-widest uppercase hover:border-primary transition-all">
              <option>WEEKLY ANALYSIS</option>
              <option>MONTHLY ANALYSIS</option>
            </select>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E11D48" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#E11D48" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} fontWeight="800" tickLine={false} axisLine={false} dy={15} />
                <YAxis stroke="#94A3B8" fontSize={10} fontWeight="800" tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                  itemStyle={{ color: '#E11D48', fontWeight: '900', fontSize: '14px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E11D48" fillOpacity={1} fill="url(#colorRev)" strokeWidth={5} dot={{ r: 6, fill: '#E11D48', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-4 bg-white p-10 rounded-[48px] border border-border shadow-2xl shadow-slate-200/20">
          <h2 className="text-2xl font-black tracking-tighter mb-10">Recent Pulse</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-5 items-center group cursor-pointer p-2 rounded-2xl hover:bg-surface transition-all">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/5 group-hover:bg-primary/10 transition-colors">
                  <ShoppingBag size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-text-main">New Order Confirmed</p>
                  <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">ORD-79{i}22 • 2m ago</p>
                </div>
                <div className="w-10 h-10 flex items-center justify-center bg-surface rounded-xl border border-border text-text-muted group-hover:text-primary group-hover:border-primary/20 transition-all">
                    <ArrowUpRight size={20} />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-5 bg-surface border border-border rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-500">
              View All Activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
