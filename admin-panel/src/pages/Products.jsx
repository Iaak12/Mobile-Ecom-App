import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  Plus, Trash2, Edit, Search, Box, IndianRupee, Upload, X, Tag, AlertCircle
} from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '', price: '', category: '', description: '', stock: '', brand: '', isFeatured: false
  });

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axiosInstance.get('/products');
      if (data.success) setProducts(data.products);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get('/categories');
      if (data.success) setCategories(data.categories);
    } catch (err) { console.error(err); }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name, price: product.price,
        category: product.category?._id || '', description: product.description,
        stock: product.stock, brand: product.brand || '', isFeatured: product.isFeatured || false
      });
      setPreviewImages(product.images?.map(img => img.url) || []);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', category: '', description: '', stock: '', brand: '', isFeatured: false });
      setPreviewImages([]);
    }
    setSelectedFiles([]);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    setPreviewImages(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (i) => {
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== i));
    setPreviewImages(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const { data } = await axiosInstance.delete(`/products/${id}`);
      if (data.success) fetchProducts();
    } catch { alert('Error deleting product'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach(k => fd.append(k, formData[k]));
      selectedFiles.forEach(f => fd.append('images', f));
      const opts = { headers: { 'Content-Type': 'multipart/form-data' } };
      const res = editingProduct
        ? await axiosInstance.put(`/products/${editingProduct._id}`, fd, opts)
        : await axiosInstance.post('/products', fd, opts);
      if (res.data.success) { setShowModal(false); fetchProducts(); }
    } catch (err) { alert(err.response?.data?.message || 'Error saving'); }
    finally { setSaving(false); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Products</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:max-w-xs group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-700 input-focus placeholder:text-gray-300"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{products.length} Items</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                        <img
                          src={product.images?.[0]?.url || 'https://via.placeholder.com/100'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">#{product._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                      <Tag size={11} /> {product.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-0.5 text-sm font-black text-gray-900">
                      <IndianRupee size={14} className="text-primary" />
                      {product.price?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                      <span className="text-sm font-semibold text-gray-700">{product.stock}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <Box size={48} />
                      <p className="text-sm font-bold uppercase tracking-widest">No Products Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-black text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <p className="text-gray-400 text-sm mt-0.5">{editingProduct ? 'Update product details' : 'Fill in the details below'}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Product Name *</label>
                  <input
                    required value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 input-focus placeholder:text-gray-300"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Price (₹) *</label>
                  <div className="relative">
                    <IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      required type="number" value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm font-medium text-gray-900 input-focus"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stock *</label>
                  <input
                    required type="number" value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 input-focus"
                    placeholder="0"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category *</label>
                  <select
                    required value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 input-focus cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Brand</label>
                  <input
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 input-focus"
                    placeholder="Brand name"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description *</label>
                  <textarea
                    required value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 input-focus min-h-[100px] resize-none"
                    placeholder="Product description..."
                  />
                </div>

                {/* Image Upload */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Images</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary/40 transition-colors relative cursor-pointer group">
                    <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} accept="image/*" />
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                      <Upload size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500">Click to upload images</p>
                    <p className="text-xs text-gray-300 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-3">
                      {previewImages.map((url, i) => (
                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Featured */}
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${formData.isFeatured ? 'bg-primary' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${formData.isFeatured ? 'left-5' : 'left-1'}`} />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Feature this product on homepage</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {editingProduct ? 'Save Changes' : 'Add Product'}
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
