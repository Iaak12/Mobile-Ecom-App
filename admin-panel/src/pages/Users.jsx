import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Search, Users as UsersIcon, Mail, Phone, MapPin, Shield, UserX } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/users');
      if (data.success) setUsers(data.users);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Customers</h1>
          <p className="text-gray-400 text-sm mt-1">Manage registered users and their accounts</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
          <UsersIcon size={16} className="text-primary" />
          <span className="text-sm font-bold text-gray-700">{users.length} Users</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-xs group">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-700 input-focus placeholder:text-gray-300 shadow-sm"
        />
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((user) => (
          <div key={user._id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 group">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white font-black text-lg shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-black text-gray-900 truncate">{user.name}</p>
                  {user.role === 'admin' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
                      <Shield size={10} /> Admin
                    </span>
                  )}
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail size={12} className="shrink-0" />
                    <span className="text-xs font-medium truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Phone size={12} className="shrink-0" />
                      <span className="text-xs font-medium">{user.phone}</span>
                    </div>
                  )}
                  {user.addresses?.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={12} className="shrink-0" />
                      <span className="text-xs font-medium truncate">
                        {user.addresses[0].city}, {user.addresses[0].state}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user.isActive !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {user.isActive !== false ? 'Active' : 'Inactive'}
              </span>
              <p className="text-xs text-gray-300 font-medium">
                {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="flex flex-col items-center gap-3 opacity-30">
              <UserX size={48} />
              <p className="text-sm font-bold uppercase tracking-widest">No Users Found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
