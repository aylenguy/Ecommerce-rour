"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ShoppingCart, SlidersHorizontal, ChevronDown, ArrowRight, Search, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../components/CartContext";
import { API_URL } from "../../lib/api";
import { useSearchParams, useRouter } from "next/navigation";

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

const categories = ["Todos", "Remeras", "Buzos", "Joggins", "Accesorios"];

const sortOptions = [
  { label: "Relevancia", value: "default" },
  { label: "Menor precio", value: "price-asc" },
  { label: "Mayor precio", value: "price-desc" },
  { label: "Novedades", value: "new" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

function formatPrice(price: number) {
  return `$${price.toLocaleString("es-AR")}`;
}

function tagColor(tag: string | null) {
  if (!tag) return "";
  if (tag === "Sale!" || tag === "Oferta") return "bg-[#c8f000] text-black";
  if (tag === "Nuevo") return "bg-black text-white";
  return "bg-white text-black";
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
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

function ProductosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState<number | null>(null);

  const { addItem } = useCart();

  useEffect(() => {
    const cat = searchParams.get("categoria");
    if (cat) {
      const match = categories.find(
        (c) => c.toLowerCase() === cat.toLowerCase()
      );
      if (match) setActiveCategory(match);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error();
        const data: Product[] = await res.json();
        setAllProducts(data.filter((p) => p.isActive));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  function handleCategoryClick(cat: string) {
    setActiveCategory(cat);
    router.replace("/productos", { scroll: false });
  }

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

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (activeCategory !== "Todos") list = list.filter((p) => p.category === activeCategory);
    if (onlyOffers) list = list.filter((p) => p.tag === "Sale!" || p.tag === "Oferta");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "new")
      list = list
        .filter((p) => p.tag === "Nuevo")
        .concat(list.filter((p) => p.tag !== "Nuevo"));
    return list;
  }, [allProducts, activeCategory, sortBy, onlyOffers, search]);

  return (
    <main className="min-h-screen bg-white">

      {/* ── HEADER ── */}
      <section className="bg-[#111] px-6 pb-12 pt-40 md:px-10 md:pb-20 md:pt-36">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px w-6 bg-white/40" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50">Tienda</span>
            </div>
            <h1 className="text-4xl font-black uppercase leading-none text-white md:text-6xl">
              {activeCategory === "Todos" ? "Productos" : activeCategory}
            </h1>
            <p className="mt-3 text-sm text-white/40 md:mt-4">
              {loading
                ? "Cargando..."
                : `${filtered.length} producto${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FILTROS + GRID ── */}
      <section className="px-6 py-8 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl">

          {/* Buscador */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative mb-4 md:mb-5"
          >
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="h-11 w-full rounded-full border border-black/12 bg-[#f9f9f9] pl-10 pr-10 text-sm font-medium text-black outline-none placeholder:text-black/30 focus:border-black focus:bg-white transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition"
              >
                <X size={14} />
              </button>
            )}
          </motion.div>

          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-7 flex flex-col gap-3 md:mb-8 md:flex-row md:items-center md:justify-between md:gap-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] transition duration-200 md:px-4 ${
                    activeCategory === cat
                      ? "bg-black text-white"
                      : "border border-black/15 text-black/60 hover:border-black/40 hover:text-black"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => setOnlyOffers((v) => !v)}
                className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] transition duration-200 md:px-4 ${
                  onlyOffers
                    ? "bg-[#c8f000] text-black"
                    : "border border-black/15 text-black/60 hover:border-black/40 hover:text-black"
                }`}
              >
                Ofertas
              </button>
            </div>

            {/* Sort */}
            <div className="relative self-start md:self-auto">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-black/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black/60 transition hover:border-black/40 hover:text-black"
              >
                <SlidersHorizontal size={12} />
                {sortOptions.find((s) => s.value === sortBy)?.label}
                <ChevronDown size={12} className={`transition ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-10 z-30 min-w-[160px] overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl md:left-auto md:right-0"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                        className={`block w-full px-5 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.15em] transition hover:bg-[#f5f5f5] ${
                          sortBy === opt.value ? "text-black" : "text-black/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Grid */}
          {loading ? (
            <GridSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center md:py-32">
              <p className="text-xl font-black uppercase text-black/10 md:text-2xl">Error al cargar productos</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 rounded-full bg-black px-7 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-black/80"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-24 text-center md:py-32"
                >
                  <p className="text-xl font-black uppercase text-black/10 md:text-2xl">Sin resultados</p>
                  <button
                    onClick={() => { setActiveCategory("Todos"); setOnlyOffers(false); setSearch(""); }}
                    className="mt-6 rounded-full bg-black px-7 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-black/80"
                  >
                    Limpiar filtros
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`${activeCategory}-${sortBy}-${onlyOffers}-${search}`}
                  className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4"
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                >
                  {filtered.map((product) => (
                    <motion.article key={product.id} variants={cardVariant} className="group">
                      <Link href={`/productos/${product.id}`} className="block">
                        <div className="relative overflow-hidden rounded-xl bg-[#e8e8e8]">
                          <div className="relative h-[190px] w-full sm:h-[260px] md:h-[320px]">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              unoptimized
                              className="object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>
                          {product.tag && (
                            <div className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider sm:left-3 sm:top-3 sm:px-3 sm:text-[10px] ${tagColor(product.tag)}`}>
                              {product.tag}
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 sm:translate-y-full sm:transition sm:duration-300 sm:group-hover:translate-y-0">
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
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── BANNER ── */}
      <section className="bg-[#f5f5f5] px-6 py-12 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col gap-5 rounded-3xl bg-[#c8f000] px-6 py-8 md:flex-row md:items-center md:justify-between md:gap-6 md:px-12 md:py-10"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-black/50">
                Envíos a todo el país
              </p>
              <h3 className="mt-1 text-xl font-black uppercase text-black md:text-3xl">
                Gratis desde $50.000
              </h3>
            </div>
            <Link
              href="/productos"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-black px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-black/80 md:px-7 md:py-3"
            >
              Ver todo <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}

export default function ProductosPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<GridSkeleton />}>
        <ProductosContent />
      </Suspense>
      <Footer />
    </>
  );
}
