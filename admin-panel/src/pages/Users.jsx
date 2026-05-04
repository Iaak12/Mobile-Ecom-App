import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { 
  Users as UsersIcon, 
  ShieldCheck, 
  Trash2, 
  Mail, 
  Calendar,
  UserPlus
} from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/users');
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (id, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Are you sure you want to change this user's role to "${nextRole}"?`)) {
        try {
            const { data } = await axiosInstance.put(`/admin/users/${id}`, { role: nextRole });
            if (data.success) {
                fetchUsers();
            }
        } catch (err) {
            alert('Error updating user role');
        }
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
        try {
            const { data } = await axiosInstance.delete(`/admin/users/${id}`);
            if (data.success) {
                fetchUsers();
            }
        } catch (err) {
            alert('Error deactivating user');
        }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-text-main uppercase leading-none">User Registry</h1>
          <p className="text-text-muted font-bold mt-3 text-lg leading-relaxed">Manage official customer accounts and permissions.</p>
        </div>
        <button className="btn-primary px-10 py-5 rounded-[24px] flex items-center justify-center gap-4 text-xs font-black tracking-[0.2em] uppercase active:scale-95 shadow-2xl shadow-primary/30 w-full lg:w-auto">
          <UserPlus size={22} />
          Invite Associate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {users.map((user) => (
          <div key={user._id} className="bg-white p-10 rounded-[48px] group relative overflow-hidden transition-all duration-500 border border-border hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 shadow-sm">
            <div className="absolute top-6 right-6">
                <button 
                  onClick={() => deleteUser(user._id)}
                  className="w-12 h-12 bg-accent-error/5 text-accent-error rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-accent-error hover:text-white flex items-center justify-center border border-accent-error/10 shadow-sm"
                >
                  <Trash2 size={20} />
                </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-[40px] gradient-bg p-1 shadow-2xl shadow-primary/20 mb-8 group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full rounded-[36px] bg-white flex items-center justify-center">
                  <span className="text-4xl font-black text-primary tracking-tighter">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-10 w-full">
                <h3 className="text-2xl font-black text-text-main flex items-center justify-center gap-3 tracking-tighter truncate px-4">
                  {user.name}
                  {user.role === 'admin' && (
                    <div className="p-1.5 bg-primary/10 rounded-xl shrink-0">
                      <ShieldCheck size={20} className="text-primary" />
                    </div>
                  )}
                </h3>
                <div className="flex items-center justify-center gap-3 text-text-muted font-black text-[10px] uppercase tracking-widest bg-surface py-3 px-6 rounded-2xl w-fit mx-auto border border-border shadow-sm truncate max-w-full">
                  <Mail size={16} className="text-primary shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-8 opacity-60">
                  <Calendar size={16} />
                  Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </div>
              </div>

              <button 
                onClick={() => toggleAdmin(user._id, user.role)}
                className={`w-full py-5 rounded-[24px] text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 border ${
                  user.role === 'admin' 
                  ? 'bg-white border-border text-text-muted hover:border-primary hover:text-primary hover:bg-primary/5 shadow-sm' 
                  : 'bg-primary text-white border-primary shadow-xl shadow-primary/20 hover:scale-[1.02]'
                }`}
              >
                {user.role === 'admin' ? 'Revoke Master Access' : 'Elevate to Admin'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
