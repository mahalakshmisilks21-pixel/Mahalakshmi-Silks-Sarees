"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Warehouse, AlertTriangle, Package, TrendingUp, TrendingDown,
  RefreshCw, ChevronDown, X, Check, ArrowUpCircle, ArrowDownCircle,
  RotateCcw, Wrench, ShoppingCart,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { formatPrice } from "@/lib/utils";
import { SILK_TYPES } from "@/lib/data";
import { Dropdown } from "@/components/ui/Dropdown";
import { InventoryLog } from "@/context/AdminContext";

const logTypeConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  restock: { label: "Restock", icon: ArrowUpCircle, color: "text-green-600 bg-green-50" },
  sale: { label: "Sale", icon: ShoppingCart, color: "text-blue-600 bg-blue-50" },
  adjustment: { label: "Adjustment", icon: Wrench, color: "text-orange-600 bg-orange-50" },
  return: { label: "Return", icon: RotateCcw, color: "text-purple-600 bg-purple-50" },
};

export default function AdminInventoryPage() {
  const { products, inventoryLogs, updateStock } = useAdmin();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stockView, setStockView] = useState<"all" | "low" | "out">("all");
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [stockAction, setStockAction] = useState<InventoryLog["type"]>("restock");
  const [stockQty, setStockQty] = useState("");
  const [stockNote, setStockNote] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"stock" | "logs">("stock");

  // Stats
  const totalProducts = products.length;
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = products.filter((p) => p.stock === 0);
  const totalValue = products.reduce((s, p) => s + (p.discountPrice || p.price) * p.stock, 0);

  // Filtered products for stock view
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.silkType.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.silkType === typeFilter;
    const matchStock = stockView === "all" || (stockView === "low" && p.stock > 0 && p.stock <= 5) || (stockView === "out" && p.stock === 0);
    return matchSearch && matchType && matchStock;
  }).sort((a, b) => a.stock - b.stock);

  function openStockModal(productId: string, action: InventoryLog["type"] = "restock") {
    setSelectedProductId(productId);
    setStockAction(action);
    setStockQty("");
    setStockNote("");
    setShowStockModal(true);
  }

  function handleStockUpdate() {
    const qty = parseInt(stockQty);
    if (!qty || !selectedProductId) return;
    const actualQty = stockAction === "sale" || stockAction === "adjustment" ? -Math.abs(qty) : Math.abs(qty);
    updateStock(selectedProductId, actualQty, stockAction, stockNote || `${stockAction} - ${Math.abs(qty)} units`);
    setShowStockModal(false);
    setSuccessMsg("Stock updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  return (
    <div>
      {/* Success toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-sm px-4 py-3 flex items-center gap-2 shadow-lg">
            <Check size={16} className="text-green-600" />
            <span className="text-sm text-green-800">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="font-heading text-3xl text-maroon-800">Inventory Management</h1>
        <p className="text-gray-500 text-sm mt-1">Track stock levels, manage restocking, and monitor inventory health</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-vintage p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-sm"><Package size={20} /></div>
            <div><p className="text-xs text-gray-500">Products</p><p className="font-heading text-xl text-maroon-800">{totalProducts}</p></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-vintage p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 text-green-600 flex items-center justify-center rounded-sm"><Warehouse size={20} /></div>
            <div><p className="text-xs text-gray-500">Total Stock</p><p className="font-heading text-xl text-maroon-800">{totalStock}</p></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-vintage p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-50 text-gold-600 flex items-center justify-center rounded-sm"><TrendingUp size={20} /></div>
            <div><p className="text-xs text-gray-500">Stock Value</p><p className="font-heading text-xl text-maroon-800">{formatPrice(totalValue)}</p></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className={`card-vintage p-5 ${lowStockProducts.length > 0 ? "border-orange-300 bg-orange-50/30" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 flex items-center justify-center rounded-sm"><AlertTriangle size={20} /></div>
            <div><p className="text-xs text-gray-500">Low Stock</p><p className="font-heading text-xl text-orange-600">{lowStockProducts.length}</p></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`card-vintage p-5 ${outOfStockProducts.length > 0 ? "border-red-300 bg-red-50/30" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 text-red-600 flex items-center justify-center rounded-sm"><TrendingDown size={20} /></div>
            <div><p className="text-xs text-gray-500">Out of Stock</p><p className="font-heading text-xl text-red-600">{outOfStockProducts.length}</p></div>
          </div>
        </motion.div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-orange-600" />
            <h3 className="text-sm font-medium text-orange-800">Low Stock Alerts</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-sm p-3 flex items-center justify-between border border-orange-100">
                <div className="min-w-0">
                  <p className="text-sm text-maroon-800 font-medium truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.silkType}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-orange-600">{p.stock} left</span>
                  <button onClick={() => openStockModal(p.id, "restock")}
                    className="px-2 py-1 bg-green-600 text-white rounded-sm text-xs hover:bg-green-700 transition-colors">
                    Restock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Out of Stock Alerts */}
      {outOfStockProducts.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-red-600" />
            <h3 className="text-sm font-medium text-red-800">Out of Stock</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {outOfStockProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-sm p-3 flex items-center justify-between border border-red-100">
                <div className="min-w-0">
                  <p className="text-sm text-maroon-800 font-medium truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.silkType} · {formatPrice(p.discountPrice || p.price)}</p>
                </div>
                <button onClick={() => openStockModal(p.id, "restock")}
                  className="px-2 py-1 bg-maroon-700 text-white rounded-sm text-xs hover:bg-maroon-800 transition-colors shrink-0">
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gold-200">
        <button onClick={() => setActiveTab("stock")}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === "stock" ? "border-maroon-700 text-maroon-800" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}>
          Stock Overview
        </button>
        <button onClick={() => setActiveTab("logs")}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === "logs" ? "border-maroon-700 text-maroon-800" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}>
          Activity Logs ({inventoryLogs.length})
        </button>
      </div>

      {activeTab === "stock" && (
        <>
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
            <div className="flex gap-2">
              {[{ key: "all", label: "All" }, { key: "low", label: "Low Stock" }, { key: "out", label: "Out of Stock" }].map((v) => (
                <button key={v.key} onClick={() => setStockView(v.key as typeof stockView)}
                  className={`px-4 py-2 rounded-sm text-sm transition-colors ${stockView === v.key ? "bg-maroon-700 text-white" : "bg-cream-100 text-gray-600 hover:bg-cream-200"
                    }`}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Table */}
          <div className="card-vintage overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-cream-100 text-left">
                    <th className="p-4 text-gray-500 font-medium">Product</th>
                    <th className="p-4 text-gray-500 font-medium">Type</th>
                    <th className="p-4 text-gray-500 font-medium">Price</th>
                    <th className="p-4 text-gray-500 font-medium">Stock Level</th>
                    <th className="p-4 text-gray-500 font-medium">Stock Value</th>
                    <th className="p-4 text-gray-500 font-medium">Status</th>
                    <th className="p-4 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, i) => {
                    const stockValue = (product.discountPrice || product.price) * product.stock;
                    const stockPercent = Math.min((product.stock / 50) * 100, 100);
                    return (
                      <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }} className="border-b border-gold-50 hover:bg-cream-50 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-maroon-800 truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-gray-400">SKU: {product.id}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-gold-50 text-gold-700 rounded-sm text-xs">{product.silkType}</span>
                        </td>
                        <td className="p-4 text-maroon-800">{formatPrice(product.discountPrice || product.price)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 max-w-[120px]">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${product.stock === 0 ? "bg-red-500" : product.stock <= 5 ? "bg-orange-500" : "bg-green-500"
                                    }`}
                                  style={{ width: `${stockPercent}%` }}
                                />
                              </div>
                            </div>
                            <span className={`text-sm font-bold min-w-[32px] ${product.stock === 0 ? "text-red-600" : product.stock <= 5 ? "text-orange-600" : "text-green-600"
                              }`}>{product.stock}</span>
                          </div>
                        </td>
                        <td className="p-4 text-maroon-800 font-medium">{formatPrice(stockValue)}</td>
                        <td className="p-4">
                          {product.stock === 0 ? (
                            <span className="px-2 py-1 bg-red-50 text-red-600 rounded-sm text-xs font-medium">Out of Stock</span>
                          ) : product.stock <= 5 ? (
                            <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded-sm text-xs font-medium flex items-center gap-1 w-fit">
                              <AlertTriangle size={12} /> Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-green-50 text-green-600 rounded-sm text-xs font-medium">In Stock</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => openStockModal(product.id, "restock")}
                              className="px-2 py-1.5 bg-green-50 text-green-700 rounded-sm text-xs hover:bg-green-100 transition-colors flex items-center gap-1" title="Restock">
                              <ArrowUpCircle size={14} /> Add
                            </button>
                            <button onClick={() => openStockModal(product.id, "adjustment")}
                              className="px-2 py-1.5 bg-orange-50 text-orange-700 rounded-sm text-xs hover:bg-orange-100 transition-colors flex items-center gap-1" title="Adjust">
                              <RefreshCw size={14} /> Adjust
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredProducts.length === 0 && (
              <div className="p-12 text-center">
                <Warehouse size={48} className="text-gold-300 mx-auto mb-3" />
                <p className="text-gray-500">No products match your filters.</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "logs" && (
        <div className="card-vintage overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-100 text-left">
                  <th className="p-4 text-gray-500 font-medium">Date</th>
                  <th className="p-4 text-gray-500 font-medium">Product</th>
                  <th className="p-4 text-gray-500 font-medium">Type</th>
                  <th className="p-4 text-gray-500 font-medium">Quantity</th>
                  <th className="p-4 text-gray-500 font-medium">Stock Change</th>
                  <th className="p-4 text-gray-500 font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {inventoryLogs.map((log, i) => {
                  const typeConf = logTypeConfig[log.type];
                  return (
                    <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }} className="border-b border-gold-50 hover:bg-cream-50 transition-colors">
                      <td className="p-4 text-gray-500">{log.date}</td>
                      <td className="p-4">
                        <p className="text-maroon-800 font-medium truncate max-w-[200px]">{log.productName}</p>
                        <p className="text-xs text-gray-400">ID: {log.productId}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-medium ${typeConf.color}`}>
                          <typeConf.icon size={12} /> {typeConf.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${log.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                          {log.quantity > 0 ? "+" : ""}{log.quantity}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {log.previousStock} → {log.newStock}
                      </td>
                      <td className="p-4 text-gray-500 text-xs max-w-[200px] truncate">{log.note}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {inventoryLogs.length === 0 && (
            <div className="p-12 text-center">
              <RefreshCw size={48} className="text-gold-300 mx-auto mb-3" />
              <p className="text-gray-500">No inventory activity yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Stock Update Modal */}
      <AnimatePresence>
        {showStockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50" onClick={() => setShowStockModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white border border-gold-200 rounded-sm shadow-2xl w-full max-w-md p-6 z-10">
              <button onClick={() => setShowStockModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>

              <h2 className="font-heading text-xl text-maroon-800 mb-1">Update Stock</h2>
              <p className="text-sm text-gray-500 mb-6">{products.find((p) => p.id === selectedProductId)?.name}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Action Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(logTypeConfig) as [InventoryLog["type"], typeof logTypeConfig[string]][]).map(([key, config]) => (
                      <button key={key} onClick={() => setStockAction(key)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-sm text-sm border transition-colors ${stockAction === key ? "bg-maroon-700 text-white border-maroon-700" : "border-gold-200 text-gray-600 hover:border-maroon-400"
                          }`}>
                        <config.icon size={16} /> {config.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Quantity {stockAction === "sale" || stockAction === "adjustment" ? "(will be deducted)" : "(will be added)"}
                  </label>
                  <input type="number" className="input-vintage" value={stockQty}
                    onChange={(e) => setStockQty(e.target.value)} placeholder="Enter quantity" min="1" />
                  <p className="text-xs text-gray-400 mt-1">
                    Current stock: <strong>{products.find((p) => p.id === selectedProductId)?.stock || 0}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Note (optional)</label>
                  <input className="input-vintage" value={stockNote}
                    onChange={(e) => setStockNote(e.target.value)} placeholder="e.g. Supplier shipment, Damaged goods" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gold-100">
                <button onClick={() => setShowStockModal(false)} className="btn-secondary text-sm">Cancel</button>
                <button onClick={handleStockUpdate} disabled={!stockQty || parseInt(stockQty) <= 0}
                  className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  Update Stock
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
