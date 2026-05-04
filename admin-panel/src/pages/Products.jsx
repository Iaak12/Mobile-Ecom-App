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
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-text-main">Global Inventory</h1>
          <p className="text-text-muted font-semibold mt-1">Manage and monitor the core catalog of official merchandise.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-8 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-black tracking-widest uppercase hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Register Product
        </button>
      </div>

      <div className="glass rounded-[40px] overflow-hidden border-none shadow-2xl shadow-slate-200/50">
        <div className="p-8 border-b border-border bg-surface flex items-center justify-between">
            <div className="flex-1 max-w-md relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                    type="text" 
                    placeholder="Search by name, category or ID..." 
                    className="w-full bg-background border border-border rounded-2xl pl-12 pr-6 py-3 text-sm font-bold outline-none focus:border-primary transition-all placeholder:text-text-muted text-text-main"
                />
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs font-black text-text-muted tracking-widest uppercase">Total: {products.length} Products</span>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Authentic Product</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Department</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Price (INR)</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Inventory</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-primary/5 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-background border border-border overflow-hidden p-1 shadow-sm group-hover:scale-105 transition-transform">
                        <img src={product.images?.[0]?.url || 'https://via.placeholder.com/100'} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div>
                        <p className="text-base font-black text-text-main group-hover:text-primary transition-colors">{product.name}</p>
                        <p className="text-[10px] text-text-muted font-bold mt-1 tracking-widest uppercase">{product._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-primary flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full w-fit tracking-wide uppercase">
                        <Tag size={12} strokeWidth={2.5} />
                        {product.category?.name || 'GENERIC'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center text-base font-black text-text-main">
                        <IndianRupee size={16} strokeWidth={2.5} />
                        <span>{product.price.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-accent-success shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-accent-warning shadow-[0_0_10px_rgba(245,158,11,0.3)]'}`}></div>
                        <span className="text-sm font-black text-text-main">{product.stock} Units</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-3 bg-background border border-border rounded-xl text-text-muted hover:text-primary hover:border-primary transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
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
          <div className="relative bg-surface w-full max-w-2xl rounded-[40px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto border-none">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter">{editingProduct ? 'Edit Product' : 'New Registration'}</h2>
                    <p className="text-text-muted font-bold mt-1">{editingProduct ? 'Modify the details of this catalog item.' : 'Populate the fields to add merchandise to the inventory.'}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-background rounded-2xl transition-colors">
                    <X size={24} className="text-text-muted" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-xs font-black text-text-muted tracking-widest uppercase block mb-3 ml-1">Official Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary outline-none transition-all" 
                    placeholder="Enter identifying name"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-text-muted tracking-widest uppercase block mb-3 ml-1">Valuation (INR)</label>
                  <input 
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary outline-none transition-all" 
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-text-muted tracking-widest uppercase block mb-3 ml-1">Classification</label>
                  <select 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary outline-none transition-all cursor-pointer"
                  >
                    <option value="">SELECT DEPARTMENT</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-text-muted tracking-widest uppercase block mb-3 ml-1">Brand Identity</label>
                  <input 
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary outline-none transition-all" 
                    placeholder="e.g. Authentic"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-text-muted tracking-widest uppercase block mb-3 ml-1">Available Units</label>
                  <input 
                    required
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary outline-none transition-all" 
                    placeholder="0"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-black text-text-muted tracking-widest uppercase block mb-3 ml-1">Catalog Description</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary outline-none min-h-[120px] transition-all" 
                    placeholder="Provide professional product details"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-black text-text-muted tracking-widest uppercase block mb-3 ml-1">High-Res Imagery</label>
                  <div className="mt-1 flex justify-center px-8 pt-10 pb-10 border-4 border-background border-dashed rounded-[32px] hover:border-primary/20 transition-all bg-background/50 group">
                    <div className="space-y-4 text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                          <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex flex-col text-sm text-text-muted items-center">
                        <label className="relative cursor-pointer rounded-md font-black text-primary hover:text-primary/80 focus-within:outline-none tracking-widest uppercase text-xs">
                          <span>Select Assets</span>
                          <input type="file" multiple className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </label>
                        <p className="mt-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">Supports PNG, JPG, WEBP (Max 5MB)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {previewImages.length > 0 && (
                  <div className="col-span-2 grid grid-cols-4 gap-4 mt-2">
                    {previewImages.map((url, i) => (
                      <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-background shadow-sm">
                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                type="button" 
                                onClick={() => removeFile(i)}
                                className="bg-white text-primary p-2 rounded-xl shadow-lg hover:scale-110 transition-all font-black"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="col-span-2 flex items-center gap-3 px-1">
                  <input 
                    type="checkbox" 
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    className="w-5 h-5 rounded-lg border-border bg-background text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-black text-text-muted tracking-widest uppercase cursor-pointer">Promoted Feature Asset</label>
                </div>
              </div>
              
              <div className="pt-8 flex gap-5">
                <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-background border border-border text-text-muted font-black tracking-widest uppercase py-4 rounded-2xl hover:bg-red-50 hover:text-primary transition-all"
                >
                    Dismiss
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
                        <Box size={20} />
                        {editingProduct ? 'Update Registry' : 'Confirm Registry'}
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
