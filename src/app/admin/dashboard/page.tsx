"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  IndianRupee,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function AdminDashboard() {
  const { products, orders, customers, inventoryLogs } = useAdmin();

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((s, o) => s + o.totalAmount, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = customers.length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const outOfStock = products.filter((p) => p.stock === 0);

  const ordersByStatus = {
    processing: orders.filter((o) => o.status === "processing").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid").length;

  const stats = [
    { title: "Total Revenue", value: formatPrice(totalRevenue), change: `${paidOrders} paid orders`, up: totalRevenue > 0, icon: IndianRupee, color: "bg-green-50 text-green-600" },
    { title: "Total Orders", value: String(totalOrders), change: totalOrders > 0 ? `${ordersByStatus.delivered} delivered` : "No orders yet", up: totalOrders > 0, icon: ShoppingCart, color: "bg-blue-50 text-blue-600" },
    { title: "Products", value: String(totalProducts), change: `${lowStockProducts.length} low stock`, up: lowStockProducts.length === 0, icon: Package, color: "bg-purple-50 text-purple-600" },
    { title: "Customers", value: String(totalCustomers), change: totalCustomers > 0 ? `${customers.filter(c => c.status === "active").length} active` : "No customers yet", up: totalCustomers > 0, icon: Users, color: "bg-orange-50 text-orange-600" },
  ];

  const recentOrders = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);
  const recentLogs = inventoryLogs.slice(0, 5);

  const statusColors: Record<string, string> = {
    delivered: "text-green-600 bg-green-50",
    shipped: "text-blue-600 bg-blue-50",
    processing: "text-orange-600 bg-orange-50",
    confirmed: "text-indigo-600 bg-indigo-50",
    cancelled: "text-red-600 bg-red-50",
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-maroon-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s your store overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products" className="btn-primary text-sm flex items-center gap-2">
            <Package size={16} /> Manage Products
          </Link>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border border-red-200 rounded-sm p-4 flex items-start gap-3"
        >
          <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">
              {lowStockProducts.length} product{lowStockProducts.length > 1 ? "s" : ""} {outOfStock.length > 0 && `(${outOfStock.length} out of stock)`} need attention
            </p>
            <p className="text-xs text-red-600 mt-1">
              {lowStockProducts.map((p) => p.name).join(", ")}
            </p>
          </div>
          <Link href="/admin/inventory" className="text-sm text-red-700 font-medium hover:text-red-900 whitespace-nowrap">
            View Inventory →
          </Link>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-vintage p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-sm flex items-center justify-center ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-green-600" : "text-red-600"}`}>
                {stat.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="font-heading text-2xl text-maroon-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {Object.entries(ordersByStatus).map(([status, count]) => (
          <div key={status} className="card-vintage p-4 text-center">
            <p className="text-xs text-gray-500 capitalize">{status}</p>
            <p className="font-heading text-2xl text-maroon-800">{count}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="xl:col-span-2 card-vintage p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl text-maroon-800">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-maroon-600 hover:text-maroon-800">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gold-200">
                  <th className="pb-3 text-gray-500 font-medium">Order ID</th>
                  <th className="pb-3 text-gray-500 font-medium">Customer</th>
                  <th className="pb-3 text-gray-500 font-medium">Amount</th>
                  <th className="pb-3 text-gray-500 font-medium">Status</th>
                  <th className="pb-3 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gold-50 hover:bg-cream-50">
                    <td className="py-3 font-medium text-maroon-800">{order.id}</td>
                    <td className="py-3 text-gray-600">{order.customer}</td>
                    <td className="py-3 text-maroon-800">{formatPrice(order.totalAmount)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || ""}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Top Products */}
          <div className="card-vintage p-6">
            <h2 className="font-heading text-xl text-maroon-800 mb-6">Top Products</h2>
            <div className="space-y-4">
              {topProducts.map((product, i) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-maroon-100 flex items-center justify-center text-xs font-bold text-maroon-700">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-maroon-800 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.silkType} · Stock: {product.stock}</p>
                  </div>
                  <p className="text-sm font-heading text-maroon-800">{formatPrice(product.discountPrice || product.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Inventory Activity */}
          <div className="card-vintage p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl text-maroon-800">Inventory Activity</h2>
              <Link href="/admin/inventory" className="text-sm text-maroon-600 hover:text-maroon-800">View all →</Link>
            </div>
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 text-sm">
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${log.type === "restock" ? "bg-green-50 text-green-600" :
                    log.type === "sale" ? "bg-blue-50 text-blue-600" :
                      log.type === "return" ? "bg-orange-50 text-orange-600" :
                        "bg-red-50 text-red-600"
                    }`}>
                    {log.type === "restock" ? <TrendingUp size={14} /> :
                      log.type === "sale" ? <ShoppingCart size={14} /> :
                        log.type === "return" ? <Truck size={14} /> :
                          <AlertTriangle size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-maroon-800 truncate">{log.productName}</p>
                    <p className="text-xs text-gray-400">{log.note}</p>
                  </div>
                  <span className={`text-xs font-medium ${log.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                    {log.quantity > 0 ? "+" : ""}{log.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
