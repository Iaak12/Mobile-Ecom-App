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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-text-muted">Manage and track all customer orders.</p>
        </div>
        <div className="flex gap-3">
          <button className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-surface transition-colors">
            <Filter size={16} />
            Filter
          </button>
          <button className="gradient-bg px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg shadow-primary-glow flex items-center gap-2">
            Export JSON
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface/30">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-surface/20 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-primary font-bold">#{order._id.slice(-8).toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {order.user?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-medium">{order.user?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">
                    ₹{order.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 bg-surface/50 border border-border rounded-lg px-2 py-1 w-fit">
                      {STATUS_ICONS[order.status]}
                      <span className="text-xs font-medium">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-2 hover:bg-surface rounded-lg text-text-muted hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <button 
                          onClick={() => advanceStatus(order._id, order.status)}
                          className="p-2 hover:bg-surface rounded-lg text-accent-success hover:bg-accent-success/10 transition-colors"
                          title="Advance Status"
                        >
                          <ChevronRight size={18} />
                        </button>
                      )}
                      <button className="p-2 hover:bg-surface rounded-lg text-text-muted hover:text-white transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
