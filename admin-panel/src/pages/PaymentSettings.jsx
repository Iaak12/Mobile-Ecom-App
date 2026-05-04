import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { CreditCard, Check, X, Settings, ShieldCheck, AlertTriangle, Zap, Globe, QrCode, ToggleLeft, ToggleRight } from 'lucide-react';

const SECTIONS = [
  { name: 'General', icon: Settings },
  { name: 'Notifications', icon: Globe },
  { name: 'Security', icon: ShieldCheck },
  { name: 'Payments', icon: CreditCard, active: true },
  { name: 'Shipping', icon: Zap },
  { name: 'Appearance', icon: QrCode },
];

const PaymentSettings = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => { fetchMethods(); }, []);

  const fetchMethods = async () => {
    try {
      const { data } = await axiosInstance.get('/payments/methods');
      if (data.success) setMethods(data.methods);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
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
    } catch { alert('Error updating'); }
    finally { setSaving(false); }
  };

  const updateConfig = (key, value) => setSelectedMethod({ ...selectedMethod, config: { ...selectedMethod.config, [key]: value } });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure your store settings and integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="bg-white rounded-2xl border border-gray-100 p-3 h-fit shadow-sm">
          {SECTIONS.map(({ name, icon: Icon, active }) => (
            <button key={name}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
                active ? 'bg-primary/10 text-primary font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={18} className={active ? 'text-primary' : 'text-gray-400'} />
              {name}
            </button>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 mb-6">Payment Methods</h2>

          {methods.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold">No payment methods configured</p>
            </div>
          ) : (
            <div className="space-y-4">
              {methods.map((method) => (
                <div key={method._id}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                    method.isEnabled ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-100 bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${method.isEnabled ? 'bg-emerald-100 border-emerald-200' : 'bg-white border-gray-200'}`}>
                      <CreditCard size={22} className={method.isEnabled ? 'text-emerald-600' : 'text-gray-400'} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900">{method.name}</h3>
                      <span className={`text-xs font-bold ${method.isEnabled ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {method.isEnabled ? '● Enabled' : '○ Disabled'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedMethod({ ...method }); setShowModal(true); }}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:border-primary hover:text-primary transition-all shadow-sm"
                  >
                    Configure
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-primary" />
                <h3 className="text-lg font-black text-gray-900">{selectedMethod.name}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Toggle */}
              <div
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer"
                onClick={() => setSelectedMethod({ ...selectedMethod, isEnabled: !selectedMethod.isEnabled })}
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">Enable {selectedMethod.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Allow customers to pay via this method</p>
                </div>
                <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${selectedMethod.isEnabled ? 'bg-primary' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${selectedMethod.isEnabled ? 'left-6' : 'left-1'}`} />
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                {(selectedMethod.name === 'Razorpay' || selectedMethod.name === 'PayPal') && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">API Key / Client ID</label>
                      <input
                        value={selectedMethod.config?.apiKey || ''}
                        onChange={e => updateConfig('apiKey', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium input-focus"
                        placeholder="Enter key..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Secret Key</label>
                      <input
                        type="password"
                        value={selectedMethod.config?.apiSecret || ''}
                        onChange={e => updateConfig('apiSecret', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium input-focus"
                        placeholder="••••••••"
                      />
                    </div>
                  </>
                )}
                {selectedMethod.name === 'UPI' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">UPI ID (VPA)</label>
                      <input
                        value={selectedMethod.config?.vpa || ''}
                        onChange={e => updateConfig('vpa', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium input-focus"
                        placeholder="merchant@upi"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Payee Name</label>
                      <input
                        value={selectedMethod.config?.payeeName || ''}
                        onChange={e => updateConfig('payeeName', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium input-focus"
                        placeholder="Business name"
                      />
                    </div>
                  </>
                )}

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <AlertTriangle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-600 font-medium leading-relaxed">Credentials are encrypted and only used during transaction processing.</p>
                </div>

                <button type="submit" disabled={saving}
                  className="w-full btn-primary py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
                  Save Configuration
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
