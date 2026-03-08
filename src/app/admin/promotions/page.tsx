"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight } from "lucide-react";
import { usePromotions, Offer } from "@/context/PromotionContext";

export default function AdminPromotionsPage() {
    const { announcement, updateAnnouncement, offers, addOffer, updateOffer, deleteOffer } = usePromotions();
    const [editOffer, setEditOffer] = useState<Offer | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // New offer form state
    const [form, setForm] = useState({ title: "", description: "", code: "", discount: 10, active: true });

    const resetForm = () => { setForm({ title: "", description: "", code: "", discount: 10, active: true }); setShowAddForm(false); setEditOffer(null); };

    const handleSave = () => {
        if (!form.title.trim() || !form.code.trim()) return;
        if (editOffer) {
            updateOffer(editOffer.id, form);
        } else {
            addOffer(form);
        }
        resetForm();
    };

    const openEdit = (offer: Offer) => {
        setEditOffer(offer);
        setForm({ title: offer.title, description: offer.description, code: offer.code, discount: offer.discount, active: offer.active });
        setShowAddForm(true);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="font-heading text-2xl text-maroon-900">Promotions</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your announcement bar and offer coupons</p>
            </div>

            {/* ── Announcement Bar ── */}
            <div className="card-vintage p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Megaphone size={18} className="text-maroon-700" />
                        <h2 className="font-heading text-lg text-maroon-800">Announcement Bar</h2>
                    </div>
                    <button
                        onClick={() => updateAnnouncement({ enabled: !announcement.enabled })}
                        className="flex items-center gap-2 text-sm"
                    >
                        {announcement.enabled ? (
                            <><ToggleRight size={24} className="text-green-600" /><span className="text-green-600 font-medium">Active</span></>
                        ) : (
                            <><ToggleLeft size={24} className="text-gray-400" /><span className="text-gray-400">Inactive</span></>
                        )}
                    </button>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Scrolling text displayed at the top of every page</label>
                        <textarea
                            className="input-vintage text-sm w-full h-20 resize-none"
                            value={announcement.text}
                            onChange={(e) => updateAnnouncement({ text: e.target.value })}
                            placeholder="Enter announcement text..."
                        />
                    </div>
                    <div className={`text-xs px-3 py-2 rounded-sm ${announcement.enabled ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>
                        Preview: {announcement.enabled ? announcement.text || "(empty)" : "(disabled — not visible on site)"}
                    </div>
                </div>
            </div>

            {/* ── Offer Coupons ── */}
            <div className="card-vintage p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-lg text-maroon-800">Offer Coupons</h2>
                    <button
                        onClick={() => { resetForm(); setShowAddForm(true); }}
                        className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
                    >
                        <Plus size={14} /> Add Offer
                    </button>
                </div>

                {/* Offers table */}
                <div className="divide-y divide-gray-100">
                    {offers.length === 0 ? (
                        <p className="text-sm text-gray-400 py-8 text-center">No offers yet. Click "Add Offer" to create one.</p>
                    ) : (
                        offers.map((offer) => (
                            <div key={offer.id} className="flex items-center gap-4 py-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="font-medium text-sm text-maroon-800">{offer.title}</span>
                                        <span className="bg-cream-100 border border-gold-300 text-maroon-700 font-mono text-[10px] tracking-wider px-2 py-0.5 rounded">{offer.code}</span>
                                        <span className="text-xs text-gold-600 font-medium">{offer.discount}% off</span>
                                        {offer.active ? (
                                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Active</span>
                                        ) : (
                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Inactive</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">{offer.description}</p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button onClick={() => updateOffer(offer.id, { active: !offer.active })}
                                        className="p-1.5 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors"
                                        title={offer.active ? "Deactivate" : "Activate"}>
                                        {offer.active ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} className="text-gray-400" />}
                                    </button>
                                    <button onClick={() => openEdit(offer)}
                                        className="p-1.5 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors text-gray-500">
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => setDeleteConfirm(offer.id)}
                                        className="p-1.5 border border-red-200 rounded-sm hover:bg-red-50 transition-colors text-red-400">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ── Add/Edit Offer Modal ── */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => resetForm()}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-sm shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-heading text-lg text-maroon-800">{editOffer ? "Edit Offer" : "New Offer"}</h3>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Title *</label>
                                    <input className="input-vintage text-sm w-full" value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Wedding Season Sale" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Description</label>
                                    <input className="input-vintage text-sm w-full" value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Up to 30% off on Wedding Collection" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Coupon Code *</label>
                                        <input className="input-vintage text-sm w-full font-mono uppercase" value={form.code}
                                            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WEDDING30" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Discount %</label>
                                        <input type="number" min={1} max={100} className="input-vintage text-sm w-full" value={form.discount}
                                            onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-5">
                                <button onClick={resetForm} className="btn-secondary text-sm px-4 py-2">Cancel</button>
                                <button onClick={handleSave} disabled={!form.title.trim() || !form.code.trim()}
                                    className="btn-primary text-sm px-5 py-2 flex items-center gap-2 disabled:opacity-50">
                                    <Check size={14} /> {editOffer ? "Save Changes" : "Add Offer"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Delete Confirm ── */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-white rounded-sm shadow-xl p-6 w-full max-w-sm text-center">
                            <Trash2 size={32} className="text-red-500 mx-auto mb-3" />
                            <h3 className="font-heading text-lg text-maroon-800 mb-2">Delete Offer?</h3>
                            <p className="text-sm text-gray-500 mb-6">This will remove the coupon from the website.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1 text-sm py-2">Cancel</button>
                                <button onClick={() => { deleteOffer(deleteConfirm); setDeleteConfirm(null); }}
                                    className="flex-1 bg-red-600 text-white text-sm py-2 rounded-sm hover:bg-red-700 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
