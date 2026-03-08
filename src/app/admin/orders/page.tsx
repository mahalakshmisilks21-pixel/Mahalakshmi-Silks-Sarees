"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Eye, Truck, CheckCircle, Clock, XCircle, ChevronDown,
  X, Package, MapPin, CreditCard, Phone, Mail, Check, AlertCircle,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { formatPrice } from "@/lib/utils";
import { Dropdown } from "@/components/ui/Dropdown";
import { Order } from "@/context/AdminContext";

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  processing: { label: "Processing", icon: Clock, color: "text-orange-600 bg-orange-50" },
  confirmed: { label: "Confirmed", icon: AlertCircle, color: "text-indigo-600 bg-indigo-50" },
  shipped: { label: "Shipped", icon: Truck, color: "text-blue-600 bg-blue-50" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "text-green-600 bg-green-50" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-600 bg-red-50" },
};

const paymentColors: Record<string, string> = {
  paid: "text-green-600 bg-green-50",
  pending: "text-orange-600 bg-orange-50",
  failed: "text-red-600 bg-red-50",
  refunded: "text-gray-600 bg-gray-50",
};

const statusFlow: Order["status"][] = ["processing", "confirmed", "shipped", "delivered"];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  function handleStatusChange(orderId: string, newStatus: Order["status"]) {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    setSuccessMsg(`Order ${orderId} updated to ${newStatus}`);
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  const totalRevenue = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.totalAmount, 0);

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
        <h1 className="font-heading text-3xl text-maroon-800">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">
          {orders.length} total orders · {formatPrice(totalRevenue)} revenue
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = orders.filter((o) => o.status === key).length;
          return (
            <button key={key} onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
              className={`card-vintage p-4 flex items-center gap-3 transition-all ${statusFilter === key ? "ring-2 ring-maroon-600" : ""}`}>
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${config.color}`}>
                <config.icon size={18} />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500">{config.label}</p>
                <p className="font-heading text-xl text-maroon-800">{count}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..." className="input-vintage pl-11" />
        </div>
        <Dropdown
          options={[{ label: "All Status", value: "all" }, ...Object.entries(statusConfig).map(([key, config]) => ({ label: config.label, value: key }))]}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-40"
        />
      </div>

      {/* Table */}
      <div className="card-vintage overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-100 text-left">
                <th className="p-4 text-gray-500 font-medium">Order ID</th>
                <th className="p-4 text-gray-500 font-medium">Customer</th>
                <th className="p-4 text-gray-500 font-medium">Items</th>
                <th className="p-4 text-gray-500 font-medium">Amount</th>
                <th className="p-4 text-gray-500 font-medium">Payment</th>
                <th className="p-4 text-gray-500 font-medium">Status</th>
                <th className="p-4 text-gray-500 font-medium">Date</th>
                <th className="p-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((order, i) => {
                const status = statusConfig[order.status];
                return (
                  <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }} className="border-b border-gold-50 hover:bg-cream-50 transition-colors">
                    <td className="p-4 font-medium text-maroon-800">{order.id}</td>
                    <td className="p-4">
                      <p className="text-maroon-800">{order.customer}</p>
                      <p className="text-xs text-gray-400">{order.email}</p>
                    </td>
                    <td className="p-4 text-gray-600">{order.items.length}</td>
                    <td className="p-4 font-medium text-maroon-800">{formatPrice(order.totalAmount)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${paymentColors[order.paymentStatus] || ""}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <Dropdown
                        options={Object.entries(statusConfig).map(([key, c]) => ({ label: c.label, value: key }))}
                        value={order.status}
                        onChange={(val) => handleStatusChange(order.id, val as Order["status"])}
                        className="w-36"
                      />
                    </td>
                    <td className="p-4 text-gray-500">{order.date}</td>
                    <td className="p-4">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-400 hover:text-maroon-600 transition-colors">
                        <Eye size={16} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sorted.length === 0 && (
          <div className="p-12 text-center">
            <Package size={48} className="text-gold-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders found.</p>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-400 mt-4">Showing {sorted.length} of {orders.length} orders</p>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50" onClick={() => setSelectedOrder(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white border border-gold-200 rounded-sm shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 z-10">
              <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading text-2xl text-maroon-800">{selectedOrder.id}</h2>
                  <p className="text-sm text-gray-500">{selectedOrder.date}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium capitalize ${statusConfig[selectedOrder.status]?.color || ""}`}>
                  {statusConfig[selectedOrder.status]?.label}
                </span>
              </div>

              {/* Status Timeline */}
              <div className="mb-8">
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Order Progress</p>
                <div className="flex items-center gap-1">
                  {statusFlow.map((s, i) => {
                    const currentIdx = statusFlow.indexOf(selectedOrder.status as typeof statusFlow[number]);
                    const done = i <= currentIdx;
                    const isCurrent = i === currentIdx;
                    return (
                      <div key={s} className="flex-1 flex items-center gap-1">
                        <div className={`w-full h-2 rounded-full transition-colors ${done ? "bg-green-500" : "bg-gray-200"} ${isCurrent ? "ring-2 ring-green-300" : ""}`} />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  {statusFlow.map((s) => <span key={s} className="text-[10px] text-gray-400 capitalize">{s}</span>)}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-cream-50 rounded-sm p-4 space-y-2">
                  <p className="text-xs text-gray-400 uppercase font-medium">Customer</p>
                  <p className="text-maroon-800 font-medium">{selectedOrder.customer}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><Mail size={12} /> {selectedOrder.email}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><Phone size={12} /> {selectedOrder.phone}</div>
                </div>
                <div className="bg-cream-50 rounded-sm p-4 space-y-2">
                  <p className="text-xs text-gray-400 uppercase font-medium">Shipping</p>
                  <div className="flex items-start gap-2 text-sm text-gray-600"><MapPin size={14} className="shrink-0 mt-0.5" /> {selectedOrder.shippingAddress}</div>
                  {selectedOrder.trackingId && (
                    <div className="flex items-center gap-2 text-xs text-gray-500"><Truck size={12} /> {selectedOrder.trackingId}</div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <p className="text-xs text-gray-400 uppercase font-medium mb-3">Order Items</p>
                <div className="border border-gold-100 rounded-sm overflow-hidden">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border-b border-gold-50 last:border-0">
                      <div>
                        <p className="text-sm text-maroon-800 font-medium">{item.productName}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-heading text-maroon-800">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Total */}
              <div className="flex items-center justify-between bg-maroon-50 rounded-sm p-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><CreditCard size={14} /> {selectedOrder.paymentMethod}</div>
                  <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${paymentColors[selectedOrder.paymentStatus] || ""}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-heading text-2xl text-maroon-800">{formatPrice(selectedOrder.totalAmount)}</p>
                </div>
              </div>

              {/* Update Status */}
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-600">Update status:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <button key={key}
                      onClick={() => handleStatusChange(selectedOrder.id, key as Order["status"])}
                      disabled={selectedOrder.status === key}
                      className={`px-3 py-1.5 rounded-sm text-xs font-medium capitalize transition-colors border ${selectedOrder.status === key
                        ? "bg-maroon-700 text-white border-maroon-700"
                        : "border-gold-200 text-gray-600 hover:border-maroon-400 hover:text-maroon-700"
                        }`}>
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
