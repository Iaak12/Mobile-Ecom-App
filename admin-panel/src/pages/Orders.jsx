import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Eye, ChevronRight, Search, Filter, CheckCircle2, Clock, Truck, Package, XCircle } from 'lucide-react';

const STATUS_FLOW = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

const STATUS_CONFIG = {
  Processing: { color: 'bg-orange-100 text-orange-600', icon: Clock },
  Confirmed: { color: 'bg-blue-100 text-blue-600', icon: CheckCircle2 },
  Shipped: { color: 'bg-purple-100 text-purple-600', icon: Package },
  'Out for Delivery': { color: 'bg-cyan-100 text-cyan-600', icon: Truck },
  Delivered: { color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2 },
  Cancelled: { color: 'bg-red-100 text-red-500', icon: XCircle },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get('/orders/admin/all');
      if (data.success) setOrders(data.orders);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const advanceStatus = async (orderId, currentStatus) => {
    const idx = STATUS_FLOW.indexOf(currentStatus);
    if (idx === -1 || idx >= STATUS_FLOW.length - 1) return;
    const next = STATUS_FLOW[idx + 1];
    if (!window.confirm(`Update to "${next}"?`)) return;
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, { status: next });
      fetchOrders();
    } catch { alert('Error updating status'); }
  };

  const filtered = orders.filter(o =>
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Orders</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and fulfill customer orders</p>
        </div>
        <button className="btn-primary px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
          <Package size={16} /> Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:max-w-xs group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-700 input-focus placeholder:text-gray-300"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{orders.length} Orders</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Processing;
                const StatusIcon = cfg.icon;
                const canAdvance = order.status !== 'Delivered' && order.status !== 'Cancelled';
                return (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-black shrink-0">
                          {order.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{order.user?.name || 'Anonymous'}</p>
                          <p className="text-xs text-gray-400">Verified</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-gray-900">₹{order.totalPrice?.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${cfg.color}`}>
                        <StatusIcon size={12} />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all">
                          <Eye size={16} />
                        </button>
                        {canAdvance && (
                          <button
                            onClick={() => advanceStatus(order._id, order.status)}
                            className="p-2 rounded-lg text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                            title="Advance Status"
                          >
                            <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <Package size={48} />
                      <p className="text-sm font-bold uppercase tracking-widest">No Orders Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
