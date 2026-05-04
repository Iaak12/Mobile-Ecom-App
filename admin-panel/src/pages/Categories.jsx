import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Plus, Trash2, Edit, Search, Tag, X, Layers, Upload } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get('/categories');
      if (data.success) setCategories(data.categories);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({ name: cat.name, description: cat.description || '' });
      setPreviewImage(cat.image || null);
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
      setPreviewImage(null);
    }
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedFile(file); setPreviewImage(URL.createObjectURL(file)); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const { data } = await axiosInstance.delete(`/categories/${id}`);
      if (data.success) fetchCategories();
    } catch { alert('Error deleting'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('description', formData.description);
      if (selectedFile) fd.append('image', selectedFile);
      const opts = { headers: { 'Content-Type': 'multipart/form-data' } };
      const res = editingCategory
        ? await axiosInstance.put(`/categories/${editingCategory._id}`, fd, opts)
        : await axiosInstance.post('/categories', fd, opts);
      if (res.data.success) { setShowModal(false); fetchCategories(); }
    } catch (err) { alert(err.response?.data?.message || 'Error saving'); }
    finally { setSaving(false); }
  };

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
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Categories</h1>
          <p className="text-gray-400 text-sm mt-1">Organize products into logical groups</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 group">
            {/* Image */}
            <div className="h-36 bg-gray-100 overflow-hidden">
              <img
                src={cat.image || 'https://via.placeholder.com/300x150'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={14} className="text-primary shrink-0" />
                <h3 className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{cat.name}</h3>
              </div>
              {cat.slug && (
                <span className="text-[10px] font-mono font-bold text-gray-300 bg-gray-50 px-2 py-1 rounded-lg">{cat.slug}</span>
              )}
              {cat.description && (
                <p className="text-xs text-gray-400 font-medium mt-2 line-clamp-2">{cat.description}</p>
              )}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleOpenModal(cat)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-gray-500 hover:text-primary hover:bg-primary/10 transition-all"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="flex flex-col items-center gap-3 opacity-30">
              <Layers size={48} />
              <p className="text-sm font-bold uppercase tracking-widest">No Categories Found</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-gray-900">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
                <p className="text-gray-400 text-sm mt-0.5">Fill in the details below</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category Name *</label>
                <input
                  required value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 input-focus placeholder:text-gray-300"
                  placeholder="e.g. Electronics"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Image</label>
                {previewImage && (
                  <div className="h-32 rounded-xl overflow-hidden mb-3">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-primary/40 transition-colors relative group">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} accept="image/*" />
                  <Upload size={20} className="text-gray-400 mx-auto mb-2 group-hover:text-primary transition-colors" />
                  <p className="text-xs font-semibold text-gray-400 group-hover:text-primary transition-colors">Upload Image</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 input-focus min-h-[80px] resize-none placeholder:text-gray-300"
                  placeholder="Category description..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 btn-primary py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {editingCategory ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
