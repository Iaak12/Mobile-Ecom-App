import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { 
  Eye, 
  ChevronRight, 
  MoreHorizontal,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle
} from 'lucide-react';

const STATUS_FLOW = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

const STATUS_ICONS = {
  Processing: <Clock size={14} className="text-[#F7971E]" />,
  Confirmed: <CheckCircle2 size={14} className="text-[#6C63FF]" />,
  Shipped: <Package size={14} className="text-[#43E97B]" />,
  'Out for Delivery': <Truck size={14} className="text-[#43E97B]" />,
  Delivered: <CheckCircle2 size={14} className="text-[#43E97B]" />,
  Cancelled: <XCircle size={14} className="text-[#FF6584]" />,
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get('/orders/admin/all');
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const advanceStatus = async (orderId, currentStatus) => {
    const currIdx = STATUS_FLOW.indexOf(currentStatus);
    if (currIdx === -1 || currIdx >= STATUS_FLOW.length - 1) return;
    const next = STATUS_FLOW[currIdx + 1];
    
    if (window.confirm(`Update order status to "${next}"?`)) {
        try {
            await axiosInstance.put(`/orders/${orderId}/status`, { status: next });
            fetchOrders();
        } catch (err) {
            alert('Error updating status');
        }
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-main uppercase">Orders Ledger</h1>
          <p className="text-text-muted font-bold mt-2 text-lg">Monitor and fulfill global customer acquisitions.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-border px-8 py-4 rounded-2xl flex items-center gap-3 text-xs font-black tracking-[0.2em] uppercase hover:bg-surface transition-all shadow-sm">
            <Filter size={18} />
            Filter
          </button>
          <button className="bg-primary text-white px-8 py-4 rounded-2xl text-xs font-black tracking-[0.2em] uppercase shadow-2xl shadow-primary/30 flex items-center gap-3 active:scale-95 transition-all">
            <Package size={18} />
            Export Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[48px] overflow-hidden border border-border shadow-2xl shadow-slate-200/20">
        <div className="p-10 border-b border-border bg-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 w-full max-w-xl relative group">
                <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search by Order ID, Customer or Status..." 
                    className="w-full bg-surface border border-border rounded-[24px] pl-16 pr-8 py-5 text-sm font-bold outline-none input-focus transition-all placeholder:text-text-muted text-text-main"
                />
            </div>
            <div className="flex items-center gap-6">
                <div className="px-6 py-3 bg-surface border border-border rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-text-main tracking-[0.2em] uppercase">{orders.length} Active Orders</span>
                </div>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-border bg-surface/30">
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Identification</th>
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Customer Node</th>
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Temporal Info</th>
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Financials</th>
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Fulfillment</th>
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-primary/5 transition-all group cursor-pointer">
                  <td className="px-10 py-8">
                    <span className="text-sm font-black text-primary tracking-widest bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
                        #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[18px] gradient-bg p-0.5 shadow-lg shadow-primary/10">
                        <div className="w-full h-full rounded-[16px] bg-white flex items-center justify-center text-primary text-sm font-black">
                            {order.user?.name?.charAt(0) || 'U'}
                        </div>
                      </div>
                      <div>
                        <p className="text-base font-black text-text-main group-hover:text-primary transition-colors tracking-tighter">{order.user?.name || 'Anonymous'}</p>
                        <p className="text-[10px] text-text-muted font-bold mt-1 tracking-widest uppercase">Verified Account</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-1">
                        <p className="text-sm font-black text-text-main tracking-tight">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{new Date(order.createdAt).getFullYear()}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center text-lg font-black text-text-main tracking-tighter">
                        <span className="text-primary mr-1">₹</span>
                        <span>{order.totalPrice.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3 bg-white border border-border rounded-2xl px-5 py-2.5 w-fit shadow-sm">
                      {STATUS_ICONS[order.status]}
                      <span className="text-[10px] font-black text-text-main uppercase tracking-widest">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <button 
                        className="w-12 h-12 flex items-center justify-center bg-white border border-border rounded-2xl text-text-muted hover:text-primary hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                      >
                        <Eye size={20} />
                      </button>
                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); advanceStatus(order._id, order.status); }}
                          className="w-12 h-12 flex items-center justify-center bg-accent-success/5 border border-accent-success/10 rounded-2xl text-accent-success hover:bg-accent-success hover:text-white hover:border-accent-success transition-all duration-300 shadow-sm"
                        >
                          <ChevronRight size={20} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-10 border-t border-border bg-surface/30 flex justify-center">
            <button className="text-[10px] font-black tracking-[0.3em] uppercase text-text-muted hover:text-primary transition-colors py-2">
                Scan Historical Transactions
            </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
