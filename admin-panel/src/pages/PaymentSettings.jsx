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
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const { data } = await axiosInstance.get('/payments/methods');
      if (data.success) {
        setMethods(data.methods);
      }
    } catch (err) {
      console.error('Failed to fetch payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfig = (method) => {
    setSelectedMethod({ ...method });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
        const { data } = await axiosInstance.post('/payments/methods', selectedMethod);
        if (data.success) {
            setMethods(methods.map(m => m.name === selectedMethod.name ? data.method : m));
            setShowModal(false);
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

  const sections = [
    { name: 'General', icon: SettingsIcon },
    { name: 'Notifications', icon: Globe },
    { name: 'Security', icon: ShieldCheck },
    { name: 'Payments', icon: CreditCard, active: true },
    { name: 'Shipping', icon: Zap },
    { name: 'Appearance', icon: QrCode },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-main uppercase">Settings</h1>
          <p className="text-text-muted font-bold mt-2 text-lg">Manage your store configuration</p>
        </div>
        <button className="bg-[#B97A67] text-white px-10 py-5 rounded-2xl flex items-center gap-4 text-xs font-black tracking-[0.2em] uppercase shadow-xl hover:opacity-90 transition-all">
          <SettingsIcon size={20} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Settings Navigation */}
        <div className="col-span-12 lg:col-span-3 bg-white border border-border rounded-[32px] p-4 h-fit">
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.name}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all font-black text-sm tracking-tight ${
                  section.active 
                  ? 'bg-red-50 text-primary shadow-sm' 
                  : 'text-text-muted hover:bg-surface hover:text-text-main'
                }`}
              >
                <section.icon size={22} className={section.active ? 'text-primary' : 'text-text-muted'} />
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Methods List */}
        <div className="col-span-12 lg:col-span-9 bg-white border border-border rounded-[40px] p-12">
          <h2 className="text-2xl font-black tracking-tighter uppercase mb-12">Payment Settings</h2>
          
          <div className="space-y-6">
            {methods.map((method) => (
              <div 
                key={method._id} 
                className={`flex items-center justify-between p-8 rounded-[32px] border-2 transition-all duration-300 ${
                  method.isEnabled ? 'bg-accent-success/5 border-accent-success/20' : 'bg-surface border-border'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl border border-border flex items-center justify-center shadow-sm">
                    <CreditCard size={28} className={method.isEnabled ? 'text-accent-success' : 'text-text-muted'} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-text-main tracking-tight">{method.name}</h3>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${method.isEnabled ? 'text-accent-success' : 'text-text-muted'}`}>
                      {method.isEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                <button 
                    onClick={() => handleOpenConfig(method)}
                    className="px-8 py-3.5 bg-white border-2 border-border rounded-xl text-xs font-black tracking-[0.2em] uppercase hover:border-primary hover:text-primary transition-all shadow-sm"
                >
                    Configure
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {showModal && selectedMethod && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-text-main/10 backdrop-blur-3xl" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[48px] overflow-hidden shadow-[0_64px_96px_-32px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-border flex items-center justify-between bg-surface/30">
                <div className="flex items-center gap-4">
                    <CreditCard size={24} className="text-text-main" />
                    <h3 className="text-xl font-black tracking-tighter uppercase">Configure {selectedMethod.name}</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-red-50 hover:text-primary rounded-xl transition-all">
                    <X size={24} />
                </button>
            </div>

            <div className="p-10 space-y-10">
              {/* Toggle Switch Area */}
              <div className="bg-surface p-8 rounded-[32px] border border-border flex items-center justify-between group cursor-pointer" 
                   onClick={() => setSelectedMethod({...selectedMethod, isEnabled: !selectedMethod.isEnabled})}>
                <div>
                  <h4 className="font-black text-text-main tracking-tight">Enable {selectedMethod.name.toUpperCase()}</h4>
                  <p className="text-xs font-bold text-text-muted mt-1">Allow customers to pay using this gateway</p>
                </div>
                <div className={`w-14 h-8 rounded-full relative transition-all duration-500 ${selectedMethod.isEnabled ? 'bg-primary' : 'bg-border'}`}>
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-500 ${selectedMethod.isEnabled ? 'left-7' : 'left-1'}`}></div>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-8">
                {selectedMethod.name === 'Razorpay' && (
                  <>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Key ID</label>
                        <input 
                            value={selectedMethod.config?.apiKey || ''}
                            onChange={(e) => updateConfig('apiKey', e.target.value)}
                            className="w-full bg-[#EBF2FE] border-none rounded-2xl px-6 py-5 text-sm font-bold outline-none" 
                            placeholder="admin@nazrakart.com"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Key Secret</label>
                        <input 
                            type="password"
                            value={selectedMethod.config?.apiSecret || ''}
                            onChange={(e) => updateConfig('apiSecret', e.target.value)}
                            className="w-full bg-[#EBF2FE] border-none rounded-2xl px-6 py-5 text-sm font-bold outline-none" 
                            placeholder="••••••••••••••••"
                        />
                    </div>
                  </>
                )}

                {selectedMethod.name === 'PayPal' && (
                  <>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Client ID</label>
                        <input 
                            value={selectedMethod.config?.apiKey || ''}
                            onChange={(e) => updateConfig('apiKey', e.target.value)}
                            className="w-full bg-[#EBF2FE] border-none rounded-2xl px-6 py-5 text-sm font-bold outline-none" 
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Secret Key</label>
                        <input 
                            type="password"
                            value={selectedMethod.config?.apiSecret || ''}
                            onChange={(e) => updateConfig('apiSecret', e.target.value)}
                            className="w-full bg-[#EBF2FE] border-none rounded-2xl px-6 py-5 text-sm font-bold outline-none" 
                        />
                    </div>
                  </>
                )}

                {selectedMethod.name === 'UPI' && (
                  <>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">UPI ID (VPA)</label>
                        <input 
                            value={selectedMethod.config?.vpa || ''}
                            onChange={(e) => updateConfig('vpa', e.target.value)}
                            className="w-full bg-[#EBF2FE] border-none rounded-2xl px-6 py-5 text-sm font-bold outline-none" 
                            placeholder="merchant@upi"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Payee Name</label>
                        <input 
                            value={selectedMethod.config?.payeeName || ''}
                            onChange={(e) => updateConfig('payeeName', e.target.value)}
                            className="w-full bg-[#EBF2FE] border-none rounded-2xl px-6 py-5 text-sm font-bold outline-none" 
                            placeholder="Legal business name"
                        />
                    </div>
                  </>
                )}

                <div className="flex gap-4 p-4 bg-surface rounded-2xl border border-border">
                    <AlertTriangle size={20} className="text-blue-500 shrink-0" />
                    <p className="text-[10px] font-bold text-text-muted leading-relaxed italic">
                        Data is secured and injected dynamically for transactions. Don't forget to press "Save Changes" on the main page after updating.
                    </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[#111827] text-white font-black tracking-[0.2em] uppercase py-6 rounded-[24px] hover:opacity-90 transition-all flex justify-center items-center gap-4 active:scale-95 shadow-xl shadow-slate-200"
                >
                  {saving ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Save & Close'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSettings;
