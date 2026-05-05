"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Truck, RefreshCw, Lock } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useCart } from "./components/CartContext";
import { API_URL } from "../lib/api";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  tag: string | null;
  category: string;
  description: string;
  sizes: string[];
  colors: string[];
  details: string[];
  isActive: boolean;
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const categories = [
  {
    name: "Remeras",
    subtitle: "Básicas + oversize",
    href: "/productos?categoria=remeras",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  },
  {
    name: "Buzos",
    subtitle: "Hoodies + oversize",
    href: "/productos?categoria=buzos",
    image:
      "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800",
  },
  {
    name: "Joggins",
    subtitle: "Cargo + relaxed",
    href: "/productos?categoria=joggins",
    image:
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800",
  },
  {
    name: "Accesorios",
    subtitle: "Gorras + complementos",
    href: "/productos?categoria=accesorios",
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800",
  },
];

// ─── VARIANTS ────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  return `$${price.toLocaleString("es-AR")}`;
}

function tagColor(tag: string | null) {
  if (!tag) return "";
  if (tag === "Sale!" || tag === "Oferta") return "bg-[#c8f000] text-black";
  return "bg-black text-white";
}

// ─── SKELETON ────────────────────────────────────────────────────────────────

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          {/* FIX: altura reducida en mobile */}
          <div className="h-[190px] w-full rounded-xl bg-black/8 sm:h-[260px] md:h-[320px]" />
          <div className="mt-3 space-y-2 px-1">
            <div className="h-2 w-16 rounded-full bg-black/8" />
            <div className="h-3 w-3/4 rounded-full bg-black/8" />
            <div className="h-3 w-20 rounded-full bg-black/8" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Home() {
  const { addItem } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error();
        const data: Product[] = await res.json();
        setFeaturedProducts(data.filter((p) => p.isActive).slice(0, 4));
      } catch {
        // Si falla, quedará vacío — no rompe la página
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchFeatured();
  }, []);

  function handleAddToCart(e: React.MouseEvent, product: Product) {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      category: product.category,
      size: product.sizes?.[0] ?? "M",
      color: product.colors?.[0] ?? "Negro",
      qty: 1,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <>
      <Navbar />

      <main className="bg-white">

                {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen overflow-hidden bg-[#111]">

          {/* Imagen de fondo */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920&auto=format&fit=crop')",
            }}
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Contenido — centrado verticalmente en mobile, abajo en desktop */}
          <div className="relative z-10 flex min-h-screen items-center md:items-end md:pb-14">
            <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
              <div className="max-w-2xl">

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-4 flex items-center gap-3 md:mb-6"
                >
                  <div className="h-px w-8 bg-white/60" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/70">
                    Streetwear Collection
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-5 text-4xl font-black uppercase leading-[0.92] text-white sm:text-5xl md:mb-6 md:text-7xl lg:text-8xl"
                >
                  Nueva
                  <br />
                  colección
                  <br />
                  <span className="text-white/40">urbana</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="mb-7 max-w-sm text-sm leading-7 text-white/65 md:mb-10"
                >
                  Estilo, comodidad y actitud en cada prenda. Diseñada para los
                  que se mueven diferente.
                </motion.p>

                {/* Botones apilados en mobile, en fila en desktop */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.55 }}
                  className="flex flex-col gap-3 sm:flex-row sm:gap-4"
                >
                  <Link
                    href="/productos"
                    className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.12em] text-black transition duration-300 hover:scale-[1.02] hover:bg-white/90 md:px-8 md:py-3.5"
                  >
                    Ver colección
                  </Link>
                  <Link
                    href="/productos"
                    className="rounded-full border border-white/40 px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.12em] text-white transition duration-300 hover:border-white hover:bg-white/10 md:px-8 md:py-3.5"
                  >
                    Comprar ahora
                  </Link>
                </motion.div>

              </div>
            </div>
          </div>

          {/* Scroll indicator — solo desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-8 right-10 hidden flex-col items-center gap-2 md:flex"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Scroll
            </span>
            <div className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>

          {/* Badge 30% off — abajo a la derecha, no tapa botones porque el contenido está centrado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute bottom-8 right-6 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-[#c8f000] text-black md:bottom-auto md:right-16 md:top-1/2 md:h-28 md:w-28 md:-translate-y-1/2 lg:h-32 lg:w-32"
          >
            <span className="text-xl font-black leading-none md:text-3xl lg:text-4xl">30</span>
            <span className="text-[8px] font-bold uppercase tracking-wider md:text-[9px]">% off</span>
          </motion.div>

        </section>


        {/* ── CATEGORÍAS ───────────────────────────────────────────────────── */}
        <section className="bg-white px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl">

            <motion.div
              className="mb-8 flex items-end justify-between md:mb-10"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.35em] text-black/40">
                  Explorá
                </p>
                <h2 className="text-2xl font-black uppercase tracking-tight text-black md:text-4xl">
                  Categorías
                </h2>
                <p className="mt-1 text-sm text-black/50 md:mt-2">
                  Elegí tu estilo y entrá directo a la sección.
                </p>
              </div>
              <Link
                href="/productos"
                className="hidden items-center gap-2 text-[12px] font-bold uppercase tracking-[0.15em] text-black/50 transition hover:text-black md:flex"
              >
                Ver todo <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {categories.map((cat) => (
                <motion.div key={cat.name} variants={fadeUp} className="group">
                  <Link href={cat.href} className="block">
                    <div className="relative overflow-hidden rounded-2xl bg-[#111]">
                      {/* FIX: altura reducida en mobile */}
                      <div className="relative h-[180px] w-full overflow-hidden sm:h-[260px] md:h-[340px]">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          unoptimized
                          className="object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      </div>
                      {/* FIX: padding más chico en mobile */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/60 sm:text-[10px] sm:tracking-[0.25em]">
                          {cat.subtitle}
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          {/* FIX: título más chico en mobile */}
                          <h3 className="text-lg font-black uppercase text-white sm:text-3xl">
                            {cat.name}
                          </h3>
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 text-white transition duration-300 group-hover:bg-white group-hover:text-black sm:h-8 sm:w-8">
                            <ArrowRight size={12} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-6 flex justify-center md:hidden">
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 rounded-full border border-black/20 px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.15em] text-black transition hover:bg-black hover:text-white"
              >
                Ver todo <ArrowRight size={13} />
              </Link>
            </div>

          </div>
        </section>

        {/* ── PRODUCTOS DESTACADOS ─────────────────────────────────────────── */}
        <section className="bg-[#f5f5f5] px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl">

            <motion.div
              className="mb-8 flex items-end justify-between md:mb-10"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.35em] text-black/40">
                  Lo más vendido
                </p>
                <h2 className="text-2xl font-black uppercase tracking-tight text-black md:text-4xl">
                  Destacados
                </h2>
              </div>
              <Link
                href="/productos"
                className="hidden items-center gap-2 text-[12px] font-bold uppercase tracking-[0.15em] text-black/50 transition hover:text-black md:flex"
              >
                Ver todo <ArrowRight size={14} />
              </Link>
            </motion.div>

            {loadingProducts ? (
              <FeaturedSkeleton />
            ) : (
              <motion.div
                className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {featuredProducts.map((product) => (
                  <motion.article key={product.id} variants={fadeUp} className="group">
                    <Link href={`/productos/${product.id}`} className="block">

                      {/* Imagen */}
                      <div className="relative overflow-hidden rounded-xl bg-[#e8e8e8]">
                        {/* FIX: altura reducida en mobile */}
                        <div className="relative h-[190px] w-full overflow-hidden sm:h-[260px] md:h-[320px]">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Tag */}
                        {product.tag && (
                          <div className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider sm:left-3 sm:top-3 sm:px-3 sm:text-[10px] ${tagColor(product.tag)}`}>
                            {product.tag}
                          </div>
                        )}

                        {/* FIX: botón agregar siempre visible en mobile (hover no funciona en touch) */}
                        <div className="absolute bottom-0 left-0 right-0 translate-y-full transition duration-300 group-hover:translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0">
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className={`flex w-full items-center justify-center gap-2 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition sm:py-3 sm:text-[12px] ${
                              addedId === product.id ? "bg-[#1a9900]" : "bg-black hover:bg-[#1a1a1a]"
                            }`}
                          >
                            <ShoppingCart size={13} strokeWidth={2} />
                            {addedId === product.id ? "¡Agregado!" : "Agregar"}
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="mt-2 px-0.5 md:mt-3 md:px-1">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 sm:text-[10px]">
                          {product.category}
                        </p>
                        <h3 className="mt-0.5 text-xs font-bold text-black sm:mt-1 sm:text-sm">
                          {product.name}
                        </h3>
                        <div className="mt-0.5 flex items-center gap-1.5 sm:mt-1 sm:gap-2">
                          <span className="text-xs font-bold text-black sm:text-sm">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-black/40 line-through sm:text-xs">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            )}

            {/* Ver todo mobile */}
            <div className="mt-6 flex justify-center md:hidden">
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 rounded-full border border-black/20 px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.15em] text-black transition hover:bg-black hover:text-white"
              >
                Ver todo <ArrowRight size={13} />
              </Link>
            </div>

          </div>
        </section>

        {/* ── BANNER SALE ──────────────────────────────────────────────────── */}
        <section className="bg-white px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-[#111]"
            >
              {/* Imagen de fondo */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

              {/* Contenido */}
              {/* FIX: padding reducido en mobile, badge más chico */}
              <div className="relative z-10 flex flex-col justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:gap-8 md:px-14 md:py-16">
                <div className="max-w-xl">
                  <div className="mb-3 flex items-center gap-3 md:mb-4">
                    <div className="h-px w-6 bg-white/50" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">
                      Mid Season Sale
                    </span>
                  </div>
                  {/* FIX: título más chico en mobile */}
                  <h2 className="mb-3 text-3xl font-black uppercase leading-tight text-white md:mb-4 md:text-5xl">
                    Elegí tus favoritos
                    <br />
                    <span className="text-white/50">de temporada</span>
                  </h2>
                  <p className="mb-6 max-w-sm text-sm leading-7 text-white/60 md:mb-8">
                    Descubrí prendas y accesorios seleccionados con hasta{" "}
                    <strong className="text-white">30% OFF</strong>. Una curaduría
                    pensada para renovar tu look con estilo.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/productos"
                      className="rounded-full bg-white px-6 py-2.5 text-sm font-bold uppercase tracking-[0.1em] text-black transition hover:scale-[1.02] hover:bg-white/90 md:px-7 md:py-3"
                    >
                      Comprar ofertas
                    </Link>
                    <Link
                      href="/productos"
                      className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:border-white hover:bg-white/10 md:px-7 md:py-3"
                    >
                      Ver colección
                    </Link>
                  </div>
                </div>

                {/* FIX: badge más chico en mobile */}
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center self-start rounded-full bg-white text-black md:h-36 md:w-36 md:self-auto">
                  <span className="text-3xl font-black leading-none md:text-5xl">30</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest md:text-[11px]">% off</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── ¿POR QUÉ ELEGIRNOS? ─────────────────────────────────────────── */}
        <section className="bg-[#111] px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl">

            <motion.div
              className="mb-10 text-center md:mb-14"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-black uppercase tracking-tight text-white md:text-4xl">
                ¿Por qué elegirnos?
              </h2>
              <p className="mt-2 text-sm text-white/40 md:mt-3">
                Diseño, comodidad y calidad pensados para tu día a día.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                {
                  title: "Diseños únicos",
                  desc: "Prendas seleccionadas con estilo moderno y urbano.",
                },
                {
                  title: "Calidad premium",
                  desc: "Materiales cómodos, duraderos y pensados para uso diario.",
                },
                {
                  title: "Envíos a todo el país",
                  desc: "Recibí tu pedido rápido y con seguimiento.",
                },
                {
                  title: "Clientes satisfechos",
                  desc: "Cada vez más personas eligen nuestra tienda.",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-white/20 hover:bg-white/10 md:p-6"
                >
                  <h3 className="mb-1 text-xs font-bold text-white sm:mb-2 sm:text-sm">{item.title}</h3>
                  <p className="text-[11px] leading-5 text-white/40 sm:text-xs sm:leading-6">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────────────── */}
        <section className="bg-[#f5f5f5] px-6 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-5"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: <Truck size={22} strokeWidth={1.5} />,
                  title: "Envíos rápidos",
                  desc: "Entregas en todo el país en pocos días.",
                },
                {
                  icon: <RefreshCw size={22} strokeWidth={1.5} />,
                  title: "Cambios fáciles",
                  desc: "Tenés 30 días para cambiar tu producto.",
                },
                {
                  icon: <Lock size={22} strokeWidth={1.5} />,
                  title: "Compra segura",
                  desc: "Pagos protegidos y plataforma segura.",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-col sm:items-center sm:gap-0 sm:p-8 sm:text-center"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-black sm:mb-4 sm:h-12 sm:w-12">
                    {item.icon}
                  </div>
                  <div className="sm:text-center">
                    <h3 className="mb-0.5 text-sm font-bold text-black sm:mb-1">{item.title}</h3>
                    <p className="text-xs leading-5 text-black/50 sm:leading-6">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
