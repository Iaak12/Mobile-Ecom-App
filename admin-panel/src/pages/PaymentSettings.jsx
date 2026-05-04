import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  CreditCard, Plus, Trash2, Edit, X, Check, AlertTriangle,
  Settings, ShieldCheck, Zap, Globe, QrCode, ToggleLeft, ToggleRight, Smartphone, Wallet
} from 'lucide-react';

const PAYMENT_TEMPLATES = [
  { name: 'Razorpay', type: 'gateway', logo: '🔷', description: 'India\'s leading payment gateway', fields: ['apiKey', 'apiSecret'], mode: true },
  { name: 'PayPal', type: 'gateway', logo: '🅿️', description: 'Global online payment system', fields: ['apiKey', 'apiSecret'], mode: true },
  { name: 'Stripe', type: 'gateway', logo: '💳', description: 'Global card payment platform', fields: ['apiKey', 'apiSecret'], mode: true },
  { name: 'UPI', type: 'direct', logo: '📱', description: 'Unified Payments Interface (India)', fields: ['vpa', 'payeeName'], mode: false },
  { name: 'Cash on Delivery', type: 'direct', logo: '💵', description: 'Pay when you receive the order', fields: [], mode: false },
  { name: 'Net Banking', type: 'gateway', logo: '🏦', description: 'Direct bank transfer payment', fields: ['apiKey', 'apiSecret'], mode: true },
];

