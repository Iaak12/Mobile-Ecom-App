import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search,
  Tag,
  X,
  Layers,
  Upload
} from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get('/categories');
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
        try {
            const { data } = await axiosInstance.delete(`/categories/${id}`);
            if (data.success) {
                fetchCategories();
            }
        } catch (err) {
            alert('Error deleting category');
        }
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || ''
      });
      setPreviewImage(category.image || null);
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: ''
      });
      setPreviewImage(null);
    }
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        if (selectedFile) {
            data.append('image', selectedFile);
        }

        if (editingCategory) {
            const res = await axiosInstance.put(`/categories/${editingCategory._id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setShowModal(false);
                fetchCategories();
            }
        } else {
            const res = await axiosInstance.post('/categories', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setShowModal(false);
                fetchCategories();
            }
        }
    } catch (err) {
        alert(err.response?.data?.message || 'Error saving category');
    } finally {
        setLoading(false);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-main uppercase">Taxonomy Core</h1>
          <p className="text-text-muted font-bold mt-2 text-lg">Organize products into logical classifications.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary px-10 py-5 rounded-[24px] flex items-center gap-4 text-xs font-black tracking-[0.2em] uppercase active:scale-95 shadow-2xl shadow-primary/30"
        >
          <Plus size={22} />
          Create Category
        </button>
      </div>

      <div className="bg-white rounded-[48px] overflow-hidden border border-border shadow-2xl shadow-slate-200/20">
        <div className="p-10 border-b border-border bg-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 w-full max-w-xl relative group">
                <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search classifications..." 
                    className="w-full bg-surface border border-border rounded-[24px] pl-16 pr-8 py-5 text-sm font-bold outline-none input-focus transition-all placeholder:text-text-muted text-text-main"
                />
            </div>
            <div className="flex items-center gap-6">
                <div className="px-6 py-3 bg-surface border border-border rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-text-main tracking-[0.2em] uppercase">{categories.length} Nodes Active</span>
                </div>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-border bg-surface/30">
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Visual Identity</th>
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Designation</th>
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">System Slug</th>
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Narrative</th>
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-primary/5 transition-all group cursor-pointer">
                  <td className="px-10 py-8">
                    <div className="w-20 h-20 rounded-[28px] bg-surface border border-border overflow-hidden p-1.5 shadow-sm group-hover:scale-105 transition-all duration-500">
                      <img src={category.image || 'https://via.placeholder.com/100'} alt={category.name} className="w-full h-full object-cover rounded-[22px]" />
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-lg font-black text-text-main group-hover:text-primary transition-colors tracking-tighter uppercase">{category.name}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[10px] font-black text-text-muted font-mono tracking-widest bg-surface px-4 py-2 rounded-xl border border-border">
                        {category.slug}
                    </span>
                  </td>
                  <td className="px-10 py-8 max-w-xs">
                    <p className="text-sm font-bold text-text-muted line-clamp-2">{category.description || 'No descriptive narrative provided.'}</p>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(category); }}
                        className="w-12 h-12 flex items-center justify-center bg-white border border-border rounded-2xl text-text-muted hover:text-primary hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(category._id); }}
                        className="w-12 h-12 flex items-center justify-center bg-accent-error/5 border border-accent-error/10 rounded-2xl text-accent-error hover:bg-accent-error hover:text-white hover:border-accent-error transition-all duration-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-10 border-t border-border bg-surface/30 flex justify-center">
            <button className="text-[10px] font-black tracking-[0.3em] uppercase text-text-muted hover:text-primary transition-colors py-2">
                Expand Taxonomy Hierarchy
            </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-text-main/10 backdrop-blur-3xl" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[56px] p-16 shadow-[0_64px_96px_-32px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-500 border border-white/20">
            <div className="flex items-center justify-between mb-16">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter">{editingCategory ? 'Edit Node' : 'New Node'}</h2>
                    <p className="text-text-muted font-bold mt-2 text-lg">Define classification parameters.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-16 h-16 flex items-center justify-center bg-surface hover:bg-red-50 hover:text-primary rounded-[24px] border border-border hover:border-primary/20 transition-all duration-300">
                    <X size={32} className="text-text-muted hover:text-primary transition-colors" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase ml-2">Category Designation</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-surface border border-border rounded-[24px] px-8 py-5 text-sm font-bold input-focus outline-none transition-all placeholder:text-text-muted" 
                    placeholder="e.g. Footwear"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase ml-2">Visual Representation</label>
                  <div className="flex items-center gap-8">
                    {previewImage && (
                      <div className="w-32 h-32 rounded-[32px] overflow-hidden border-4 border-surface shadow-xl p-1 bg-white shrink-0">
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-[24px]" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-center px-8 py-10 border-4 border-surface border-dashed rounded-[32px] hover:border-primary/20 transition-all bg-surface/50 group cursor-pointer relative overflow-hidden">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} accept="image/*" />
                        <div className="space-y-3 text-center">
                          <Upload className="h-8 w-8 text-primary mx-auto group-hover:scale-110 transition-transform" />
                          <div className="flex flex-col text-[10px] text-text-muted items-center font-black uppercase tracking-widest">
                            <span>Upload Hero Asset</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase ml-2">Narrative Context</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-surface border border-border rounded-[32px] px-8 py-6 text-sm font-bold input-focus outline-none min-h-[160px] transition-all placeholder:text-text-muted" 
                    placeholder="Describe this category classification..."
                  />
                </div>
              </div>
              
              <div className="pt-6 flex gap-8">
                <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-surface border border-border text-text-muted font-black tracking-[0.2em] uppercase py-6 rounded-[24px] hover:bg-red-50 hover:text-primary transition-all duration-500"
                >
                    Dismiss
                </button>
                <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary text-white font-black tracking-[0.2em] uppercase py-6 rounded-[24px] shadow-2xl shadow-primary/30 flex justify-center items-center gap-4 active:scale-95 transition-all duration-500"
                >
                    {loading ? (
                      <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Layers size={24} />
                        {editingCategory ? 'Finalize Changes' : 'Initialize Node'}
                      </>
                    )}
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
