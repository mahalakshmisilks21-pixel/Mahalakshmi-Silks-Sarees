"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Mail, Phone, ShoppingBag, Eye, MapPin, Calendar, X } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { formatPrice } from "@/lib/utils";
import { Customer } from "@/context/AdminContext";

export default function AdminCustomersPage() {
  const { customers, orders } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const totalRevenue = customers.reduce((s, c) => s + c.spent, 0);
  const avgOrderValue = totalRevenue / Math.max(customers.reduce((s, c) => s + c.orders, 0), 1);

  function getCustomerOrders(email: string) {
    return orders.filter((o) => o.email === email);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-maroon-800">Customers</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your customer base</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="card-vintage p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 flex items-center justify-center rounded-sm"><User size={22} /></div>
          <div><p className="text-xs text-gray-500">Total</p><p className="font-heading text-2xl text-maroon-800">{totalCustomers}</p></div>
        </div>
        <div className="card-vintage p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 flex items-center justify-center rounded-sm"><User size={22} /></div>
          <div><p className="text-xs text-gray-500">Active</p><p className="font-heading text-2xl text-maroon-800">{activeCustomers}</p></div>
        </div>
        <div className="card-vintage p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-sm"><ShoppingBag size={22} /></div>
          <div><p className="text-xs text-gray-500">Revenue</p><p className="font-heading text-2xl text-maroon-800">{formatPrice(totalRevenue)}</p></div>
        </div>
        <div className="card-vintage p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 flex items-center justify-center rounded-sm"><ShoppingBag size={22} /></div>
          <div><p className="text-xs text-gray-500">Avg. Order</p><p className="font-heading text-2xl text-maroon-800">{formatPrice(Math.round(avgOrderValue))}</p></div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..." className="input-vintage pl-11" />
        </div>
        <div className="flex gap-2">
          {["all", "active", "inactive"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-sm text-sm capitalize transition-colors ${
                statusFilter === s ? "bg-maroon-700 text-white" : "bg-cream-100 text-gray-600 hover:bg-cream-200"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-vintage overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-100 text-left">
                <th className="p-4 text-gray-500 font-medium">Customer</th>
                <th className="p-4 text-gray-500 font-medium">Contact</th>
                <th className="p-4 text-gray-500 font-medium">Orders</th>
                <th className="p-4 text-gray-500 font-medium">Total Spent</th>
                <th className="p-4 text-gray-500 font-medium">Status</th>
                <th className="p-4 text-gray-500 font-medium">Joined</th>
                <th className="p-4 text-gray-500 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer, i) => (
                <motion.tr key={customer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }} className="border-b border-gold-50 hover:bg-cream-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-maroon-100 flex items-center justify-center shrink-0">
                        <span className="font-heading text-maroon-700 text-sm">{customer.name[0]}</span>
                      </div>
                      <p className="font-medium text-maroon-800">{customer.name}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-0.5"><Mail size={11} /> {customer.email}</div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs"><Phone size={11} /> {customer.phone}</div>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{customer.orders}</td>
                  <td className="p-4 font-medium text-maroon-800">{formatPrice(customer.spent)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      customer.status === "active" ? "text-green-600 bg-green-50" : "text-gray-500 bg-gray-100"
                    }`}>{customer.status}</span>
                  </td>
                  <td className="p-4 text-gray-500">{customer.joinDate}</td>
                  <td className="p-4">
                    <button onClick={() => setSelectedCustomer(customer)} className="p-2 text-gray-400 hover:text-maroon-600 transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50" onClick={() => setSelectedCustomer(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white border border-gold-200 rounded-sm shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 z-10">
              <button onClick={() => setSelectedCustomer(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-maroon-100 flex items-center justify-center">
                  <span className="font-heading text-maroon-700 text-2xl">{selectedCustomer.name[0]}</span>
                </div>
                <div>
                  <h2 className="font-heading text-2xl text-maroon-800">{selectedCustomer.name}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                    selectedCustomer.status === "active" ? "text-green-600 bg-green-50" : "text-gray-500 bg-gray-100"
                  }`}>{selectedCustomer.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-cream-50 rounded-sm p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1"><Mail size={12} /> Email</div>
                  <p className="text-sm text-maroon-800">{selectedCustomer.email}</p>
                </div>
                <div className="bg-cream-50 rounded-sm p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1"><Phone size={12} /> Phone</div>
                  <p className="text-sm text-maroon-800">{selectedCustomer.phone}</p>
                </div>
                <div className="bg-cream-50 rounded-sm p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1"><MapPin size={12} /> Address</div>
                  <p className="text-sm text-maroon-800">{selectedCustomer.address}</p>
                </div>
                <div className="bg-cream-50 rounded-sm p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1"><Calendar size={12} /> Joined</div>
                  <p className="text-sm text-maroon-800">{selectedCustomer.joinDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="card-vintage p-4 text-center">
                  <p className="font-heading text-2xl text-maroon-800">{selectedCustomer.orders}</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="card-vintage p-4 text-center">
                  <p className="font-heading text-2xl text-maroon-800">{formatPrice(selectedCustomer.spent)}</p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
                <div className="card-vintage p-4 text-center">
                  <p className="font-heading text-2xl text-maroon-800">{formatPrice(Math.round(selectedCustomer.spent / Math.max(selectedCustomer.orders, 1)))}</p>
                  <p className="text-xs text-gray-500">Avg. Order</p>
                </div>
              </div>

              {/* Customer's Orders */}
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium mb-3">Order History</p>
                <div className="border border-gold-100 rounded-sm overflow-hidden">
                  {getCustomerOrders(selectedCustomer.email).length > 0 ? (
                    getCustomerOrders(selectedCustomer.email).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border-b border-gold-50 last:border-0">
                        <div>
                          <p className="text-sm text-maroon-800 font-medium">{order.id}</p>
                          <p className="text-xs text-gray-400">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-heading text-maroon-800">{formatPrice(order.totalAmount)}</p>
                          <span className={`text-[10px] capitalize ${
                            order.status === "delivered" ? "text-green-600" : order.status === "cancelled" ? "text-red-600" : "text-orange-600"
                          }`}>{order.status}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-gray-400 text-center">No orders found for this customer</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
