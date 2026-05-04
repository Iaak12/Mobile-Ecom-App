import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search,
  AlertCircle,
  Image as ImageIcon,
  Tag,
  Box,
  IndianRupee,
  Upload,
  X
} from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    brand: '',
    isFeatured: false
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axiosInstance.get('/products');
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get('/categories');
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category?._id || '',
        description: product.description,
        stock: product.stock,
        brand: product.brand || '',
        isFeatured: product.isFeatured || false
      });
      setPreviewImages(product.images?.map(img => img.url) || []);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category: '',
        description: '',
        stock: '',
        brand: '',
        isFeatured: false
      });
      setPreviewImages([]);
    }
    setSelectedFiles([]);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    // If it's a new file (selectedFiles matches the index in previewImages AFTER existing images)
    // This logic is a bit complex if we mix existing and new.
    // For now, let's just clear all if they want to reset, or just append.
    // Simpler: Just allow clearing the whole selection.
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        try {
            const { data } = await axiosInstance.delete(`/products/${id}`);
            if (data.success) {
                fetchProducts();
            }
        } catch (err) {
            alert('Error deleting product');
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        selectedFiles.forEach(file => {
            data.append('images', file);
        });

        let res;
        if (editingProduct) {
            res = await axiosInstance.put(`/products/${editingProduct._id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } else {
            res = await axiosInstance.post('/products', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }

        if (res.data.success) {
            setShowModal(false);
            fetchProducts();
        }
    } catch (err) {
        alert(err.response?.data?.message || 'Error saving product');
    } finally {
        setLoading(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-text-main">Global Inventory</h1>
          <p className="text-text-muted font-bold mt-2 text-lg">Manage and monitor the core catalog of official merchandise.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary px-10 py-5 rounded-[24px] flex items-center gap-4 text-xs font-black tracking-[0.2em] uppercase active:scale-95 shadow-2xl shadow-primary/30"
        >
          <Plus size={22} />
          Register Product
        </button>
      </div>

      <div className="bg-white rounded-[48px] overflow-hidden border border-border shadow-2xl shadow-slate-200/20">
        <div className="p-10 border-b border-border bg-white flex items-center justify-between gap-10">
            <div className="flex-1 max-w-xl relative group">
                <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search by name, category or ID..." 
                    className="w-full bg-surface border border-border rounded-[24px] pl-16 pr-8 py-5 text-sm font-bold outline-none input-focus transition-all placeholder:text-text-muted text-text-main"
                />
            </div>
            <div className="flex items-center gap-6">
                <div className="px-6 py-3 bg-surface border border-border rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-text-main tracking-[0.2em] uppercase">{products.length} Items Live</span>
                </div>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface/30">
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Authentic Product</th>
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Classification</th>
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Valuation</th>
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Inventory</th>
                <th className="px-10 py-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-primary/5 transition-all group cursor-pointer">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[28px] bg-surface border border-border overflow-hidden p-1.5 shadow-sm group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/10 transition-all duration-500">
                        <img src={product.images?.[0]?.url || 'https://via.placeholder.com/100'} alt={product.name} className="w-full h-full object-cover rounded-[22px]" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-text-main group-hover:text-primary transition-colors tracking-tighter">{product.name}</p>
                        <p className="text-[10px] text-text-muted font-black mt-1.5 tracking-[0.2em] uppercase">UID-{product._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[10px] font-black text-primary flex items-center gap-2.5 bg-primary/5 border border-primary/10 px-5 py-2 rounded-xl w-fit tracking-widest uppercase">
                        <Tag size={14} strokeWidth={2.5} />
                        {product.category?.name || 'GENERIC'}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center text-lg font-black text-text-main tracking-tighter">
                        <IndianRupee size={18} strokeWidth={2.5} className="text-primary mr-1" />
                        <span>{product.price.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-accent-success shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-accent-warning shadow-[0_0_15px_rgba(245,158,11,0.5)]'}`}></div>
                        <span className="text-sm font-black text-text-main uppercase tracking-widest">{product.stock} Units</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(product); }}
                        className="w-12 h-12 flex items-center justify-center bg-white border border-border rounded-2xl text-text-muted hover:text-primary hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }}
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
                Load More Inventory Assets
            </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-text-main/10 backdrop-blur-3xl" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-[56px] p-16 shadow-[0_64px_96px_-32px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex items-center justify-between mb-16">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter">{editingProduct ? 'Edit Product' : 'New Registration'}</h2>
                    <p className="text-text-muted font-bold mt-2 text-lg">{editingProduct ? 'Modify the details of this catalog item.' : 'Populate the fields to add merchandise to the inventory.'}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-16 h-16 flex items-center justify-center bg-surface hover:bg-red-50 hover:text-primary rounded-[24px] border border-border hover:border-primary/20 transition-all duration-300">
                    <X size={32} className="text-text-muted hover:text-primary transition-colors" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase ml-2">Official Product Designation</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-surface border border-border rounded-[24px] px-8 py-5 text-sm font-bold input-focus outline-none transition-all placeholder:text-text-muted" 
                    placeholder="Enter identifying name"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase ml-2">Valuation (INR)</label>
                  <div className="relative">
                    <IndianRupee size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                        required
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-surface border border-border rounded-[24px] pl-14 pr-8 py-5 text-sm font-bold input-focus outline-none transition-all" 
                        placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase ml-2">Classification Department</label>
                  <select 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-surface border border-border rounded-[24px] px-8 py-5 text-sm font-bold input-focus outline-none transition-all cursor-pointer appearance-none uppercase tracking-widest text-[10px]"
                  >
                    <option value="">SELECT DEPARTMENT</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase ml-2">Brand Identity / Label</label>
                  <input 
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full bg-surface border border-border rounded-[24px] px-8 py-5 text-sm font-bold input-focus outline-none transition-all" 
                    placeholder="e.g. Authentic"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase ml-2">Available Inventory Units</label>
                  <input 
                    required
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-surface border border-border rounded-[24px] px-8 py-5 text-sm font-bold input-focus outline-none transition-all" 
                    placeholder="0"
                  />
                </div>

                <div className="col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase ml-2">Catalog Narrative / Details</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-surface border border-border rounded-[32px] px-8 py-6 text-sm font-bold input-focus outline-none min-h-[160px] transition-all" 
                    placeholder="Provide professional product details"
                  />
                </div>

                <div className="col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase ml-2">Visual Asset Acquisition</label>
                  <div className="mt-1 flex justify-center px-10 py-16 border-4 border-surface border-dashed rounded-[48px] hover:border-primary/20 transition-all bg-surface/50 group cursor-pointer relative overflow-hidden">
                    <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} accept="image/*" />
                    <div className="space-y-6 text-center">
                      <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center mx-auto shadow-2xl shadow-primary/10 group-hover:scale-110 transition-transform duration-500">
                          <Upload className="h-10 w-10 text-primary" />
                      </div>
                      <div className="flex flex-col text-sm text-text-muted items-center">
                        <span className="font-black text-primary hover:text-primary/80 tracking-[0.2em] uppercase text-xs">
                          Initialize Multi-Asset Upload
                        </span>
                        <p className="mt-3 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Lossless PNG, JPG, WEBP • Max 5.0MB Per Node</p>
                      </div>
                    </div>
                  </div>
                </div>

                {previewImages.length > 0 && (
                  <div className="col-span-2 grid grid-cols-4 gap-6 mt-4">
                    {previewImages.map((url, i) => (
                      <div key={i} className="relative group aspect-square rounded-[24px] overflow-hidden border-4 border-surface shadow-xl shadow-slate-200/50">
                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                type="button" 
                                onClick={() => removeFile(i)}
                                className="bg-white text-primary w-12 h-12 rounded-2xl shadow-2xl hover:scale-110 transition-all flex items-center justify-center border border-primary/10"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="col-span-2 flex items-center gap-4 px-2 py-4 bg-surface rounded-[24px] border border-border cursor-pointer group hover:border-primary/20 transition-all">
                  <div className="relative flex items-center">
                    <input 
                        type="checkbox" 
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                        className="w-7 h-7 rounded-xl border-border bg-white text-primary focus:ring-primary accent-primary cursor-pointer transition-all"
                    />
                  </div>
                  <label htmlFor="isFeatured" className="text-xs font-black text-text-main tracking-[0.2em] uppercase cursor-pointer group-hover:text-primary transition-colors">Promote as Global Feature Asset</label>
                </div>
              </div>
              
              <div className="pt-10 flex gap-8">
                <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-surface border border-border text-text-muted font-black tracking-[0.2em] uppercase py-6 rounded-[24px] hover:bg-red-50 hover:text-primary hover:border-primary/20 transition-all duration-500"
                >
                    Dismiss Registry
                </button>
                <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary text-white font-black tracking-[0.2em] uppercase py-6 rounded-[24px] shadow-2xl shadow-primary/30 flex justify-center items-center gap-4 hover:scale-[1.02] active:scale-95 transition-all duration-500"
                >
                    {loading ? (
                      <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Box size={24} />
                        {editingProduct ? 'Finalize Changes' : 'Confirm Registry'}
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

export default Products;
