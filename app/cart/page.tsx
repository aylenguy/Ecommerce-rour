"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Plus,
  Minus,
  X,
  ShoppingBag,
  Truck,
  ArrowRight,
  Tag,
  ChevronRight,
  Lock,
} from "lucide-react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../components/CartContext";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const FREE_SHIPPING_THRESHOLD = 50000;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCart();
  const router = useRouter();

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);

  const discount = couponApplied ? Math.round(total * 0.1) : 0;
  const shippingFree = total >= FREE_SHIPPING_THRESHOLD;
  const shipping = shippingFree ? 0 : 2500;
  const finalTotal = total - discount + shipping;
  const progressToFreeShipping = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - total;
  const count = items.reduce((acc, i) => acc + i.qty, 0);

  function applyCoupon() {
    if (coupon.toUpperCase() === "URBAN10") {
      setCouponApplied(true);
      setCouponError(false);
    } else {
      setCouponError(true);
      setCouponApplied(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5f5f5]">

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div className="bg-[#111] px-5 pb-10 pt-40 md:px-10 md:pb-16 md:pt-40">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="h-px w-6 bg-white/40" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50">
                  Tu compra
                </span>
              </div>
              <h1 className="text-3xl font-black uppercase text-white md:text-5xl">Carrito</h1>
              {count > 0 && (
                <p className="mt-2 text-sm text-white/40">
                  {count} producto{count !== 1 ? "s" : ""} en tu carrito
                </p>
              )}
            </motion.div>
          </div>
        </div>

        {/* ── CONTENIDO ──────────────────────────────────────────────────── */}
        <section className="px-5 py-8 md:px-10 md:py-14">
          <div className="mx-auto max-w-7xl">

            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-black/5">
                  <ShoppingBag size={32} className="text-black/20" />
                </div>
                <h2 className="text-xl font-black uppercase text-black">Tu carrito está vacío</h2>
                <p className="mt-2 text-sm text-black/40">
                  Explorá nuestra colección y agregá productos.
                </p>
                <Link
                  href="/productos"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-black/80"
                >
                  Ver productos <ArrowRight size={14} />
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">

                {/* ── LISTA DE ITEMS ── */}
                <div className="space-y-3">

                  {/* Barra envío gratis */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl bg-white p-4"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Truck size={14} className="shrink-0 text-black/50" />
                      {shippingFree ? (
                        <p className="text-[12px] font-bold text-black">
                          🎉 ¡Conseguiste{" "}
                          <span className="text-[#1a9900]">envío gratis</span>!
                        </p>
                      ) : (
                        <p className="text-[12px] font-bold text-black">
                          Agregá{" "}
                          <span className="text-[#1a9900]">{formatPrice(remaining)}</span>{" "}
                          más para envío gratis
                        </p>
                      )}
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/8">
                      <motion.div
                        className="h-full rounded-full bg-[#c8f000]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToFreeShipping}%` }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </motion.div>

                  {/* Items */}
                  <AnimatePresence>
                    {items.map((item, i) => (
                      <motion.div
                        key={`${item.id}-${item.size}-${item.color}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                        transition={{ delay: i * 0.06 + 0.15 }}
                        className="flex gap-3.5 rounded-2xl bg-white p-4"
                      >
                        {/* Imagen */}
                        <Link href={`/productos/${item.id}`} className="shrink-0">
                          <div className="relative h-24 w-20 overflow-hidden rounded-xl bg-[#e8e8e8]">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              unoptimized
                              className="object-cover transition duration-300 hover:scale-105"
                            />
                          </div>
                        </Link>

                        {/* Info */}
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                                {item.category}
                              </p>
                              <Link href={`/productos/${item.id}`}>
                                <h3 className="mt-0.5 truncate text-sm font-bold text-black hover:underline">
                                  {item.name}
                                </h3>
                              </Link>
                              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-black/40">
                                <span className="rounded-full bg-black/5 px-2 py-0.5 font-bold uppercase tracking-wide">
                                  {item.size}
                                </span>
                                <span className="rounded-full bg-black/5 px-2 py-0.5 font-bold uppercase tracking-wide">
                                  {item.color}
                                </span>
                              </div>
                            </div>
                            {/* Eliminar */}
                            <button
                              onClick={() => removeItem(item.id, item.size, item.color)}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-black/25 transition hover:bg-red-50 hover:text-red-500"
                            >
                              <X size={13} />
                            </button>
                          </div>

                          <div className="mt-2.5 flex items-center justify-between">
                            {/* Cantidad */}
                            <div className="flex items-center rounded-full border border-black/10">
                              <button
                                onClick={() => updateQty(item.id, item.size, item.color, -1)}
                                className="flex h-7 w-7 items-center justify-center text-black/40 transition hover:text-black"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.id, item.size, item.color, 1)}
                                className="flex h-7 w-7 items-center justify-center text-black/40 transition hover:text-black"
                              >
                                <Plus size={11} />
                              </button>
                            </div>

                            {/* Precio */}
                            <div className="text-right">
                              <span className="text-sm font-black text-black">
                                {formatPrice(item.price * item.qty)}
                              </span>
                              {item.originalPrice && (
                                <p className="text-[10px] text-black/35 line-through">
                                  {formatPrice(item.originalPrice * item.qty)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Seguir comprando */}
                  <div className="pt-1">
                    <Link
                      href="/productos"
                      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-black/40 transition hover:text-black"
                    >
                      ← Seguir comprando
                    </Link>
                  </div>
                </div>

                {/* ── RESUMEN ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4 lg:self-start"
                >
                  {/* Cupón */}
                  <div className="rounded-2xl bg-white p-5">
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black/50">
                      Código de descuento
                    </p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag
                          size={13}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30"
                        />
                        <input
                          type="text"
                          value={coupon}
                          onChange={(e) => {
                            setCoupon(e.target.value);
                            setCouponError(false);
                          }}
                          placeholder="URBAN10"
                          className="h-10 w-full rounded-full border border-black/15 bg-transparent pl-9 pr-4 text-[12px] font-bold uppercase tracking-[0.1em] text-black outline-none placeholder:text-black/25 focus:border-black"
                        />
                      </div>
                      <button
                        onClick={applyCoupon}
                        disabled={couponApplied}
                        className={`shrink-0 rounded-full px-4 text-[11px] font-bold uppercase tracking-[0.15em] transition ${
                          couponApplied
                            ? "bg-[#c8f000] text-black"
                            : "bg-black text-white hover:bg-black/80"
                        }`}
                      >
                        {couponApplied ? "✓" : "Aplicar"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="mt-2 text-[10px] font-bold text-red-500">
                        Código inválido. Probá con URBAN10.
                      </p>
                    )}
                    {couponApplied && (
                      <p className="mt-2 text-[10px] font-bold text-[#1a9900]">
                        ¡10% de descuento aplicado!
                      </p>
                    )}
                  </div>

                  {/* Totales */}
                  <div className="rounded-2xl bg-white p-5">
                    <h2 className="mb-4 text-sm font-black uppercase tracking-[0.15em] text-black">
                      Resumen
                    </h2>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-black/60">
                        <span>Subtotal</span>
                        <span className="font-bold">{formatPrice(total)}</span>
                      </div>

                      <AnimatePresence>
                        {couponApplied && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex justify-between text-sm text-[#1a9900]"
                          >
                            <span>Descuento (10%)</span>
                            <span className="font-bold">-{formatPrice(discount)}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-between text-sm text-black/60">
                        <span>Envío</span>
                        <span className={`font-bold ${shippingFree ? "text-[#1a9900]" : ""}`}>
                          {shippingFree ? "Gratis" : formatPrice(shipping)}
                        </span>
                      </div>
                    </div>

                    <div className="my-4 h-px bg-black/8" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black uppercase tracking-[0.1em] text-black">
                        Total
                      </span>
                      <motion.span
                        key={finalTotal}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-black text-black"
                      >
                        {formatPrice(finalTotal)}
                      </motion.span>
                    </div>

                    <button
                      onClick={() => router.push("/checkout")}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#1a1a1a] active:scale-[0.98]"
                    >
                      Finalizar compra <ChevronRight size={14} />
                    </button>

                    <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-black/35">
                      <Lock size={10} />
                      <span>Pago 100% seguro</span>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2 opacity-40">
                      {["VISA", "MC", "AMEX", "MP"].map((brand) => (
                        <div
                          key={brand}
                          className="rounded border border-black/15 px-2 py-1 text-[9px] font-black tracking-wider text-black"
                        >
                          {brand}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
