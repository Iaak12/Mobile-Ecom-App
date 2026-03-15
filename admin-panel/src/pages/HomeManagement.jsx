import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon, 
  Layers, 
  ArrowUp, 
  ArrowDown,
  ChevronRight,
  ExternalLink,
  Target
} from 'lucide-react';

const HomeManagement = () => {
  const [content, setContent] = useState({ banners: [], sections: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data } = await axiosInstance.get('/cms/home');
      if (data.success) {
        setContent(data.content);
      }
    } catch (err) {
      console.error('Failed to fetch home content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axiosInstance.put('/cms/home', content);
      if (data.success) {
        alert('Home content saved successfully!');
      }
    } catch (err) {
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const addBanner = () => {
    setContent({
      ...content,
      banners: [...content.banners, { image: { url: '' }, title: '', subtitle: '', linkType: 'none', linkId: '', active: true }]
    });
  };

  const removeBanner = (index) => {
    const newBanners = [...content.banners];
    newBanners.splice(index, 1);
    setContent({ ...content, banners: newBanners });
  };

  const updateBanner = (index, field, value) => {
    const newBanners = [...content.banners];
    if (field === 'url') {
      newBanners[index].image = { ...newBanners[index].image, url: value };
    } else {
      newBanners[index][field] = value;
    }
    setContent({ ...content, banners: newBanners });
  };

  const addSection = () => {
    setContent({
      ...content,
      sections: [...content.sections, { 
        title: '', 
        type: 'product_scroll', 
        items: [], 
        active: true,
        order: content.sections.length 
      }]
    });
  };

  const updateSection = (index, field, value) => {
    const newSections = [...content.sections];
    newSections[index][field] = value;
    setContent({ ...content, sections: newSections });
  };

  const moveSection = (index, direction) => {
    const newSections = [...content.sections];
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === 'down' && index < newSections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    setContent({ ...content, sections: newSections });
  };

  const removeSection = (index) => {
    const newSections = [...content.sections];
    newSections.splice(index, 1);
    setContent({ ...content, sections: newSections });
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]">Loading CMS...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Home Page Management</h1>
          <p className="text-text-muted">Control your app's main screen sections and banners.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="gradient-bg px-6 py-2.5 rounded-xl text-white font-bold shadow-lg shadow-primary-glow flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      {/* Hero Banners */}
      <section className="glass rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <ImageIcon size={20} />
            </div>
            <h2 className="text-xl font-bold">Hero Banners</h2>
          </div>
          <button 
            onClick={addBanner}
            className="text-xs font-bold text-primary hover:text-white transition-colors flex items-center gap-1"
          >
            <Plus size={14} /> Add Banner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.banners.map((banner, idx) => (
            <div key={idx} className="bg-surface/50 border border-border rounded-2xl p-4 relative group">
              <button 
                onClick={() => removeBanner(idx)}
                className="absolute top-2 right-2 p-1.5 text-text-muted hover:text-accent-error opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 bg-surface rounded-lg overflow-hidden border border-border">
                    {banner.image.url ? (
                      <img src={banner.image.url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                  <input 
                    type="text" 
                    placeholder="Image URL" 
                    value={banner.image.url}
                    onChange={(e) => updateBanner(idx, 'url', e.target.value)}
                    className="flex-1 bg-surface border border-border rounded-lg px-3 py-1.5 text-sm focus:border-primary outline-none"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Banner Title" 
                  value={banner.title}
                  onChange={(e) => updateBanner(idx, 'title', e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-1.5 text-sm focus:border-primary outline-none"
                />
                <div className="flex gap-2">
                  <select 
                    value={banner.linkType}
                    onChange={(e) => updateBanner(idx, 'linkType', e.target.value)}
                    className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm focus:border-primary outline-none"
                  >
                    <option value="none">No Link</option>
                    <option value="category">Category</option>
                    <option value="product">Product</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Link ID (ID/Slug)" 
                    value={banner.linkId}
                    onChange={(e) => updateBanner(idx, 'linkId', e.target.value)}
                    className="flex-1 bg-surface border border-border rounded-lg px-3 py-1.5 text-sm focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Sections */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
              <Layers size={20} />
            </div>
            <h2 className="text-xl font-bold">Home Sections</h2>
          </div>
          <button 
            onClick={addSection}
            className="bg-surface border border-border px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-surface/70 transition-colors"
          >
            <Plus size={16} /> Add New Section
          </button>
        </div>

        <div className="space-y-4">
          {content.sections.map((section, idx) => (
            <div key={idx} className="glass rounded-2xl p-6 border-l-4 border-l-primary/50 relative">
              <div className="absolute right-4 top-6 flex items-center gap-1">
                <button onClick={() => moveSection(idx, 'up')} className="p-1 hover:text-primary"><ArrowUp size={16} /></button>
                <button onClick={() => moveSection(idx, 'down')} className="p-1 hover:text-primary"><ArrowDown size={16} /></button>
                <button onClick={() => removeSection(idx)} className="p-1 hover:text-accent-error"><Trash2 size={16} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Section Title</label>
                  <input 
                    type="text" 
                    value={section.title}
                    onChange={(e) => updateSection(idx, 'title', e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                    placeholder="e.g. SHOP BY CATEGORY"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Display Type</label>
                  <select 
                    value={section.type}
                    onChange={(e) => updateSection(idx, 'type', e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                  >
                    <option value="category_circles">Category Circles (Horizontal)</option>
                    <option value="product_scroll">Product Scroll (Horizontal)</option>
                    <option value="featured_grid">Featured Grid (Square Tiles)</option>
                    <option value="official_merch_grid">Official Merch (Tall Tiles)</option>
                    <option value="banner_slider">Inline Banner Slider</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Section Subtitle</label>
                  <input 
                    type="text" 
                    value={section.subtitle}
                    onChange={(e) => updateSection(idx, 'subtitle', e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                    placeholder="Small text below title"
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="text-sm font-bold flex items-center gap-2">
                     <Target size={14} /> Items / Reference IDs
                   </h4>
                   <p className="text-[10px] text-text-muted italic">Add Product/Category IDs separated by comma for product scrolls</p>
                </div>
                <textarea 
                  value={(section.referenceIds || []).join(', ')}
                  onChange={(e) => updateSection(idx, 'referenceIds', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="Paste ID1, ID2, ID3..."
                  className="w-full bg-surface/30 border border-border rounded-xl p-3 text-xs font-mono h-20 focus:border-primary outline-none"
                />
              </div>
            </div>
          ))}

          {content.sections.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl">
              <p className="text-text-muted italic">No sections added yet. Click "Add New Section" to start building your home page.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeManagement;
