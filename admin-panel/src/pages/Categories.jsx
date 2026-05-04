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
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-text-main">Category Taxonomy</h1>
          <p className="text-text-muted font-semibold mt-1">Organize products into logical classifications for better navigation.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-8 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-black tracking-widest uppercase hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Create Category
        </button>
      </div>

      <div className="glass rounded-[40px] overflow-hidden border-none shadow-2xl shadow-slate-200/50">
        <div className="p-8 border-b border-border bg-surface flex items-center justify-between">
            <div className="flex-1 max-w-md relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                    type="text" 
                    placeholder="Search categories..." 
                    className="w-full bg-background border border-border rounded-2xl pl-12 pr-6 py-3 text-sm font-bold outline-none focus:border-primary transition-all placeholder:text-text-muted text-text-main"
                />
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs font-black text-text-muted tracking-widest uppercase">Total: {categories.length} Categories</span>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Visual</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Category Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Slug</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Description</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-primary/5 transition-all group">
                  <td className="px-8 py-6">
                    <div className="w-12 h-12 rounded-xl bg-background border border-border overflow-hidden p-1">
                      <img src={category.image || 'https://via.placeholder.com/100'} alt={category.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <span className="text-base font-black text-text-main uppercase tracking-tight">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-text-muted font-mono">{category.slug}</span>
                  </td>
                  <td className="px-8 py-6 max-w-xs">
                    <p className="text-sm font-medium text-text-muted truncate">{category.description || 'No description provided'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleOpenModal(category)}
                        className="p-3 bg-background border border-border rounded-xl text-text-muted hover:text-primary hover:border-primary transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category._id)}
                        className="p-3 bg-red-50 border border-red-100 rounded-xl text-primary hover:bg-primary hover:text-white hover:border-primary transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-text-main/20 backdrop-blur-xl" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-surface w-full max-w-lg rounded-[40px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300 border-none">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
                    <p className="text-text-muted font-bold mt-1">Define classification parameters.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-background rounded-2xl transition-colors">
                    <X size={24} className="text-text-muted" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-text-muted tracking-widest uppercase block mb-3 ml-1">Category Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary outline-none transition-all" 
                    placeholder="e.g. Footwear"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-text-muted tracking-widest uppercase block mb-3 ml-1">Visual Identity</label>
                  <div className="flex items-center gap-6">
                    {previewImage && (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-border p-1 bg-background">
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-border border-dashed rounded-2xl hover:border-primary/20 transition-all bg-background/50 group">
                        <div className="space-y-2 text-center">
                          <Upload className="h-6 w-6 text-primary mx-auto" />
                          <div className="flex flex-col text-xs text-text-muted items-center">
                            <label className="relative cursor-pointer rounded-md font-black text-primary hover:text-primary/80 focus-within:outline-none tracking-widest uppercase">
                              <span>Upload Image</span>
                              <input type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-text-muted tracking-widest uppercase block mb-3 ml-1">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary outline-none min-h-[120px] transition-all" 
                    placeholder="Describe this category..."
                  />
                </div>
              </div>
              
              <div className="pt-4 flex gap-5">
                <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-background border border-border text-text-muted font-black tracking-widest uppercase py-4 rounded-2xl hover:bg-red-50 hover:text-primary transition-all"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary text-white font-black tracking-widest uppercase py-4 rounded-2xl shadow-xl shadow-primary/20 flex justify-center items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    {loading ? (
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Layers size={20} />
                        {editingCategory ? 'Update' : 'Create'}
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
