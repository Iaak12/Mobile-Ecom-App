import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, Package } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import axiosInstance from '../api/axiosInstance';

const StatCard = ({ icon: Icon, label, value, trend, trendUp = true }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 group">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
        {trend}
      </span>
    </div>
    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-gray-900 tracking-tighter">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0, totalOrders: 0, totalUsers: 0, totalProducts: 0, pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get('/admin/stats');
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Mon', revenue: stats.totalRevenue * 0.10 },
    { name: 'Tue', revenue: stats.totalRevenue * 0.12 },
    { name: 'Wed', revenue: stats.totalRevenue * 0.15 },
    { name: 'Thu', revenue: stats.totalRevenue * 0.11 },
    { name: 'Fri', revenue: stats.totalRevenue * 0.18 },
    { name: 'Sat', revenue: stats.totalRevenue * 0.20 },
    { name: 'Sun', revenue: stats.totalRevenue * 0.14 },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time overview of your store performance</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-fit shadow-sm">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Live</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
          trend="+18.4%"
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={stats.totalOrders}
          trend={`${stats.pendingOrders} pending`}
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={stats.totalUsers}
          trend="Active"
        />
        <StatCard
          icon={TrendingUp}
          label="Products"
          value={stats.totalProducts}
          trend="Live"
        />
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">Revenue Trajectory</h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Weekly growth analysis</p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 px-4 py-2 rounded-xl outline-none cursor-pointer hover:border-primary transition-all">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E11D48" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#CBD5E1" fontSize={11} fontWeight="700" tickLine={false} axisLine={false} dy={8} />
                <YAxis stroke="#CBD5E1" fontSize={11} fontWeight="700" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                  itemStyle={{ color: '#E11D48', fontWeight: '700', fontSize: '13px' }}
                  labelStyle={{ color: '#64748B', fontWeight: '700', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E11D48" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" dot={false} activeDot={{ r: 6, fill: '#E11D48', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 tracking-tight mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Package size={18} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">New Order Confirmed</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">ORD-79{i}22 • {i * 2}m ago</p>
                </div>
                <ArrowUpRight size={16} className="text-gray-300 group-hover:text-primary transition-colors shrink-0" />
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
