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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="blob" style={{ top: '-10%', left: '-10%' }}></div>
      <div className="blob" style={{ bottom: '-10%', right: '-10%', background: 'var(--secondary)', animationDelay: '-5s' }}></div>

      <div className="w-full max-w-md relative z-10 animate-in">
        <div className="text-center mb-10">
          <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center shadow-primary-glow mx-auto mb-6 animate-float">
            <ShoppingBag className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">EliteChoice</h1>
          <p className="text-text-muted text-lg">Administrative Terminal</p>
        </div>

        <div className="glass p-8 rounded-[2rem] shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[2rem] pointer-events-none"></div>
          
          <form onSubmit={handleLogin} className="space-y-6 relative">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-accent-error p-4 rounded-2xl flex items-center gap-3 text-sm animate-in">
                <AlertCircle size={20} className="shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Admin Identifier</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                <input
                  required
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface/50 border border-border rounded-2xl pl-12 pr-4 py-4 text-sm input-focus outline-none text-white"
                  placeholder="Enter ID"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface/50 border border-border rounded-2xl pl-12 pr-12 py-4 text-sm input-focus outline-none text-white"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full btn-primary text-white font-bold py-4 rounded-2xl text-lg relative overflow-hidden active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Initialize Session'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-text-muted text-sm mt-10">
          Encryption Secured Terminal <br/>
          <span className="opacity-50">Authorized Personnel Only</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
