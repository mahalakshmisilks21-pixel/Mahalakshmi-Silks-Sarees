"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit3, Trash2, Eye, Package, X,
  ChevronDown, AlertTriangle, Check, Upload, Image as ImageIcon, Link2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/context/AdminContext";
import { Dropdown } from "@/components/ui/Dropdown";
import { formatPrice } from "@/lib/utils";
import { Product, SILK_TYPES, COLORS, CATEGORIES } from "@/lib/data";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

const EMPTY_FORM = {
  name: "", slug: "", description: "", silkType: "Soft Silk",
  price: "", discountPrice: "", stock: "", colors: [] as string[],
  images: [] as string[],
  rating: "4.5", reviewCount: "0", isFeatured: false, isBestSeller: false, category: "wedding",
};

type FormData = typeof EMPTY_FORM;

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminProductsPage() {
  const { products, updateProduct, deleteProduct } = useAdmin();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [dragOver, setDragOver] = useState(false);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.silkType.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.silkType === typeFilter;
    const matchStock = stockFilter === "all" || (stockFilter === "low" && p.stock <= 5 && p.stock > 0) || (stockFilter === "out" && p.stock === 0) || (stockFilter === "in" && p.stock > 5);
    return matchSearch && matchType && matchStock;
  });



  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;
    const { error } = await supabase.storage.from("product-images").upload(filePath, file);
    if (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Make sure 'product-images' bucket exists in Supabase Storage.");
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
    setForm((f) => ({ ...f, images: [...f.images, urlData.publicUrl] }));
    setUploading(false);
  }

  async function handleFileDrop(file: File) {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;
    const { error } = await supabase.storage.from("product-images").upload(filePath, file);
    if (error) { alert("Upload failed: " + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(filePath);
    setForm((f) => ({ ...f, images: [...f.images, publicUrl] }));
    setUploading(false);
  }

  function removeImage(index: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  }

  function openEdit(product: Product) {
    setSelectedProduct(product);
    setForm({
      name: product.name, slug: product.slug, description: product.description,
      silkType: product.silkType, price: String(product.price),
      discountPrice: product.discountPrice ? String(product.discountPrice) : "",
      stock: String(product.stock), colors: product.colors,
      images: product.images, rating: String(product.rating),
      reviewCount: String(product.reviewCount), isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller, category: product.category,
    });
    setImageMode("upload");
    setModalMode("edit");
  }

  function openView(product: Product) {
    setSelectedProduct(product);
    setModalMode("view");
  }

  function handleSave() {
    const productData = {
      name: form.name, slug: form.slug || generateSlug(form.name),
      description: form.description, silkType: form.silkType,
      price: Number(form.price) || 0, discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: Number(form.stock) || 0, colors: form.colors.length ? form.colors : ["Red"],
      images: form.images, rating: Number(form.rating) || 4.5,
      reviewCount: Number(form.reviewCount) || 0,
      isFeatured: form.isFeatured, isBestSeller: form.isBestSeller,
      category: form.category,
    };

    if (modalMode === "edit" && selectedProduct) {
      updateProduct(selectedProduct.id, productData);
      showSuccess("Product updated successfully!");
    }
    setModalMode(null);
  }

  function handleDelete(id: string) {
    deleteProduct(id);
    setDeleteConfirm(null);
    showSuccess("Product deleted successfully!");
  }

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  function toggleColor(color: string) {
    setForm((f) => ({
      ...f,
      colors: f.colors.includes(color) ? f.colors.filter((c) => c !== color) : [...f.colors, color],
    }));
  }

  return (
    <div>
      {/* Success toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-sm px-4 py-3 flex items-center gap-2 shadow-lg"
          >
            <Check size={16} className="text-green-600" />
            <span className="text-sm text-green-800">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl text-maroon-800">Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            {products.length} total · {products.filter((p) => p.stock <= 5).length} low stock · {products.filter((p) => p.stock === 0).length} out of stock
          </p>
        </div>
        <Link href="/admin/products/add" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..." className="input-vintage pl-11" />
        </div>
        <Dropdown
          options={[{ label: "All Types", value: "all" }, ...SILK_TYPES.map((t) => ({ label: t, value: t }))]}
          value={typeFilter}
          onChange={setTypeFilter}
          className="w-40"
        />
        <Dropdown
          options={[
            { label: "All Stock", value: "all" },
            { label: "In Stock (>5)", value: "in" },
            { label: "Low Stock (1-5)", value: "low" },
            { label: "Out of Stock", value: "out" },
          ]}
          value={stockFilter}
          onChange={setStockFilter}
          className="w-44"
        />
      </div>

      {/* Table */}
      <div className="card-vintage overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-100 text-left">
                <th className="p-4 text-gray-500 font-medium">Product</th>
                <th className="p-4 text-gray-500 font-medium">Type</th>
                <th className="p-4 text-gray-500 font-medium">Price</th>
                <th className="p-4 text-gray-500 font-medium">Stock</th>
                <th className="p-4 text-gray-500 font-medium">Rating</th>
                <th className="p-4 text-gray-500 font-medium">Featured</th>
                <th className="p-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }} className="border-b border-gold-50 hover:bg-cream-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-sm overflow-hidden shrink-0 bg-cream-100">
                        {product.images && product.images.length > 0 && product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <PlaceholderImage label={product.name.slice(0, 15)} variant="saree" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-maroon-800 truncate max-w-[200px]">{product.name}</p>
                        <p className="text-xs text-gray-400">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gold-50 text-gold-700 rounded-sm text-xs">{product.silkType}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-maroon-800 font-medium">{formatPrice(product.discountPrice || product.price)}</p>
                    {product.discountPrice && <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${product.stock > 10 ? "text-green-600" : product.stock > 3 ? "text-orange-600" : product.stock === 0 ? "text-red-600" : "text-red-500"}`}>
                        {product.stock}
                      </span>
                      {product.stock <= 5 && product.stock > 0 && <AlertTriangle size={14} className="text-orange-500" />}
                      {product.stock === 0 && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-sm font-medium">OUT</span>}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{product.rating}/5 <span className="text-xs text-gray-400">({product.reviewCount})</span></td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {product.isFeatured && <span className="text-[10px] bg-gold-50 text-gold-700 px-1.5 py-0.5 rounded-sm">Featured</span>}
                      {product.isBestSeller && <span className="text-[10px] bg-maroon-50 text-maroon-700 px-1.5 py-0.5 rounded-sm">Best</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openView(product)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View"><Eye size={16} /></button>
                      <button onClick={() => openEdit(product)} className="p-2 text-gray-400 hover:text-maroon-600 transition-colors" title="Edit"><Edit3 size={16} /></button>
                      <button onClick={() => setDeleteConfirm(product.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Package size={48} className="text-gold-300 mx-auto mb-3" />
            <p className="text-gray-500">No products found matching your filters.</p>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-400 mt-4">Showing {filtered.length} of {products.length} products</p>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white border border-gold-200 rounded-sm shadow-2xl w-full max-w-md p-6 z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-50 rounded-sm flex items-center justify-center">
                  <Trash2 size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-heading text-lg text-maroon-800">Delete Product</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete <strong>{products.find((p) => p.id === deleteConfirm)?.name}</strong>?
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="btn-secondary text-sm">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="bg-red-600 text-white px-4 py-2 rounded-sm text-sm hover:bg-red-700 transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {modalMode === "view" && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50" onClick={() => setModalMode(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white border border-gold-200 rounded-sm shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 z-10">
              <button onClick={() => setModalMode(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
              <h2 className="font-heading text-2xl text-maroon-800 mb-6">Product Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-cream-100">
                  {selectedProduct.images && selectedProduct.images.length > 0 && selectedProduct.images[0] ? (
                    <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  ) : (
                    <PlaceholderImage label={selectedProduct.name} variant="saree" />
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Name</p>
                    <p className="text-maroon-800 font-medium">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Silk Type</p>
                    <p className="text-maroon-800">{selectedProduct.silkType}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase">Price</p>
                      <p className="text-maroon-800 font-heading text-xl">{formatPrice(selectedProduct.discountPrice || selectedProduct.price)}</p>
                      {selectedProduct.discountPrice && <p className="text-xs text-gray-400 line-through">{formatPrice(selectedProduct.price)}</p>}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase">Stock</p>
                      <p className={`font-heading text-xl ${selectedProduct.stock <= 5 ? "text-red-600" : "text-green-600"}`}>{selectedProduct.stock}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Colors</p>
                    <div className="flex gap-2 mt-1">{selectedProduct.colors.map((c) => <span key={c} className="px-2 py-1 bg-cream-100 rounded-sm text-xs">{c}</span>)}</div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Rating</p>
                    <p className="text-maroon-800">{selectedProduct.rating}/5 ({selectedProduct.reviewCount} reviews)</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedProduct.isFeatured && <span className="px-2 py-1 bg-gold-50 text-gold-700 rounded-sm text-xs">Featured</span>}
                    {selectedProduct.isBestSeller && <span className="px-2 py-1 bg-maroon-50 text-maroon-700 rounded-sm text-xs">Best Seller</span>}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-xs text-gray-400 uppercase mb-1">Description</p>
                <p className="text-sm text-gray-600">{selectedProduct.description}</p>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => { openEdit(selectedProduct); }} className="btn-primary text-sm flex items-center gap-2">
                  <Edit3 size={14} /> Edit Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modalMode === "edit" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalMode(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white border border-gold-200 rounded-sm shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 z-10">
              <button onClick={() => setModalMode(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
              <h2 className="font-heading text-2xl text-maroon-800 mb-6">Edit Saree</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Product Name *</label>
                  <input className="input-vintage" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
                    placeholder="Soft Silk Bridal Elegance" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Slug</label>
                  <input className="input-vintage bg-gray-50" value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Collection *</label>
                  <Dropdown
                    options={CATEGORIES.map((c) => ({ label: c.name, value: c.slug }))}
                    value={form.category}
                    onChange={(val) => setForm({ ...form, category: val })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Price (INR) *</label>
                  <input type="number" className="input-vintage" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="25000" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Discount Price</label>
                  <input type="number" className="input-vintage" value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} placeholder="22000" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Stock *</label>
                  <input type="number" className="input-vintage" value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="20" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Rating</label>
                  <input type="number" step="0.1" min="0" max="5" className="input-vintage" value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Description *</label>
                  <textarea className="input-vintage h-24 resize-none" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the saree..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-2">Colors</label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((color) => (
                      <button key={color} type="button" onClick={() => toggleColor(color)}
                        className={`px-3 py-1.5 rounded-sm text-xs border transition-colors ${form.colors.includes(color)
                          ? "bg-maroon-700 text-white border-maroon-700"
                          : "bg-cream-50 text-gray-600 border-gold-200 hover:border-maroon-400"
                          }`}>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-maroon-700" />
                    <span className="text-sm text-gray-600">Featured Product</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isBestSeller}
                      onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                      className="w-4 h-4 accent-maroon-700" />
                    <span className="text-sm text-gray-600">Best Seller</span>
                  </label>
                </div>
                {/* ── Image Upload / URL Section ── */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-2">Product Images</label>

                  {/* Mode Toggle */}
                  <div className="flex gap-2 mb-3">
                    <button type="button" onClick={() => setImageMode("upload")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs border transition-colors ${imageMode === "upload" ? "bg-maroon-700 text-white border-maroon-700" : "bg-cream-50 text-gray-600 border-gold-200"}`}>
                      <Upload size={14} /> Upload Image
                    </button>
                    <button type="button" onClick={() => setImageMode("url")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs border transition-colors ${imageMode === "url" ? "bg-maroon-700 text-white border-maroon-700" : "bg-cream-50 text-gray-600 border-gold-200"}`}>
                      <Link2 size={14} /> Paste URL
                    </button>
                  </div>

                  {/* Upload Mode */}
                  {imageMode === "upload" && (
                    <div
                      className={`border-2 border-dashed rounded-sm p-6 text-center transition-all duration-200 ${dragOver
                          ? "border-maroon-600 bg-maroon-50 scale-[1.01] shadow-lg"
                          : "border-gold-300 bg-cream-50/50 hover:bg-cream-100/50"
                        }`}
                      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
                      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); }}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
                      onDrop={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        setDragOver(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleFileDrop(file);
                      }}
                    >
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="edit-image-upload" disabled={uploading} />
                      <label htmlFor="edit-image-upload" className="cursor-pointer">
                        {uploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-2 border-maroon-700 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-gray-500">Uploading...</span>
                          </div>
                        ) : dragOver ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-maroon-100 flex items-center justify-center">
                              <Upload size={24} className="text-maroon-600" />
                            </div>
                            <span className="text-sm font-medium text-maroon-700">Drop image here!</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <ImageIcon size={32} className="text-gold-400" />
                            <span className="text-sm text-gray-600">Click to upload <span className="text-gray-400">or drag & drop</span></span>
                            <span className="text-xs text-gray-400">JPG, PNG, WebP (max 5MB)</span>
                          </div>
                        )}
                      </label>
                    </div>
                  )}

                  {/* URL Mode */}
                  {imageMode === "url" && (
                    <div className="flex gap-2">
                      <input className="input-vintage flex-1" placeholder="https://example.com/image.jpg"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) { setForm((f) => ({ ...f, images: [...f.images, val] })); (e.target as HTMLInputElement).value = ""; }
                          }
                        }} />
                      <button type="button" onClick={() => {
                        const input = document.querySelector<HTMLInputElement>('#edit-url-input');
                        const val = input?.value.trim();
                        if (val) { setForm((f) => ({ ...f, images: [...f.images, val] })); if (input) input.value = ""; }
                      }} className="btn-primary text-xs px-4">Add</button>
                    </div>
                  )}

                  {/* Image Previews */}
                  {form.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-sm overflow-hidden border border-gold-200 group">
                          <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-2">Upload images or paste URLs. Leave empty for auto-generated placeholder.</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gold-100">
                <button onClick={() => setModalMode(null)} className="btn-secondary text-sm">Cancel</button>
                <button onClick={handleSave} disabled={!form.name || !form.price}
                  className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
