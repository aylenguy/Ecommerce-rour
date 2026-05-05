"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Truck,
  RefreshCw,
  Lock,
  ChevronDown,
  Heart,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../components/CartContext";
import { API_URL } from "../../../lib/api";

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

function formatPrice(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

function tagColor(tag: string | null) {
  if (!tag) return "";
  if (tag === "Sale!" || tag === "Oferta") return "bg-[#c8f000] text-black";
  return "bg-black text-white";
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-bold uppercase tracking-[0.15em] text-black"
      >
        {title}
        <ChevronDown size={15} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm leading-7 text-black/55">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Skeleton() {
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-black/8 px-6 py-3.5 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="h-3 w-48 rounded-full bg-black/8 animate-pulse" />
        </div>
      </div>
      <section className="px-6 py-10 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-14">
            {/* FIX: skeleton imagen más baja en mobile */}
            <div className="h-[320px] rounded-2xl bg-black/8 animate-pulse md:h-[500px]" />
            <div className="space-y-4">
              <div className="h-4 w-24 rounded-full bg-black/8 animate-pulse" />
              <div className="h-10 w-3/4 rounded-xl bg-black/8 animate-pulse" />
              <div className="h-8 w-32 rounded-xl bg-black/8 animate-pulse" />
              <div className="h-px bg-black/8" />
              <div className="h-4 w-20 rounded-full bg-black/8 animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3].map(i => <div key={i} className="h-9 w-20 rounded-full bg-black/8 animate-pulse" />)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addItem } = useCart();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setActiveImage(0);
        setSelectedSize(null);
        setSelectedColor(null);

        const [productRes, allRes] = await Promise.all([
          fetch(`${API_URL}/api/products/${id}`),
          fetch(`${API_URL}/api/products`),
        ]);

        if (!productRes.ok) { setNotFound(true); return; }

        const productData: Product = await productRes.json();
        const allData: Product[] = await allRes.json();

        setProduct(productData);
        setRelated(allData.filter((p) => p.id !== productData.id && p.isActive).slice(0, 4));

        if (productData.sizes?.length) setSelectedSize(productData.sizes[0]);
        if (productData.colors?.length) setSelectedColor(productData.colors[0]);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  function handleAdd() {
    if (!product || !selectedSize || !selectedColor) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      category: product.category,
      size: selectedSize,
      color: selectedColor,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) return <><Navbar /><Skeleton /><Footer /></>;

  if (notFound || !product) return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-2xl font-black uppercase text-black/20">Producto no encontrado</p>
        <Link href="/productos" className="rounded-full bg-black px-7 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-white">
          Ver productos
        </Link>
      </main>
      <Footer />
    </>
  );

  const canAdd = !!selectedSize && !!selectedColor;
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">

        {/* ── BREADCRUMB ── */}
        <div className="border-b border-black/8 px-6 py-3.5 md:px-10">
          <div className="mx-auto max-w-7xl">
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
              <Link href="/" className="hover:text-black transition">Inicio</Link>
              <span>/</span>
              <Link href="/productos" className="hover:text-black transition">Productos</Link>
              <span>/</span>
              {/* FIX: truncar nombre largo en mobile */}
              <span className="max-w-[140px] truncate text-black/70 sm:max-w-none">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* ── PRODUCTO ── */}
