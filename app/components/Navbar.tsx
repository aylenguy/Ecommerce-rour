"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  UserCircle,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartContext";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Contacto", href: "/contacto" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { items, count, total, removeItem, updateQty } = useCart();

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50">

        {/* Barra superior */}
        <div className="bg-[#1a1a1a] py-2 text-center text-[10px] uppercase tracking-[0.25em] text-white/60 sm:text-[11px]">
          Envío gratis en compras mayores a $50.000 &nbsp;·&nbsp; Nueva colección disponible
        </div>

        {/* Navbar principal */}
        <nav className="border-b border-black/10 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">

            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-black uppercase tracking-[0.12em] text-black"
            >
              Rour
            </Link>

            {/* Links desktop */}
            <ul className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="relative text-[13px] font-medium uppercase tracking-[0.15em] text-black/70 transition-colors hover:text-black
                      after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Iconos */}
            <div className="flex items-center gap-4">

              {/* Ícono admin — solo desktop */}
              <Link
                href="/admin"
                className="hidden text-black/70 transition hover:text-black md:block"
                title="Panel admin"
              >
                <UserCircle size={20} strokeWidth={1.8} />
              </Link>

              {/* Botón carrito */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative text-black/70 transition hover:text-black"
                aria-label="Abrir carrito"
              >
                <ShoppingCart size={20} strokeWidth={1.8} />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Hamburger mobile */}
              <button
                className="text-black md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menú"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Menú mobile */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-t border-black/10 bg-white md:hidden"
              >
                <ul className="flex flex-col gap-1 px-5 py-4">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block py-2.5 text-sm font-medium uppercase tracking-[0.15em] text-black/70 transition hover:text-black"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2.5 text-sm font-medium uppercase tracking-[0.15em] text-black/70 transition hover:text-black"
                    >
                      Admin
                    </Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* ── CART DRAWER ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 right-0 top-0 z-[70] flex w-full max-w-[420px] flex-col bg-white shadow-2xl"
            >
              {/* Header drawer */}
              <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-black">
                    Carrito
                  </h2>
                  {count > 0 && (
                    <p className="text-[10px] text-black/40">
                      {count} producto{count !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black/50 transition hover:bg-black hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <ShoppingCart size={36} className="mb-4 text-black/15" strokeWidth={1.5} />
                    <p className="text-sm font-bold uppercase tracking-[0.1em] text-black/30">
                      Tu carrito está vacío
                    </p>
                    <Link
                      href="/productos"
                      onClick={() => setDrawerOpen(false)}
                      className="mt-6 rounded-full bg-black px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-black/80"
                    >
                      Ver productos
                    </Link>
                  </div>
                ) : (
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.size}-${item.color}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                        className="mb-3 flex gap-3 rounded-2xl border border-black/8 bg-[#fafafa] p-3.5"
                      >
                        {/* Imagen */}
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#e8e8e8]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex flex-1 flex-col justify-between min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase tracking-[0.18em] text-black/35">
                                {item.category}
                              </p>
                              <p className="mt-0.5 truncate text-[13px] font-bold leading-tight text-black">
                                {item.name}
                              </p>
                              <div className="mt-1 flex gap-1.5">
                                <span className="rounded-full bg-black/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black/50">
                                  {item.size}
                                </span>
                                <span className="rounded-full bg-black/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black/50">
                                  {item.color}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item.id, item.size, item.color)}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-black/20 transition hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            {/* Cantidad */}
                            <div className="flex items-center rounded-full border border-black/12 bg-white">
                              <button
                                onClick={() => updateQty(item.id, item.size, item.color, -1)}
                                className="flex h-7 w-7 items-center justify-center text-black/40 transition hover:text-black"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="w-6 text-center text-[12px] font-bold">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item.id, item.size, item.color, 1)}
                                className="flex h-7 w-7 items-center justify-center text-black/40 transition hover:text-black"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                            <span className="text-[13px] font-black text-black">
                              {formatPrice(item.price * item.qty)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer drawer */}
              {items.length > 0 && (
                <div className="border-t border-black/10 px-5 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-black/50">
                      Total
                    </span>
                    <span className="text-xl font-black text-black">{formatPrice(total)}</span>
                  </div>
                  <Link
                    href="/cart"
                    onClick={() => setDrawerOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#1a1a1a] active:scale-[0.98]"
                  >
                    Finalizar compra <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/productos"
                    onClick={() => setDrawerOpen(false)}
                    className="mt-3 block w-full text-center text-[11px] font-bold uppercase tracking-[0.15em] text-black/35 transition hover:text-black"
                  >
                    Seguir comprando
                  </Link>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
