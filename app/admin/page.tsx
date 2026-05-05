"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Eye,
  AlertTriangle,
  ShoppingBag,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { API_URL } from "../../lib/api";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  tag: string | null;
  category: string;
  isActive: boolean;
}

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  city: string;
  province: string;
  paymentMethod: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-[#c8f000] text-black",
  cancelled: "bg-red-50 text-red-500",
};

const STATUS_ORDER = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"products" | "orders">("products");

  // — Productos —
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  // — Órdenes —
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [confirmOrderId, setConfirmOrderId] = useState<number | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => {
    if (tab === "orders" && orders.length === 0) fetchOrders();
  }, [tab]);

  async function fetchProducts() {
    try {
      setLoadingProducts(true);
      const res = await fetch(`${API_URL}/api/Products`);
      const data = await res.json();
      setProducts(data);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function fetchOrders() {
    try {
      setLoadingOrders(true);
      const res = await fetch(`${API_URL}/api/Orders`);
      const data = await res.json();
      setOrders(data);
    } finally {
      setLoadingOrders(false);
    }
  }

  async function deleteProduct(id: number) {
    setDeletingId(id);
    try {
      await fetch(`${API_URL}/api/Products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  async function updateStatus(orderId: number, status: string) {
    setUpdatingStatus(orderId);
    try {
      await fetch(`${API_URL}/api/Orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(status),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } finally {
      setUpdatingStatus(null);
    }
  }

  async function deleteOrder(id: number) {
    setDeletingOrderId(id);
    try {
      await fetch(`${API_URL}/api/Orders/${id}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } finally {
      setDeletingOrderId(null);
      setConfirmOrderId(null);
    }
  }

  function handleLogout() {
    document.cookie = "admin_token=; Max-Age=0; path=/";
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">

      {/* ── HEADER ── */}
      <div className="bg-[#111] px-5 py-6 md:px-10 md:py-8">
        <div className="mx-auto max-w-7xl">

          {/* Título + acciones */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
                Panel de administración
              </p>
              <h1 className="mt-1 text-xl font-black uppercase text-white md:text-3xl">
                {tab === "products" ? "Productos" : "Órdenes"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {tab === "products" && (
                <Link
                  href="/admin/productos/nuevo"
                  className="flex items-center gap-1.5 rounded-full bg-[#c8f000] px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#b8e000]"
                >
                  <Plus size={13} />
                  <span className="hidden sm:inline">Nuevo producto</span>
                  <span className="sm:hidden">Nuevo</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white/60 transition hover:border-white/40 hover:text-white"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex gap-1">
            {(
              [
                ["products", "Productos", Package],
                ["orders", "Órdenes", ShoppingBag],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition md:px-5 ${
                  tab === key
                    ? "bg-white text-black"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <Icon size={13} /> {label}
                {key === "orders" && orders.length > 0 && (
                  <span className="ml-1 rounded-full bg-[#c8f000] px-1.5 py-0.5 text-[9px] font-black text-black">
                    {orders.filter((o) => o.status === "pending").length || ""}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-10 md:py-8">

        {/* ═══ TAB PRODUCTOS ═══ */}
        {tab === "products" && (
          <>
            {loadingProducts ? (
              <div className="grid gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 animate-pulse rounded-2xl bg-black/8" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black/5">
                  <Package size={24} className="text-black/20" />
                </div>
                <p className="text-lg font-black uppercase text-black/20">Sin productos</p>
                <Link
                  href="/admin/productos/nuevo"
                  className="mt-6 flex items-center gap-2 rounded-full bg-black px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white"
                >
                  <Plus size={13} /> Crear primer producto
                </Link>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Total", value: products.length },
                    { label: "Activos", value: products.filter((p) => p.isActive).length },
                    { label: "Con descuento", value: products.filter((p) => p.originalPrice).length },
                    { label: "Categorías", value: new Set(products.map((p) => p.category)).size },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white px-4 py-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-2xl font-black text-black">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Lista */}
                <div className="overflow-hidden rounded-2xl bg-white">
                  <div className="border-b border-black/8 px-5 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">
                      {products.length} producto{products.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <AnimatePresence>
                    {products.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`flex items-center gap-3 border-b border-black/5 px-4 py-3.5 last:border-0 md:px-6 md:py-4 ${
                          !product.isActive ? "opacity-50" : ""
                        }`}
                      >
                        {/* Imagen */}
                        <div className="h-11 w-9 shrink-0 overflow-hidden rounded-lg bg-[#e8e8e8]">
                          {product.images?.[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="truncate text-sm font-bold text-black">{product.name}</p>
                            {!product.isActive && (
                              <span className="shrink-0 rounded-full bg-black/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black/40">
                                Inactivo
                              </span>
                            )}
                            {product.tag && (
                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                                  product.tag === "Sale!"
                                    ? "bg-[#c8f000] text-black"
                                    : "bg-black text-white"
                                }`}
                              >
                                {product.tag}
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2">
                            <p className="text-[10px] text-black/40">{product.category}</p>
                            <span className="text-black/20">·</span>
                            <p className="text-[10px] font-bold text-black/60">
                              {formatPrice(product.price)}
                            </p>
                            {product.originalPrice && (
                              <p className="text-[10px] text-black/30 line-through">
                                {formatPrice(product.originalPrice)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-0.5">
                          <Link
                            href={`/productos/${product.id}`}
                            target="_blank"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-black/30 transition hover:bg-black/5 hover:text-black"
                          >
                            <Eye size={14} />
                          </Link>
                          <Link
                            href={`/admin/productos/${product.id}/editar`}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-black/30 transition hover:bg-black/5 hover:text-black"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => setConfirmId(product.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-black/30 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </>
        )}

        {/* ═══ TAB ÓRDENES ═══ */}
        {tab === "orders" && (
          <>
            {loadingOrders ? (
              <div className="grid gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-black/8" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black/5">
                  <ShoppingBag size={24} className="text-black/20" />
                </div>
                <p className="text-lg font-black uppercase text-black/20">Sin órdenes todavía</p>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Total", value: orders.length },
                    { label: "Pendientes", value: orders.filter((o) => o.status === "pending").length },
                    { label: "Entregadas", value: orders.filter((o) => o.status === "delivered").length },
                    {
                      label: "Recaudado",
                      value: formatPrice(
                        orders
                          .filter((o) => o.status !== "cancelled")
                          .reduce((acc, o) => acc + o.total, 0)
                      ),
                    },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white px-4 py-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-xl font-black text-black md:text-2xl">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Lista órdenes */}
                <div className="overflow-hidden rounded-2xl bg-white">
                  <div className="border-b border-black/8 px-5 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">
                      {orders.length} orden{orders.length !== 1 ? "es" : ""}
                    </p>
                  </div>

                  {orders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-black/5 last:border-0"
                    >
                      <div className="flex items-start gap-3 px-4 py-4 md:items-center md:px-6">

                        {/* Info principal */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-black text-black">#{order.id}</p>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wide ${
                                STATUS_COLORS[order.status] ?? "bg-black/8 text-black/50"
                              }`}
                            >
                              {STATUS_LABELS[order.status] ?? order.status}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[12px] font-bold text-black/70">
                            {order.customerName}
                          </p>
                          <p className="text-[10px] text-black/35">
                            {order.city}, {order.province}
                          </p>
                          {/* Precio y fecha — visible en mobile bajo el nombre */}
                          <div className="mt-1 flex items-center gap-2 md:hidden">
                            <p className="text-[12px] font-black text-black">
                              {formatPrice(order.total)}
                            </p>
                            <span className="text-black/20">·</span>
                            <p className="text-[10px] text-black/35">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>

                        {/* Precio + fecha — solo desktop */}
                        <div className="hidden text-right md:block">
                          <p className="text-sm font-black text-black">{formatPrice(order.total)}</p>
                          <p className="text-[10px] text-black/35">{formatDate(order.createdAt)}</p>
                        </div>

                        {/* Acciones */}
                        <div className="flex shrink-0 items-center gap-1">
                          {/* Select status */}
                          <div className="relative">
                            <select
                              value={order.status}
                              disabled={updatingStatus === order.id}
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                              className="appearance-none cursor-pointer rounded-full border border-black/15 bg-white py-2 pl-3 pr-6 text-[10px] font-bold uppercase tracking-wide text-black/60 transition hover:border-black focus:outline-none disabled:opacity-40"
                            >
                              {STATUS_ORDER.map((s) => (
                                <option key={s} value={s}>
                                  {STATUS_LABELS[s]}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={10}
                              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-black/40"
                            />
                          </div>

                          <button
                            onClick={() => setConfirmOrderId(order.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-black/30 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>

                          <button
                            onClick={() =>
                              setExpandedOrder(expandedOrder === order.id ? null : order.id)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full text-black/30 transition hover:bg-black/5 hover:text-black"
                          >
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-300 ${
                                expandedOrder === order.id ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Detalle expandido */}
                      <AnimatePresence>
                        {expandedOrder === order.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-black/5 bg-[#f9f9f9] px-5 py-4 md:px-6">
                              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                                Items · Pago: {order.paymentMethod.toUpperCase()}
                              </p>
                              <div className="space-y-2.5">
                                {order.items.map((item, j) => (
                                  <div
                                    key={j}
                                    className="flex items-start justify-between gap-4"
                                  >
                                    <div className="min-w-0">
                                      <p className="truncate text-[12px] font-bold text-black">
                                        {item.productName}
                                      </p>
                                      <p className="text-[10px] text-black/40">
                                        {item.size} · {item.color} · x{item.quantity}
                                      </p>
                                    </div>
                                    <p className="shrink-0 text-[12px] font-black text-black">
                                      {formatPrice(item.price * item.quantity)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ── MODAL: Eliminar producto ── */}
      <AnimatePresence>
        {confirmId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm"
            onClick={() => setConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-7 text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <h3 className="text-lg font-black uppercase text-black">¿Eliminar producto?</h3>
              <p className="mt-2 text-sm text-black/50">
                El producto se desactivará y no aparecerá en la tienda.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setConfirmId(null)}
                  className="flex-1 rounded-full border border-black/15 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-black/60 transition hover:border-black hover:text-black"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => deleteProduct(confirmId)}
                  disabled={deletingId === confirmId}
                  className="flex-1 rounded-full bg-red-500 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-red-600 disabled:opacity-50"
                >
                  {deletingId === confirmId ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL: Eliminar orden ── */}
      <AnimatePresence>
        {confirmOrderId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm"
            onClick={() => setConfirmOrderId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-7 text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <h3 className="text-lg font-black uppercase text-black">¿Eliminar orden?</h3>
              <p className="mt-2 text-sm text-black/50">
                Se eliminará la orden y todos sus items permanentemente.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setConfirmOrderId(null)}
                  className="flex-1 rounded-full border border-black/15 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-black/60 transition hover:border-black hover:text-black"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => deleteOrder(confirmOrderId)}
                  disabled={deletingOrderId === confirmOrderId}
                  className="flex-1 rounded-full bg-red-500 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-red-600 disabled:opacity-50"
                >
                  {deletingOrderId === confirmOrderId ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
