"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Package, Upload, X, Image as ImageIcon, Link2 } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { SILK_TYPES, COLORS, CATEGORIES } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { Dropdown } from "@/components/ui/Dropdown";
import Link from "next/link";

function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const EMPTY_FORM = {
    name: "", slug: "", description: "", silkType: "Soft Silk",
    price: "", discountPrice: "", stock: "", colors: [] as string[],
    images: [] as string[],
    rating: "4.5", reviewCount: "0", isFeatured: false, isBestSeller: false, category: "wedding",
};

type FormData = typeof EMPTY_FORM;

export default function AddProductPage() {
    const router = useRouter();
    const { addProduct } = useAdmin();
    const [form, setForm] = useState<FormData>(EMPTY_FORM);
    const [successMsg, setSuccessMsg] = useState("");
    const [uploading, setUploading] = useState(false);
    const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
    const [dragOver, setDragOver] = useState(false);

    function toggleColor(color: string) {
        setForm((f) => ({
            ...f,
            colors: f.colors.includes(color) ? f.colors.filter((c) => c !== color) : [...f.colors, color],
        }));
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

    function removeImage(index: number) {
        setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
    }

    function handleSave() {
        if (!form.name || !form.price) return;

        addProduct({
            name: form.name,
            slug: form.slug || generateSlug(form.name),
            description: form.description,
            silkType: form.silkType,
            price: Number(form.price) || 0,
            discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
            stock: Number(form.stock) || 0,
            colors: form.colors.length ? form.colors : ["Red"],
            images: form.images,
            rating: Number(form.rating) || 4.5,
            reviewCount: Number(form.reviewCount) || 0,
            isFeatured: form.isFeatured,
            isBestSeller: form.isBestSeller,
            category: form.category,
        });

        setSuccessMsg("Product added successfully!");
        setTimeout(() => {
            router.push("/admin/products");
        }, 1200);
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Success Toast */}
            {successMsg && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-sm px-4 py-3 flex items-center gap-2 shadow-lg"
                >
                    <Check size={16} className="text-green-600" />
                    <span className="text-sm text-green-800">{successMsg}</span>
                </motion.div>
            )}

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/products"
                    className="w-10 h-10 flex items-center justify-center rounded-sm bg-cream-100 hover:bg-cream-200 text-maroon-700 transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="font-heading text-3xl text-maroon-800">Add New Saree</h1>
                    <p className="text-gray-500 text-sm mt-1">Fill in the details to add a new product to your store.</p>
                </div>
            </div>

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-vintage p-8"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                        <input
                            className="input-vintage"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
                            placeholder="Soft Silk Bridal Elegance"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                        <input
                            className="input-vintage bg-gray-50"
                            value={form.slug}
                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        />
                        <p className="text-xs text-gray-400 mt-1">Auto-generated from name. Used in the product URL.</p>
                    </div>

                    {/* Collection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Collection *</label>
                        <Dropdown
                            options={CATEGORIES.map((c) => ({ label: c.name, value: c.slug }))}
                            value={form.category}
                            onChange={(val) => setForm({ ...form, category: val })}
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                        <input
                            type="number"
                            className="input-vintage"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            placeholder="25000"
                        />
                    </div>

                    {/* Discount Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
                        <input
                            type="number"
                            className="input-vintage"
                            value={form.discountPrice}
                            onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                            placeholder="22000"
                        />
                        <p className="text-xs text-gray-400 mt-1">Leave empty if no discount.</p>
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                        <input
                            type="number"
                            className="input-vintage"
                            value={form.stock}
                            onChange={(e) => setForm({ ...form, stock: e.target.value })}
                            placeholder="20"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            className="input-vintage"
                            value={form.rating}
                            onChange={(e) => setForm({ ...form, rating: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <textarea
                            className="input-vintage h-32 resize-none"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Describe the saree — material, weaving technique, occasion, special features..."
                        />
                    </div>

                    {/* Colors */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => toggleColor(color)}
                                    className={`px-3 py-1.5 rounded-sm text-xs border transition-colors ${form.colors.includes(color)
                                        ? "bg-maroon-700 text-white border-maroon-700"
                                        : "bg-cream-50 text-gray-600 border-gold-200 hover:border-maroon-400"
                                        }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="md:col-span-2 flex gap-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.isFeatured}
                                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                                className="w-4 h-4 accent-maroon-700"
                            />
                            <span className="text-sm text-gray-600">Featured Product</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.isBestSeller}
                                onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                                className="w-4 h-4 accent-maroon-700"
                            />
                            <span className="text-sm text-gray-600">Best Seller</span>
                        </label>
                    </div>

                    {/* ── Image Upload / URL Section ── */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>

                        {/* Mode Toggle */}
                        <div className="flex gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => setImageMode("upload")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs border transition-colors ${imageMode === "upload" ? "bg-maroon-700 text-white border-maroon-700" : "bg-cream-50 text-gray-600 border-gold-200"}`}
                            >
                                <Upload size={14} /> Upload Image
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageMode("url")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs border transition-colors ${imageMode === "url" ? "bg-maroon-700 text-white border-maroon-700" : "bg-cream-50 text-gray-600 border-gold-200"}`}
                            >
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
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDragOver(false);
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) handleFileDrop(file);
                                }}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                    disabled={uploading}
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
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
                                <input
                                    className="input-vintage flex-1"
                                    placeholder="https://example.com/image.jpg"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const val = (e.target as HTMLInputElement).value.trim();
                                            if (val) {
                                                setForm((f) => ({ ...f, images: [...f.images, val] }));
                                                (e.target as HTMLInputElement).value = "";
                                            }
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const input = document.querySelector<HTMLInputElement>('input[placeholder="https://example.com/image.jpg"]');
                                        const val = input?.value.trim();
                                        if (val) {
                                            setForm((f) => ({ ...f, images: [...f.images, val] }));
                                            if (input) input.value = "";
                                        }
                                    }}
                                    className="btn-primary text-xs px-4"
                                >
                                    Add
                                </button>
                            </div>
                        )}

                        {/* Image Previews */}
                        {form.images.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-4">
                                {form.images.map((img, i) => (
                                    <div key={i} className="relative w-24 h-24 rounded-sm overflow-hidden border border-gold-200 group">
                                        <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="text-xs text-gray-400 mt-2">Upload images or paste URLs. Leave empty for auto-generated placeholder.</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-gold-100">
                    <Link href="/admin/products" className="btn-secondary text-sm">
                        Cancel
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={!form.name || !form.price || !!successMsg}
                        className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Package size={16} />
                        Add Product
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
