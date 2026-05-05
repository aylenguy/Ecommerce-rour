"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Plus, X, Loader2 } from "lucide-react";
import { API_URL } from "../../../../../lib/api";

const CATEGORIES = ["Remeras", "Buzos", "Joggins", "Accesorios"];
const TAGS = ["", "Nuevo", "Sale!"];

interface FormState {
  name: string;
  price: string;
  originalPrice: string;
  category: string;
  tag: string;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  details: string[];
  isActive: boolean;
}

export default function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: "",
    price: "",
    originalPrice: "",
    category: CATEGORIES[0],
    tag: "",
    description: "",
    images: [""],
    sizes: [],
    colors: [],
    details: [""],
    isActive: true,
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${API_URL}/api/Products/${id}`);
        if (!res.ok) { setNotFound(true); return; }
        const p = await res.json();
        setForm({
          name: p.name,
          price: String(p.price),
          originalPrice: p.originalPrice ? String(p.originalPrice) : "",
          category: p.category,
          tag: p.tag ?? "",
          description: p.description,
          images: p.images?.length ? p.images : [""],
          sizes: p.sizes ?? [],
          colors: p.colors ?? [],
          details: p.details?.length ? p.details : [""],
          isActive: p.isActive,
        });
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  function setListItem(field: "images" | "details", index: number, value: string) {
    setForm((prev) => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  }

  function addListItem(field: "images" | "details") {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  }

  function removeListItem(field: "images" | "details", index: number) {
    setForm((prev) => {
      const arr = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: arr.length ? arr : [""] };
    });
  }

  function toggleChip(field: "sizes" | "colors", value: string) {
    setForm((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  }

  async function handleSubmit() {
    setError(null);
    if (!form.name.trim() || !form.price || !form.description.trim()) {
      setError("Completá nombre, precio y descripción.");
      return;
    }

    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        category: form.category,
        tag: form.tag || null,
        description: form.description.trim(),
        images: form.images.filter((i) => i.trim()),
        sizes: form.sizes,
        colors: form.colors,
        details: form.details.filter((d) => d.trim()),
        isActive: form.isActive,
      };

      const res = await fetch(`${API_URL}/api/Products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error();
      router.push("/admin");
    } catch {
      setError("Hubo un error al guardar. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        <Loader2 size={24} className="animate-spin text-black/30" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f5f5]">
        <p className="text-xl font-black uppercase text-black/20">Producto no encontrado</p>
        <Link href="/admin" className="rounded-full bg-black px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
          Volver al admin
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">

      {/* ── HEADER ── */}
      <div className="bg-[#111] px-6 py-8 md:px-10">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 transition hover:text-white"
          >
            <ChevronLeft size={12} /> Volver al admin
          </Link>
          <h1 className="text-2xl font-black uppercase text-white md:text-3xl">Editar producto</h1>
          <p className="mt-1 text-sm text-white/40">ID #{id}</p>
        </div>
      </div>

      {/* ── FORM ── */}
      <div className="mx-auto max-w-4xl px-6 py-8 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >

          {/* Info básica */}
          <Section title="Información básica">
            <Field label="Nombre del producto *">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Precio *">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Precio original (opcional)">
                <input
                  type="number"
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Categoría">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputClass}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Tag">
                <select
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className={inputClass}
                >
                  {TAGS.map((t) => <option key={t} value={t}>{t || "Sin tag"}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Descripción *">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </Field>

            <Field label="Estado">
              <label className="flex cursor-pointer items-center gap-3">
                <div
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form.isActive ? "bg-black" : "bg-black/20"}`}
                >
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.isActive ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm font-bold text-black">
                  {form.isActive ? "Activo (visible en tienda)" : "Inactivo (oculto)"}
                </span>
              </label>
            </Field>
          </Section>

          {/* Imágenes */}
          <Section title="Imágenes (URLs)">
            <div className="space-y-2">
              {form.images.map((img, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => setListItem("images", i, e.target.value)}
                    placeholder="https://..."
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    onClick={() => removeListItem("images", i)}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-black/10 text-black/30 transition hover:border-red-200 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addListItem("images")}
                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-black/40 transition hover:text-black"
              >
                <Plus size={12} /> Agregar imagen
              </button>
            </div>
          </Section>

          {/* Talles */}
          <Section title="Talles disponibles">
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL", "XXL", "Único"].map((size) => (
                <button
                  key={size}
                  onClick={() => toggleChip("sizes", size)}
                  className={`h-10 min-w-[44px] rounded-lg px-3 text-[12px] font-bold uppercase tracking-[0.08em] transition ${
                    form.sizes.includes(size)
                      ? "bg-black text-white"
                      : "border border-black/15 text-black/50 hover:border-black/40 hover:text-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </Section>

          {/* Colores */}
          <Section title="Colores disponibles">
            <div className="flex flex-wrap gap-2">
              {["Negro", "Blanco", "Gris", "Beige", "Verde", "Azul", "Rojo", "Arena", "Marrón"].map((color) => (
                <button
                  key={color}
                  onClick={() => toggleChip("colors", color)}
                  className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] transition ${
                    form.colors.includes(color)
                      ? "bg-black text-white"
                      : "border border-black/15 text-black/50 hover:border-black/40 hover:text-black"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </Section>

          {/* Detalles */}
          <Section title="Detalles del producto">
            <div className="space-y-2">
              {form.details.map((detail, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={detail}
                    onChange={(e) => setListItem("details", i, e.target.value)}
                    placeholder="Ej: 100% algodón peinado"
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    onClick={() => removeListItem("details", i)}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-black/10 text-black/30 transition hover:border-red-200 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addListItem("details")}
                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-black/40 transition hover:text-black"
              >
                <Plus size={12} /> Agregar detalle
              </button>
            </div>
          </Section>

          {error && (
            <p className="text-center text-[12px] font-bold text-red-500">{error}</p>
          )}

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/admin"
              className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/40 transition hover:text-black"
            >
              Cancelar
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-black/80 disabled:opacity-50"
            >
              {saving ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : "Guardar cambios"}
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 md:p-8">
      <h2 className="mb-5 text-[11px] font-black uppercase tracking-[0.2em] text-black/40">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-black/12 bg-[#f9f9f9] px-4 text-sm font-medium text-black outline-none placeholder:text-black/25 focus:border-black focus:bg-white transition";