<section className="px-6 pb-8 pt-24 md:px-10 md:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-14 lg:gap-20">

              {/* ── Galería ── */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-3 sm:flex-row-reverse"
              >
                {/* Imagen principal */}
                <div className="relative flex-1 overflow-hidden rounded-2xl bg-[#e8e8e8]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="relative h-[320px] w-full sm:h-[460px] md:h-[560px]"
                    >
                      <Image
                        src={product.images[activeImage]}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  {product.tag && (
                    <div className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${tagColor(product.tag)}`}>
                      {product.tag}
                    </div>
                  )}
                  {discount && (
                    <div className="absolute right-3 top-3 flex h-11 w-11 flex-col items-center justify-center rounded-full bg-[#c8f000] text-black md:h-12 md:w-12">
                      <span className="text-sm font-black leading-none md:text-base">-{discount}</span>
                      <span className="text-[8px] font-bold">%</span>
                    </div>
                  )}
                </div>

                {/* Thumbnails — fila horizontal en mobile, columna en sm+ */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 sm:flex-col sm:gap-3">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition duration-200 sm:h-20 sm:w-20 md:h-24 md:w-24 ${
                          activeImage === i ? "border-black" : "border-transparent opacity-60"
                        }`}
                      >
                        <Image src={img} alt="" fill unoptimized className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* ── Info ── */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col"
              >
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">{product.category}</p>
                {/* FIX: título más chico en mobile */}
                <h1 className="text-2xl font-black uppercase leading-tight text-black sm:text-3xl md:text-4xl">{product.name}</h1>

                <div className="mt-3 flex items-center gap-3 md:mt-4">
                  <span className="text-xl font-black text-black md:text-2xl">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-black/35 line-through md:text-base">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>

                <div className="my-5 h-px w-full bg-black/8 md:my-6" />

                {/* Colores */}
                <div className="mb-4 md:mb-5">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-black/50">
                    Color{selectedColor ? ` — ${selectedColor}` : ""}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] transition duration-200 ${
                          selectedColor === color
                            ? "bg-black text-white"
                            : "border border-black/15 text-black/60 hover:border-black/40 hover:text-black"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Talles */}
                <div className="mb-5 md:mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/50">
                      Talle{selectedSize ? ` — ${selectedSize}` : ""}
                    </p>
                    <button className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/40 underline underline-offset-2 hover:text-black transition">
                      Guía de talles
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-9 min-w-[40px] rounded-lg px-3 text-[11px] font-bold uppercase tracking-[0.08em] transition duration-200 md:h-10 md:min-w-[44px] md:text-[12px] ${
                          selectedSize === size
                            ? "bg-black text-white"
                            : "border border-black/15 text-black/60 hover:border-black/40 hover:text-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cantidad + Agregar + Wishlist */}
                {/* FIX: en mobile cantidad arriba, botones abajo en columna */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {/* Cantidad */}
                    <div className="flex items-center rounded-full border border-black/15">
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center text-black/50 transition hover:text-black">
                        <Minus size={13} />
                      </button>
                      <span className="w-7 text-center text-sm font-bold">{qty}</span>
                      <button onClick={() => setQty((q) => q + 1)} className="flex h-10 w-10 items-center justify-center text-black/50 transition hover:text-black">
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Wishlist */}
                    <button
                      onClick={() => setWishlist((v) => !v)}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition duration-200 md:h-12 md:w-12 ${
                        wishlist ? "border-black bg-black text-white" : "border-black/15 text-black/40 hover:border-black/40 hover:text-black"
                      }`}
                    >
                      <Heart size={15} fill={wishlist ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Botón agregar — ancho completo */}
                  <button
                    onClick={handleAdd}
                    disabled={!canAdd}
                    className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] transition duration-300 ${
                      !canAdd
                        ? "cursor-not-allowed bg-black/10 text-black/30"
                        : added
                        ? "bg-[#c8f000] text-black"
                        : "bg-black text-white hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {added ? (
                        <motion.span key="check" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} className="flex items-center gap-2">
                          <Check size={14} strokeWidth={2.5} /> ¡Agregado!
                        </motion.span>
                      ) : (
                        <motion.span key="cart" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} className="flex items-center gap-2">
                          <ShoppingCart size={14} strokeWidth={2} /> Agregar al carrito
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>

                {/* Trust badges */}
                <div className="mt-5 flex flex-wrap gap-3 md:mt-6 md:gap-4">
                  {[
                    { icon: <Truck size={13} />, text: "Envío a todo el país" },
                    { icon: <RefreshCw size={13} />, text: "30 días de cambio" },
                    { icon: <Lock size={13} />, text: "Pago seguro" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-black/40">
                      {item.icon}{item.text}
                    </div>
                  ))}
                </div>

                <div className="my-5 h-px w-full bg-black/8 md:my-6" />

                <div>
                  <Accordion title="Descripción"><p>{product.description}</p></Accordion>
                  <Accordion title="Detalles del producto">
                    <ul className="space-y-1.5">
                      {product.details.map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <Check size={12} className="mt-1 shrink-0 text-black/30" />{d}
                        </li>
                      ))}
                    </ul>
                  </Accordion>
                  <Accordion title="Envíos y devoluciones">
                    <p>Enviamos a todo el país por correo oficial y empresas privadas. El tiempo estimado de entrega es de 3 a 7 días hábiles. Los cambios se pueden gestionar dentro de los 30 días posteriores a la compra presentando el comprobante.</p>
                  </Accordion>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── PRODUCTOS RELACIONADOS ── */}
        {related.length > 0 && (
          <section className="bg-[#f5f5f5] px-6 py-12 md:px-10 md:py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-7 flex items-end justify-between md:mb-8">
                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.35em] text-black/40">También te puede gustar</p>
                  <h2 className="text-xl font-black uppercase text-black md:text-3xl">Relacionados</h2>
                </div>
                <Link href="/productos" className="hidden items-center gap-2 text-[12px] font-bold uppercase tracking-[0.15em] text-black/50 transition hover:text-black md:flex">
                  Ver todo
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                {related.map((p, i) => (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    className="group"
                  >
                    <Link href={`/productos/${p.id}`} className="block">
                      <div className="relative overflow-hidden rounded-xl bg-[#e8e8e8]">
                        {/* FIX: altura reducida en mobile (era 220px) */}
                        <div className="relative h-[180px] w-full sm:h-[230px] md:h-[300px]">
                          <Image src={p.images[0]} alt={p.name} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        {p.tag && (
                          <div className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider sm:left-3 sm:top-3 sm:px-3 sm:text-[10px] ${tagColor(p.tag)}`}>
                            {p.tag}
                          </div>
                        )}
                        {/* FIX: hover slide-up solo en desktop, en mobile siempre visible */}
                        <div className="absolute bottom-0 left-0 right-0 sm:translate-y-full sm:transition sm:duration-300 sm:group-hover:translate-y-0">
                          <Link
                            href={`/productos/${p.id}`}
                            className="flex w-full items-center justify-center gap-2 bg-black py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white hover:bg-[#1a1a1a] sm:py-3 sm:text-[12px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ShoppingCart size={13} /> Ver producto
                          </Link>
                        </div>
                      </div>
                      <div className="mt-2 px-0.5 md:mt-3 md:px-1">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 sm:text-[10px]">{p.category}</p>
                        <h3 className="mt-0.5 text-xs font-bold text-black sm:mt-1 sm:text-sm">{p.name}</h3>
                        <div className="mt-0.5 flex items-center gap-1.5 sm:mt-1 sm:gap-2">
                          <span className="text-xs font-bold sm:text-sm">{formatPrice(p.price)}</span>
                          {p.originalPrice && <span className="text-[10px] text-black/40 line-through sm:text-xs">{formatPrice(p.originalPrice)}</span>}
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
