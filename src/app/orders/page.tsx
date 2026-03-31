"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ChevronRight, Truck, CheckCircle, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const mockOrders = [
  {
    id: "ORD-20250201",
    date: "2025-02-01",
    items: [{ name: "Soft Silk Bridal Elegance", qty: 1, price: 10500 }],
    total: 11024,
    status: "delivered",
  },
  {
    id: "ORD-20250115",
    date: "2025-01-15",
    items: [
      { name: "Soft Silk Royal Heritage", qty: 1, price: 8200 },
      { name: "Soft Silk Floral Dreams", qty: 2, price: 7200 },
    ],
    total: 23720,
    status: "shipped",
  },
  {
    id: "ORD-20250108",
    date: "2025-01-08",
    items: [{ name: "Soft Silk Golden Weave", qty: 1, price: 7800 }],
    total: 8190,
    status: "processing",
  },
];

const statusConfig = {
  delivered: { label: "Delivered", icon: CheckCircle, color: "text-green-600 bg-green-50" },
  shipped: { label: "Shipped", icon: Truck, color: "text-blue-600 bg-blue-50" },
  processing: { label: "Processing", icon: Clock, color: "text-orange-600 bg-orange-50" },
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-maroon-800 to-maroon-900 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm mb-2">Order History</p>
          <h1 className="font-heading text-4xl text-white">My Orders</h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        {mockOrders.map((order, i) => {
          const status = statusConfig[order.status as keyof typeof statusConfig];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-vintage p-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <div>
                  <p className="font-heading text-lg text-maroon-800">{order.id}</p>
                  <p className="text-xs text-gray-500">Placed on {order.date}</p>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
                  <status.icon size={14} /> {status.label}
                </span>
              </div>
              <div className="space-y-2 border-t border-gold-100 pt-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} x{item.qty}</span>
                    <span className="text-maroon-800 font-medium">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4 pt-4 border-t border-gold-100">
                <span className="font-heading text-lg text-maroon-800">Total: {formatPrice(order.total)}</span>
                <button className="flex items-center gap-1 text-sm text-maroon-600 hover:text-maroon-800">
                  View Details <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