const FIELD_LABELS = {
  apiKey: 'API Key / Client ID',
  apiSecret: 'Secret Key',
  merchantId: 'Merchant ID',
  vpa: 'UPI ID (VPA)',
  payeeName: 'Payee Name',
};

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
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Add form state
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [addForm, setAddForm] = useState({ name: '', type: 'gateway', isEnabled: false, config: {}, mode: 'sandbox' });

  useEffect(() => { fetchMethods(); }, []);

  const fetchMethods = async () => {
    try {
      const { data } = await axiosInstance.get('/payments/methods');
      if (data.success) setMethods(data.methods);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleToggle = async (method) => {
    setTogglingId(method._id);
    try {
      const { data } = await axiosInstance.put(`/payments/methods/${method._id}/toggle`);
      if (data.success) setMethods(prev => prev.map(m => m._id === method._id ? data.method : m));
    } catch { alert('Error toggling method'); }
    finally { setTogglingId(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this payment method?')) return;
    try {
      const { data } = await axiosInstance.delete(`/payments/methods/${id}`);
      if (data.success) setMethods(prev => prev.filter(m => m._id !== id));
    } catch { alert('Error deleting method'); }
  };

  const handleOpenEdit = (method) => {
    setSelectedMethod({ ...method, config: { ...method.config } });
    setShowModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axiosInstance.post('/payments/methods', selectedMethod);
      if (data.success) {
        setMethods(prev => prev.map(m => m.name === selectedMethod.name ? data.method : m));
        setShowModal(false);
      }
    } catch { alert('Error updating'); }
    finally { setSaving(false); }
  };

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);
    setAddForm({
      name: tpl.name,
      type: tpl.type,
      isEnabled: false,
      config: {},
      mode: 'sandbox',
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...addForm };
      if (selectedTemplate?.mode) payload.config = { ...addForm.config, mode: addForm.mode };
      const { data } = await axiosInstance.post('/payments/methods', payload);
      if (data.success) {
        setMethods(prev => {
          const exists = prev.find(m => m.name === data.method.name);
          return exists ? prev.map(m => m.name === data.method.name ? data.method : m) : [...prev, data.method];
        });
        setShowAddModal(false);
        setSelectedTemplate(null);
        setAddForm({ name: '', type: 'gateway', isEnabled: false, config: {}, mode: 'sandbox' });
      }
    } catch { alert('Error adding method'); }
    finally { setSaving(false); }
  };

  const availableTemplates = PAYMENT_TEMPLATES.filter(t => !methods.find(m => m.name === t.name));

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure your store settings and integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Nav */}
        <div className="bg-white rounded-2xl border border-gray-100 p-3 h-fit shadow-sm">
          {SECTIONS.map(({ name, icon: Icon, active }) => (
            <button key={name} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-primary/10 text-primary font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Icon size={18} className={active ? 'text-primary' : 'text-gray-400'} />
              {name}
            </button>
          ))}
        </div>

        {/* Payment Methods Panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-gray-900">Payment Methods</h2>
              <p className="text-xs text-gray-400 mt-0.5">{methods.length} method{methods.length !== 1 ? 's' : ''} configured</p>
            </div>
            <button
              onClick={() => { setSelectedTemplate(null); setShowAddModal(true); }}
              disabled={availableTemplates.length === 0}
              className="btn-primary px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} /> Add Method
            </button>
          </div>

          {/* Methods List */}
          {methods.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard size={28} className="text-gray-300" />
              </div>
              <h3 className="text-base font-bold text-gray-400 mb-1">No payment methods yet</h3>
              <p className="text-xs text-gray-300 mb-5">Add a payment method to let customers check out</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2"
              >
                <Plus size={16} /> Add First Method
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {methods.map((method) => {
                const tpl = PAYMENT_TEMPLATES.find(t => t.name === method.name);
                const isToggling = togglingId === method._id;
                return (
                  <div key={method._id} className={`bg-white rounded-2xl border-2 transition-all shadow-sm ${method.isEnabled ? 'border-emerald-200' : 'border-gray-100'}`}>
                    <div className="p-5 flex items-center gap-4">
                      {/* Logo / Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${method.isEnabled ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                        {tpl?.logo || '💳'}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-gray-900">{method.name}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method.type === 'gateway' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                            {method.type}
                          </span>
                          {method.config?.mode && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method.config.mode === 'live' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-500'}`}>
                              {method.config.mode}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{tpl?.description || 'Payment method'}</p>
                        {method.isEnabled && (
                          <div className="flex items-center gap-1 mt-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Toggle */}
                        <button
                          onClick={() => handleToggle(method)}
                          disabled={isToggling}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${method.isEnabled ? 'bg-emerald-400' : 'bg-gray-200'} disabled:opacity-60`}
                          title={method.isEnabled ? 'Disable' : 'Enable'}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${method.isEnabled ? 'left-6' : 'left-1'}`} />
                        </button>

                        {/* Configure */}
                        {tpl?.fields?.length > 0 && (
                          <button
                            onClick={() => handleOpenEdit(method)}
                            className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/10 transition-all"
                            title="Configure"
                          >
                            <Settings size={16} />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(method._id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── ADD METHOD MODAL ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowAddModal(false); setSelectedTemplate(null); }} />
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-lg font-black text-gray-900">Add Payment Method</h2>
                <p className="text-gray-400 text-sm mt-0.5">{selectedTemplate ? `Configuring ${selectedTemplate.name}` : 'Choose a payment method'}</p>
              </div>
              <button onClick={() => { setShowAddModal(false); setSelectedTemplate(null); }} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {!selectedTemplate ? (
                /* Step 1: Choose template */
                <div className="p-6 space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Available Methods</p>
                  {availableTemplates.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">All payment methods have been added.</p>
                  ) : (
                    availableTemplates.map((tpl) => (
                      <button
                        key={tpl.name}
                        onClick={() => handleSelectTemplate(tpl)}
                        className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all group text-left"
                      >
                        <span className="text-3xl shrink-0">{tpl.logo}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-gray-900">{tpl.name}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tpl.type === 'gateway' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                              {tpl.type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{tpl.description}</p>
                        </div>
                        <span className="text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0">Select →</span>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                /* Step 2: Configure */
                <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
                  {/* Selected template info */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <span className="text-3xl">{selectedTemplate.logo}</span>
                    <div>
                      <p className="text-sm font-black text-gray-900">{selectedTemplate.name}</p>
                      <p className="text-xs text-gray-400">{selectedTemplate.description}</p>
                    </div>
                    <button type="button" onClick={() => setSelectedTemplate(null)} className="ml-auto text-xs text-primary font-bold hover:underline">
                      Change
                    </button>
                  </div>

                  {/* Mode (for gateways) */}
                  {selectedTemplate.mode && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Environment</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['sandbox', 'live'].map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setAddForm(f => ({ ...f, mode: m }))}
                            className={`py-3 rounded-xl border-2 text-sm font-bold transition-all capitalize ${addForm.mode === m ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                          >
                            {m === 'sandbox' ? '🧪 Sandbox' : '🚀 Live'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dynamic config fields */}
                  {selectedTemplate.fields.map(field => (
                    <div key={field} className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{FIELD_LABELS[field] || field}</label>
                      <input
                        type={field.toLowerCase().includes('secret') ? 'password' : 'text'}
                        value={addForm.config[field] || ''}
                        onChange={e => setAddForm(f => ({ ...f, config: { ...f.config, [field]: e.target.value } }))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 input-focus placeholder:text-gray-300"
                        placeholder={field.toLowerCase().includes('secret') ? '••••••••' : `Enter ${FIELD_LABELS[field] || field}`}
                      />
                    </div>
                  ))}

                  {selectedTemplate.fields.length === 0 && (
                    <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                      <AlertTriangle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-600 font-medium">This method requires no configuration. It will be available at checkout when enabled.</p>
                    </div>
                  )}

                  {/* Enable toggle */}
                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer"
                    onClick={() => setAddForm(f => ({ ...f, isEnabled: !f.isEnabled }))}
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">Enable immediately</p>
                      <p className="text-xs text-gray-400 mt-0.5">Make available to customers right away</p>
                    </div>
                    <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${addForm.isEnabled ? 'bg-primary' : 'bg-gray-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${addForm.isEnabled ? 'left-6' : 'left-1'}`} />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setSelectedTemplate(null)}
                      className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                      Back
                    </button>
                    <button type="submit" disabled={saving}
                      className="flex-1 btn-primary py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                      {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
                      Add Method
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT/CONFIGURE MODAL ─── */}
      {showModal && selectedMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{PAYMENT_TEMPLATES.find(t => t.name === selectedMethod.name)?.logo || '💳'}</span>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Configure {selectedMethod.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Update credentials and settings</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-5">
              {/* Mode */}
              {selectedMethod.config?.mode !== undefined && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Environment</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['sandbox', 'live'].map(m => (
                      <button
                        key={m} type="button"
                        onClick={() => setSelectedMethod(prev => ({ ...prev, config: { ...prev.config, mode: m } }))}
                        className={`py-2.5 rounded-xl border-2 text-sm font-bold transition-all capitalize ${selectedMethod.config?.mode === m ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                      >
                        {m === 'sandbox' ? '🧪 Sandbox' : '🚀 Live'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Config fields */}
              {(PAYMENT_TEMPLATES.find(t => t.name === selectedMethod.name)?.fields || []).map(field => (
                <div key={field} className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{FIELD_LABELS[field] || field}</label>
                  <input
                    type={field.toLowerCase().includes('secret') ? 'password' : 'text'}
                    value={selectedMethod.config?.[field] || ''}
                    onChange={e => setSelectedMethod(prev => ({ ...prev, config: { ...prev.config, [field]: e.target.value } }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium input-focus"
                    placeholder={field.toLowerCase().includes('secret') ? '••••••••' : `Enter ${FIELD_LABELS[field]}`}
                  />
                </div>
              ))}

              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
                <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 font-medium">Credentials are encrypted and used only during checkout processing.</p>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 btn-primary py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSettings;
