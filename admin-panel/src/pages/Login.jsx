import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { 
  Lock, 
  Mail, 
  ShoppingBag, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.post('/auth/login', { email: email.toLowerCase(), password });
      
      if (data.user.role !== 'admin') {
          setError('Access denied. Admin privileges required.');
          return;
      }

      localStorage.setItem('userInfo', JSON.stringify({
          token: data.token,
          ...data.user
      }));
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-primary/5 skew-x-12 -translate-x-1/2"></div>

      <div className="w-full max-w-xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="hidden md:block">
                <div className="w-24 h-24 gradient-bg rounded-[32px] flex items-center justify-center shadow-2xl shadow-primary/30 mb-8 animate-float">
                    <ShoppingBag className="text-white" size={48} />
                </div>
                <h1 className="text-6xl font-black tracking-tighter text-text-main leading-tight">
                    THE <br/> <span className="text-primary">STORE</span>
                </h1>
                <p className="text-text-muted font-bold mt-6 text-lg max-w-[280px]">
                    Master control terminal for global operations.
                </p>
            </div>

            <div className="bg-white p-12 rounded-[56px] border border-border shadow-2xl shadow-slate-200/50">
                <div className="md:hidden text-center mb-10">
                    <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center shadow-primary-glow mx-auto mb-6">
                        <ShoppingBag className="text-white" size={36} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-text-main">THE STORE</h1>
                </div>

                <div className="mb-10">
                    <h2 className="text-3xl font-black tracking-tighter">Welcome back</h2>
                    <p className="text-text-muted font-bold mt-1 text-sm">Please initialize your session</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    {error && (
                    <div className="bg-accent-error/10 border border-accent-error/20 text-accent-error p-5 rounded-[24px] flex items-center gap-4 text-xs font-black uppercase tracking-widest animate-in">
                        <AlertCircle size={20} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Admin Identifier</label>
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={22} />
                            <input
                                required
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface border border-border rounded-[24px] pl-16 pr-6 py-5 text-sm font-bold input-focus outline-none"
                                placeholder="Enter ID"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Access Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={22} />
                            <input
                                required
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-surface border border-border rounded-[24px] pl-16 pr-14 py-5 text-sm font-bold input-focus outline-none"
                                placeholder="••••••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                            </button>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full btn-primary text-white font-black py-6 rounded-[24px] text-sm tracking-[0.2em] uppercase transition-all duration-500 shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Verifying...</span>
                            </div>
                        ) : (
                            'Initialize Session'
                        )}
                    </button>
                </form>
            </div>
        </div>

        <p className="text-center text-text-muted text-[10px] font-black uppercase tracking-[0.3em] mt-16">
          Encryption Secured Terminal • Authorized Personnel Only
        </p>
      </div>
    </div>
  );
};

export default Login;
