"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  MessageCircle,
  Megaphone,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useAuth } from "@/context/AuthContext";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { name: "Reviews", href: "/admin/reviews", icon: MessageCircle },
  { name: "Promotions", href: "/admin/promotions", icon: Megaphone },
  { name: "Invoice", href: "/admin/invoice", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

function LowStockBadge() {
  const { products } = useAdmin();
  const lowStock = products.filter((p) => p.stock <= 5).length;
  if (lowStock === 0) return null;
  return (
    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {lowStock}
    </span>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { products, orders } = useAdmin();
  const { user, logout, isAdmin } = useAuth();
  const lowStock = products.filter((p) => p.stock <= 5).length;
  const pendingOrders = orders.filter((o) => o.status === "processing").length;

  // Redirect non-admin users to login
  useEffect(() => {
    if (!isAdmin) {
      router.replace("/login");
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="h-screen overflow-hidden bg-cream-50">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between bg-black px-4 py-3 sticky top-0 z-50">
        <span className="font-heading text-xl text-gold-400">Mahalakshmi Admin</span>
        <div className="flex items-center gap-3">
          {lowStock > 0 && (
            <Link href="/admin/inventory" className="relative">
              <Bell size={20} className="text-gold-300" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                {lowStock}
              </span>
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 h-screen w-64 bg-black text-white transition-transform duration-300 flex flex-col overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
        >
          <div className="p-6 border-b border-gray-800">
            <Link href="/admin/dashboard" className="flex flex-col">
              <span className="font-heading text-2xl text-gold-400">Mahalakshmi</span>
              <span className="text-gold-200 text-[10px] tracking-[0.35em] uppercase mt-0.5">Admin Panel</span>
            </Link>
          </div>

          {/* Logged-in admin info */}
          {user && (
            <div className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-3 bg-gray-900/50 rounded-sm px-3 py-2.5">
                <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-cream-100 font-medium truncate">{user.name}</p>
                  <p className="text-[10px] text-cream-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Alerts */}
          {(lowStock > 0 || pendingOrders > 0) && (
            <div className="px-4 pt-2 space-y-2">
              {lowStock > 0 && (
                <Link href="/admin/inventory" className="flex items-center gap-2 bg-red-900/40 border border-red-700/50 rounded-sm px-3 py-2 text-xs text-red-300 hover:bg-red-900/60 transition-colors">
                  <Warehouse size={14} />
                  {lowStock} low stock item{lowStock > 1 ? "s" : ""}
                  <ChevronRight size={12} className="ml-auto" />
                </Link>
              )}
              {pendingOrders > 0 && (
                <Link href="/admin/orders" className="flex items-center gap-2 bg-orange-900/40 border border-orange-700/50 rounded-sm px-3 py-2 text-xs text-orange-300 hover:bg-orange-900/60 transition-colors">
                  <ShoppingCart size={14} />
                  {pendingOrders} pending order{pendingOrders > 1 ? "s" : ""}
                  <ChevronRight size={12} className="ml-auto" />
                </Link>
              )}
            </div>
          )}

          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-all duration-200 ${isActive
                    ? "bg-gray-800 text-gold-400 shadow-sm"
                    : "text-cream-300 hover:bg-gray-900 hover:text-white"
                    }`}
                >
                  <link.icon size={18} />
                  {link.name}
                  {link.name === "Inventory" && <LowStockBadge />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-800 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-sm text-cream-300 hover:bg-gray-900 rounded-sm transition-colors"
            >
              <ShoppingCart size={18} /> Back to Store
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-300 hover:bg-red-900/40 rounded-sm transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main */}
        <main className="flex-1 lg:ml-64 h-screen overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutInner>{children}</AdminLayoutInner>;
}
