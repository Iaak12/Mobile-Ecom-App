import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { 
  CreditCard, 
  Check, 
  X, 
  Settings as SettingsIcon,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Globe,
  QrCode
} from 'lucide-react';

const PaymentSettings = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const { data } = await axiosInstance.get('/payments/methods');
      if (data.success) {
        setMethods(data.methods);
        if (data.methods.length > 0) {
            setSelectedMethod(data.methods[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
        const { data } = await axiosInstance.put(`/payments/methods/${id}/toggle`);
        if (data.success) {
            setMethods(methods.map(m => m._id === id ? data.method : m));
            if (selectedMethod?._id === id) {
                setSelectedMethod(data.method);
            }
        }
    } catch (err) {
        alert('Error toggling payment method');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
        const { data } = await axiosInstance.post('/payments/methods', selectedMethod);
        if (data.success) {
            setMethods(methods.map(m => m.name === selectedMethod.name ? data.method : m));
            alert('Configuration updated successfully');
        }
    } catch (err) {
        alert('Error updating configuration');
    } finally {
        setSaving(false);
    }
  };

  const updateConfig = (key, value) => {
    setSelectedMethod({
        ...selectedMethod,
        config: {
            ...selectedMethod.config,
            [key]: value
        }
    });
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
          <h1 className="text-4xl font-black tracking-tighter text-text-main">Financial Infrastructure</h1>
          <p className="text-text-muted font-semibold mt-1">Configure payment gateways and transaction processing logic.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Sidebar: Method Selection */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {methods.map((method) => (
            <button
              key={method._id}
              onClick={() => setSelectedMethod(method)}
              className={`w-full p-6 rounded-[32px] text-left transition-all border-2 flex items-center justify-between group ${
                selectedMethod?._id === method._id 
                ? 'bg-surface border-primary shadow-xl shadow-primary/10' 
                : 'bg-surface border-transparent hover:border-border'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${
                    method.name === 'Razorpay' ? 'bg-blue-50 text-blue-600' :
                    method.name === 'PayPal' ? 'bg-indigo-50 text-indigo-600' :
                    'bg-orange-50 text-orange-600'
                }`}>
                    {method.name === 'Razorpay' && <Zap size={24} />}
                    {method.name === 'PayPal' && <Globe size={24} />}
                    {method.name === 'UPI' && <QrCode size={24} />}
                </div>
                <div>
                  <h3 className="font-black text-text-main tracking-tight uppercase text-sm">{method.name}</h3>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{method.type === 'gateway' ? 'Payment Gateway' : 'Direct Transfer'}</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${method.isEnabled ? 'bg-primary' : 'bg-border'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${method.isEnabled ? 'left-7' : 'left-1'}`}></div>
              </div>
            </button>
          ))}

          <div className="p-8 bg-primary/5 rounded-[32px] border border-primary/10">
            <div className="flex items-center gap-3 text-primary mb-4">
                <ShieldCheck size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Security Protocol</span>
            </div>
            <p className="text-xs font-bold text-text-muted leading-relaxed">
                All API keys and secrets are encrypted at rest. Never share your production credentials with unauthorized personnel.
            </p>
          </div>
        </div>

        {/* Right Content: Configuration Form */}
        <div className="col-span-12 lg:col-span-8">
          {selectedMethod ? (
            <div className="glass rounded-[40px] p-10 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-background rounded-3xl flex items-center justify-center border border-border">
                        {selectedMethod.name === 'Razorpay' && <Zap size={32} className="text-blue-600" />}
                        {selectedMethod.name === 'PayPal' && <Globe size={32} className="text-indigo-600" />}
                        {selectedMethod.name === 'UPI' && <QrCode size={32} className="text-orange-600" />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase">{selectedMethod.name} Configuration</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`w-2 h-2 rounded-full ${selectedMethod.isEnabled ? 'bg-accent-success' : 'bg-accent-error'}`}></span>
                            <span className="text-xs font-black text-text-muted tracking-widest uppercase">
                                {selectedMethod.isEnabled ? 'Service Operational' : 'Service Suspended'}
                            </span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => handleToggle(selectedMethod._id)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
                        selectedMethod.isEnabled 
                        ? 'bg-red-50 text-primary border border-red-100 hover:bg-primary hover:text-white' 
                        : 'bg-primary text-white shadow-lg shadow-primary/20'
                    }`}
                >
                    {selectedMethod.isEnabled ? 'Deactivate' : 'Activate'}
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  {selectedMethod.name !== 'UPI' && (
                    <div className="col-span-2">
                        <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase block mb-3 ml-1">Environment Mode</label>
                        <div className="flex gap-4">
                            {['sandbox', 'live'].map(mode => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setSelectedMethod({...selectedMethod, config: {...selectedMethod.config, mode}})}
                                    className={`flex-1 py-4 rounded-2xl font-black tracking-widest uppercase text-xs border-2 transition-all ${
                                        selectedMethod.config?.mode === mode 
                                        ? 'bg-primary/10 border-primary text-primary' 
                                        : 'bg-background border-border text-text-muted hover:border-text-muted'
                                    }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>
                  )}

                  {selectedMethod.name === 'Razorpay' && (
                    <>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase block mb-3 ml-1">Key ID</label>
                            <input 
                                value={selectedMethod.config?.apiKey || ''}
                                onChange={(e) => updateConfig('apiKey', e.target.value)}
                                className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all" 
                                placeholder="rzp_test_..."
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase block mb-3 ml-1">Key Secret</label>
                            <input 
                                type="password"
                                value={selectedMethod.config?.apiSecret || ''}
                                onChange={(e) => updateConfig('apiSecret', e.target.value)}
                                className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all" 
                                placeholder="••••••••••••••••"
                            />
                        </div>
                    </>
                  )}

                  {selectedMethod.name === 'PayPal' && (
                    <>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase block mb-3 ml-1">Client ID</label>
                            <input 
                                value={selectedMethod.config?.apiKey || ''}
                                onChange={(e) => updateConfig('apiKey', e.target.value)}
                                className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all" 
                                placeholder="Client ID from PayPal Developer Dashboard"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase block mb-3 ml-1">Secret Key</label>
                            <input 
                                type="password"
                                value={selectedMethod.config?.apiSecret || ''}
                                onChange={(e) => updateConfig('apiSecret', e.target.value)}
                                className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all" 
                                placeholder="••••••••••••••••"
                            />
                        </div>
                    </>
                  )}

                  {selectedMethod.name === 'UPI' && (
                    <>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase block mb-3 ml-1">UPI ID (VPA)</label>
                            <input 
                                value={selectedMethod.config?.vpa || ''}
                                onChange={(e) => updateConfig('vpa', e.target.value)}
                                className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all" 
                                placeholder="e.g. merchant@upi"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase block mb-3 ml-1">Payee Name</label>
                            <input 
                                value={selectedMethod.config?.payeeName || ''}
                                onChange={(e) => updateConfig('payeeName', e.target.value)}
                                className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary outline-none transition-all" 
                                placeholder="Legal business name"
                            />
                        </div>
                    </>
                  )}
                </div>

                <div className="pt-6">
                    <button 
                        type="submit"
                        disabled={saving}
                        className="w-full bg-primary text-white font-black tracking-[0.2em] uppercase py-5 rounded-2xl shadow-xl shadow-primary/20 flex justify-center items-center gap-3 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saving ? (
                          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <SettingsIcon size={20} />
                            Commit Configuration
                          </>
                        )}
                    </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="glass rounded-[40px] p-20 flex flex-col items-center justify-center text-center">
                <CreditCard size={64} className="text-text-muted mb-6" />
                <h2 className="text-2xl font-black tracking-tighter">No Method Selected</h2>
                <p className="text-text-muted font-bold mt-2">Select a payment provider from the sidebar to begin configuration.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
