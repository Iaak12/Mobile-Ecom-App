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
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-text-main">User Registry</h1>
          <p className="text-text-muted font-semibold mt-1">Manage official customer accounts and permissions.</p>
        </div>
        <button className="bg-primary text-white px-8 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-black tracking-widest uppercase hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
          <UserPlus size={20} />
          Invite Associate
        </button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {users.map((user) => (
          <div key={user._id} className="glass p-8 rounded-[32px] group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50">
            <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={() => deleteUser(user._id)}
                  className="p-3 bg-red-50 text-primary rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white"
                >
                  <Trash2 size={18} />
                </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-[32px] gradient-bg p-1 shadow-xl mb-6 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[28px] bg-surface flex items-center justify-center">
                  <span className="text-3xl font-black text-primary">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-8 w-full">
                <h3 className="text-xl font-black text-text-main flex items-center justify-center gap-2">
                  {user.name}
                  {user.role === 'admin' && (
                    <div className="p-1 bgColor-primary/10 rounded-lg">
                      <ShieldCheck size={18} className="text-primary" />
                    </div>
                  )}
                </h3>
                <div className="flex items-center justify-center gap-2 text-text-muted font-bold text-sm bg-background py-1.5 px-4 rounded-xl w-fit mx-auto">
                  <Mail size={14} className="text-primary" />
                  {user.email}
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-text-muted font-bold mt-4">
                  <Calendar size={14} />
                  Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </div>
              </div>

              <button 
                onClick={() => toggleAdmin(user._id, user.role)}
                className={`w-full py-4 rounded-2xl text-xs font-black tracking-widest uppercase transition-all duration-300 border ${
                  user.role === 'admin' 
                  ? 'bg-background border-border text-text-muted hover:border-primary hover:text-primary' 
                  : 'bg-primary text-white border-primary hover:shadow-lg shadow-primary/20'
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
