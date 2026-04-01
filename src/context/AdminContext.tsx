"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Product } from "@/lib/data";
import { supabase } from "@/lib/supabase";

/* ── Types ── */
export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  totalAmount: number;
  status: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  shippingAddress: string;
  date: string;
  trackingId?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  joinDate: string;
  address: string;
  status: "active" | "inactive";
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  type: "restock" | "sale" | "adjustment" | "return";
  quantity: number;
  previousStock: number;
  newStock: number;
  note: string;
  date: string;
}

/* ── Context ── */
interface AdminContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, "id">) => string;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  getOrderById: (id: string) => Order | undefined;
  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, "id">) => void;
  deleteCustomer: (id: string) => { success: boolean; error?: string };
  getCustomerById: (id: string) => Customer | undefined;
  // Inventory
  inventoryLogs: InventoryLog[];
  updateStock: (productId: string, quantity: number, type: InventoryLog["type"], note: string) => void;
  // Loading
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Fetch all data from Supabase on mount ── */
  useEffect(() => {
    async function fetchAll() {
      try {
        const [prodRes, ordRes, custRes, invRes] = await Promise.all([
          supabase.from("products").select("*").order("created_at", { ascending: false }),
          supabase.from("orders").select("*").order("created_at", { ascending: false }),
          supabase.from("customers").select("*").order("created_at", { ascending: false }),
          supabase.from("inventory_logs").select("*").order("created_at", { ascending: false }),
        ]);

        if (prodRes.data) setProducts(prodRes.data as Product[]);
        if (ordRes.data) setOrders(ordRes.data as Order[]);
        if (custRes.data) setCustomers(custRes.data as Customer[]);
        if (invRes.data) setInventoryLogs(invRes.data as InventoryLog[]);
      } catch (err) {
        console.error("Failed to fetch from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  /* ── Products CRUD ── */
  const addProduct = useCallback((product: Omit<Product, "id">) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = { ...product, id: newId };
    setProducts((prev) => [newProduct, ...prev]);

    supabase.from("products").insert({ ...newProduct }).then(({ error }) => {
      if (error) console.error("Insert product error:", error);
    });
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));

    supabase.from("products").update(updates).eq("id", id).then(({ error }) => {
      if (error) console.error("Update product error:", error);
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    // Find the product to get its image URLs before removing from state
    const product = products.find((p) => p.id === id);

    setProducts((prev) => prev.filter((p) => p.id !== id));

    // Delete images from Supabase Storage
    if (product?.images?.length) {
      const filePaths = product.images
        .filter((url) => url.includes("supabase.co/storage"))
        .map((url) => {
          // Extract path after /object/public/product-images/
          const match = url.match(/product-images\/(.+)$/);
          return match ? match[1] : null;
        })
        .filter(Boolean) as string[];

      if (filePaths.length > 0) {
        supabase.storage.from("product-images").remove(filePaths).then(({ error }) => {
          if (error) console.error("Delete images error:", error);
        });
      }
    }

    // Delete product from database
    supabase.from("products").delete().eq("id", id).then(({ error }) => {
      if (error) console.error("Delete product error:", error);
    });
  }, [products]);

  /* ── Orders ── */
  const addOrder = useCallback((order: Omit<Order, "id">) => {
    const orderId = `ORD-${Date.now()}`;
    const newOrder: Order = { ...order, id: orderId };
    setOrders((prev) => [newOrder, ...prev]);

    supabase.from("orders").insert({ ...newOrder }).then(({ error }) => {
      if (error) console.error("Insert order error:", error);
    });

    // Auto-create inventory sale logs for each item
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((p) => {
        const orderItem = order.items.find((item) => item.productId === p.id);
        if (orderItem) {
          const newStock = Math.max(0, p.stock - orderItem.quantity);
          const log: InventoryLog = {
            id: `INV-${Date.now()}-${p.id}`,
            productId: p.id,
            productName: p.name,
            type: "sale",
            quantity: -orderItem.quantity,
            previousStock: p.stock,
            newStock,
            note: `Order ${orderId}`,
            date: new Date().toISOString().split("T")[0],
          };
          setInventoryLogs((logs) => [log, ...logs]);

          // Persist inventory log & stock update
          supabase.from("inventory_logs").insert({ ...log }).then(({ error }) => {
            if (error) console.error("Insert inv log error:", error);
          });
          supabase.from("products").update({ stock: newStock }).eq("id", p.id).then(({ error }) => {
            if (error) console.error("Update stock error:", error);
          });

          return { ...p, stock: newStock };
        }
        return p;
      });
      return updatedProducts;
    });

    // Update customer's order count & spent amount
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.email === order.email) {
          const updated = { ...c, orders: c.orders + 1, spent: c.spent + order.totalAmount };
          supabase.from("customers").update({ orders: updated.orders, spent: updated.spent }).eq("id", c.id).then(({ error }) => {
            if (error) console.error("Update customer error:", error);
          });
          return updated;
        }
        return c;
      })
    );

    return orderId;
  }, []);

  const updateOrderStatus = useCallback((id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

    supabase.from("orders").update({ status }).eq("id", id).then(({ error }) => {
      if (error) console.error("Update order status error:", error);
    });
  }, []);

  const getOrderById = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  /* ── Customers ── */
  const addCustomer = useCallback(async (customer: Omit<Customer, "id">) => {
    // Quick in-memory check
    const alreadyInState = customers.some((c) => c.email === customer.email);
    if (alreadyInState) return;

    try {
      // Check if customer already exists in Supabase (maybeSingle returns null if not found, no error)
      const { data: existing, error: lookupError } = await supabase
        .from("customers")
        .select("id")
        .eq("email", customer.email)
        .maybeSingle();

      if (lookupError) {
        console.error("Customer lookup error:", lookupError);
        return;
      }

      if (existing) {
        console.log("[addCustomer] Already exists in DB:", customer.email);
        return;
      }

      const newCustomer = { ...customer, id: `cust-${Date.now()}` };
      const { error } = await supabase.from("customers").insert({ ...newCustomer });
      if (error) {
        console.error("Insert customer error:", error);
        return;
      }

      console.log("[addCustomer] New customer added:", customer.email);
      // Add to state after successful DB insert
      setCustomers((prev) => {
        if (prev.some((c) => c.email === customer.email)) return prev;
        return [...prev, newCustomer];
      });
    } catch (err) {
      console.error("addCustomer error:", err);
    }
  }, [customers]);

  const deleteCustomer = useCallback(
    (id: string) => {
      const customer = customers.find((c) => c.id === id);
      if (!customer) return { success: false, error: "Customer not found" };

      const hasOrders = orders.some((o) => o.email === customer.email);
      if (hasOrders) {
        return { success: false, error: "Cannot delete customer with existing orders" };
      }

      setCustomers((prev) => prev.filter((c) => c.id !== id));
      supabase.from("customers").delete().eq("id", id).then(({ error }) => {
        if (error) console.error("Delete customer error:", error);
      });

      return { success: true };
    },
    [customers, orders]
  );

  const getCustomerById = useCallback((id: string) => customers.find((c) => c.id === id), [customers]);

  /* ── Inventory ── */
  const updateStock = useCallback((productId: string, quantity: number, type: InventoryLog["type"], note: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + quantity);
          const log: InventoryLog = {
            id: `INV-${Date.now()}`,
            productId,
            productName: p.name,
            type,
            quantity,
            previousStock: p.stock,
            newStock,
            note,
            date: new Date().toISOString().split("T")[0],
          };
          setInventoryLogs((logs) => [log, ...logs]);

          // Persist to Supabase
          supabase.from("inventory_logs").insert({ ...log }).then(({ error }) => {
            if (error) console.error("Insert inv log error:", error);
          });
          supabase.from("products").update({ stock: newStock }).eq("id", productId).then(({ error }) => {
            if (error) console.error("Update stock error:", error);
          });

          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  }, []);

  return (
    <AdminContext.Provider
      value={{
        products, addProduct, updateProduct, deleteProduct,
        orders, addOrder, updateOrderStatus, getOrderById,
        customers, addCustomer, deleteCustomer, getCustomerById,
        inventoryLogs, updateStock,
        loading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
}
