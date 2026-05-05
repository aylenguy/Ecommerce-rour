"use client";

import { useState } from "react";
import { useCart } from "../components/CartContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import {
  User,
  MapPin,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Lock,
  Check,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { API_URL } from "../../lib/api";

// ─── VARIANTS ────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const slideIn = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.3 },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

const FREE_SHIPPING_THRESHOLD = 50000;

const STEPS = [
  { id: 1, label: "Datos", icon: User },
  { id: 2, label: "Envío", icon: MapPin },
  { id: 3, label: "Pago", icon: CreditCard },
];

const PAYMENT_OPTIONS = [
  {
    value: "mp",
    label: "Mercado Pago",
    sub: "Pagá con dinero en cuenta, QR o Mercado Crédito",
  },
  {
    value: "card",
    label: "Tarjeta de crédito / débito",
    sub: "VISA, Mastercard, AMEX y más",
  },
  {
    value: "transfer",
    label: "Transferencia bancaria",
    sub: "CBU / CVU — acreditación en 24hs",
  },
];

// ─── TIPOS ───────────────────────────────────────────────────────────────────

type FormFields = {
  name: string;
  email: string;
  address: string;
  city: string;
  province: string;
  zip: string;
  payment: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

// ─── VALIDACIÓN ──────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_REGEX = /^\d{4,8}$/; // Argentina: 4 dígitos clásico o CPA de 8

function validateStep1(form: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = "El nombre es obligatorio.";
  } else if (form.name.trim().length < 3) {
    errors.name = "Ingresá tu nombre completo.";
  }

  if (!form.email.trim()) {
    errors.email = "El email es obligatorio.";
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = "El formato del email no es válido.";
  }

  return errors;
}

function validateStep2(form: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!form.address.trim()) {
    errors.address = "La dirección es obligatoria.";
  } else if (form.address.trim().length < 5) {
    errors.address = "Ingresá una dirección completa (calle y número).";
  }

  if (!form.city.trim()) {
    errors.city = "La ciudad es obligatoria.";
  }

  if (!form.province.trim()) {
    errors.province = "La provincia es obligatoria.";
  }

  if (form.zip.trim() && !ZIP_REGEX.test(form.zip.trim())) {
    errors.zip = "El código postal debe tener entre 4 y 8 dígitos.";
  }

  return errors;
}

// ─── FORM FIELD ──────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  name: keyof FormFields;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}

function FormField({
  label,
  name,
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete="on"
        className={`h-12 w-full rounded-xl border bg-[#f9f9f9] px-4 text-sm font-medium text-black outline-none placeholder:text-black/25 focus:bg-white transition ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-black/12 focus:border-black"
        }`}
      />
      {/* Mensaje de error animado */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 text-[11px] font-medium text-red-500"
          >
            <AlertCircle size={11} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── STEP HEADER ─────────────────────────────────────────────────────────────

function StepHeader({
  icon: Icon,
  step,
  title,
}: {
  icon: React.ElementType;
  step: number;
  title: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black">
        <Icon size={15} className="text-white" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/35">
          Paso {step} de 3
        </p>
        <h2 className="text-base font-black uppercase text-black">{title}</h2>
      </div>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormFields>({
    name: "",
    email: "",
    address: "",
    city: "",
    province: "",
    zip: "",
    payment: "mp",
  });

  // Errores por campo (se muestran tras blur o intento de avanzar)
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  // Campos que el usuario ya tocó
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});

  const shippingFree = total >= FREE_SHIPPING_THRESHOLD;
  const shipping = shippingFree ? 0 : 2500;
  const finalTotal = total + shipping;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value } as FormFields;
    setForm(updated);

    // Re-validar el campo en tiempo real si ya fue tocado
    if (touched[name as keyof FormFields]) {
      const errors =
        step === 1 ? validateStep1(updated) : validateStep2(updated);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: errors[name as keyof FormFields],
      }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validar solo este campo al salir
    const errors =
      step === 1 ? validateStep1(form) : validateStep2(form);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: errors[name as keyof FormFields],
    }));
  }

  function next() {
    // Validar todos los campos del paso actual antes de avanzar
    const errors = step === 1 ? validateStep1(form) : validateStep2(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Marcar todos los campos como tocados para mostrar errores
      const allTouched = Object.fromEntries(
        Object.keys(errors).map((k) => [k, true])
      ) as typeof touched;
      setTouched((prev) => ({ ...prev, ...allTouched }));
      return;
    }
    setFieldErrors({});
    setStep((s) => Math.min(s + 1, 3));
  }

  function back() {
    setFieldErrors({});
    setTouched({});
    setStep((s) => Math.max(s - 1, 1));
  }

  async function finishOrder() {
    setLoading(true);
    setError(null);
    try {
      const body = {
        customerName: form.name,
        customerEmail: form.email,
        address: form.address,
        city: form.city,
        province: form.province,
        zip: form.zip,
        paymentMethod: form.payment,
        // ⚠️ NO enviar el total calculado en el cliente
        // El backend debe recalcularlo desde los productIds y cantidades
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          price: item.price,       // referencia, el backend valida
          size: item.size,
          color: item.color,
          quantity: item.qty,
        })),
      };

      const res = await fetch(`${API_URL}/api/Orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // Intentar leer el error del backend si lo devuelve
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Error al procesar la orden");
      }

      const order = await res.json();
      router.push(`/orden-confirmada?id=${order.id}`);
clearCart();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Hubo un problema al procesar tu pedido. Intentá de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }

  // ── Carrito vacío ──────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#f5f5f5]">
          <div className="bg-[#111] px-5 pb-10 pt-40 md:px-10 md:pb-20 md:pt-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-2 flex items-center gap-3">
                <div className="h-px w-6 bg-white/40" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50">
                  Checkout
                </span>
              </div>
              <h1 className="text-3xl font-black uppercase text-white md:text-5xl">
                Checkout
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center px-5 py-24 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-black/5">
              <ShoppingBag size={32} className="text-black/20" />
            </div>
            <h2 className="text-xl font-black uppercase text-black">
              Tu carrito está vacío
            </h2>
            <p className="mt-2 text-sm text-black/40">
              Agregá productos antes de continuar.
            </p>
            <Link
              href="/productos"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-black/80"
            >
              Ver productos <ChevronRight size={14} />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Checkout ───────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f5f5f5]">

        {/* ── HEADER ─────────────────────────────── */}
        <div className="bg-[#111] px-5 pb-14 pt-[150px] md:px-10 md:pb-20 md:pt-40">
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
              <h1 className="text-3xl font-black uppercase text-white md:text-5xl">
                Checkout
              </h1>
            </motion.div>

            {/* Step indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-7 flex items-center"
            >
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const isActive = step === s.id;
                const isDone = step > s.id;
                return (
                  <div key={s.id} className="flex items-center">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold transition-all duration-300 sm:h-8 sm:w-8 ${
                          isDone
                            ? "border-[#c8f000] bg-[#c8f000] text-black"
                            : isActive
                            ? "border-white bg-white text-black"
                            : "border-white/20 bg-transparent text-white/40"
                        }`}
                      >
                        {isDone ? <Check size={12} /> : <Icon size={12} />}
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-300 sm:text-[11px] sm:tracking-[0.15em] ${
                          isActive
                            ? "text-white"
                            : isDone
                            ? "text-[#c8f000]"
                            : "text-white/30"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`mx-2 h-px w-8 transition-all duration-500 sm:mx-4 sm:w-12 ${
                          step > s.id ? "bg-[#c8f000]/60" : "bg-white/15"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* ── CONTENIDO ──────────────────────────── */}
        <section className="px-5 py-8 md:px-10 md:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">

              {/* ── FORMULARIO ── */}
              <div className="order-2 lg:order-1">
                <AnimatePresence mode="wait">

                  {/* STEP 1 — Datos personales */}
                  {step === 1 && (
                    <motion.div key="step1" {...slideIn} className="rounded-2xl bg-white p-5 md:p-8">
                      <StepHeader icon={User} step={1} title="Datos personales" />
                      <div className="space-y-4">
                        <FormField
                          label="Nombre completo"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Ej: Juan García"
                          error={fieldErrors.name}
                        />
                        <FormField
                          label="Email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="tu@email.com"
                          error={fieldErrors.email}
                        />
                      </div>
                      <div className="mt-7 flex justify-end">
                        <button
                          onClick={next}
                          className="flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-black/80"
                        >
                          Continuar <ChevronRight size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2 — Dirección de envío */}
                  {step === 2 && (
                    <motion.div key="step2" {...slideIn} className="rounded-2xl bg-white p-5 md:p-8">
                      <StepHeader icon={MapPin} step={2} title="Dirección de envío" />
                      <div className="space-y-4">
                        <FormField
                          label="Dirección"
                          name="address"
                          type="text"
                          value={form.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Calle y número"
                          error={fieldErrors.address}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            label="Ciudad"
                            name="city"
                            type="text"
                            value={form.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Ej: Rosario"
                            error={fieldErrors.city}
                          />
                          <FormField
                            label="Provincia"
                            name="province"
                            type="text"
                            value={form.province}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Ej: Santa Fe"
                            error={fieldErrors.province}
                          />
                        </div>
                        <FormField
                          label="Código postal"
                          name="zip"
                          type="text"
                          value={form.zip}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Ej: 2000"
                          error={fieldErrors.zip}
                        />
                      </div>
                      <div className="mt-7 flex items-center justify-between">
                        <button
                          onClick={back}
                          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-black/40 transition hover:text-black"
                        >
                          <ChevronLeft size={13} /> Volver
                        </button>
                        <button
                          onClick={next}
                          className="flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-black/80"
                        >
                          Continuar <ChevronRight size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3 — Método de pago */}
                  {step === 3 && (
                    <motion.div key="step3" {...slideIn} className="space-y-4">
                      <div className="rounded-2xl bg-white p-5 md:p-8">
                        <StepHeader icon={CreditCard} step={3} title="Método de pago" />
                        <div className="space-y-3">
                          {PAYMENT_OPTIONS.map((opt) => (
                            <label
                              key={opt.value}
                              className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${
                                form.payment === opt.value
                                  ? "border-black bg-black/[0.02]"
                                  : "border-black/8 hover:border-black/20"
                              }`}
                            >
                              <input
                                type="radio"
                                name="payment"
                                value={opt.value}
                                checked={form.payment === opt.value}
                                onChange={handleChange}
                                className="mt-0.5 accent-black"
                              />
                              <div>
                                <p className="text-sm font-bold text-black">{opt.label}</p>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-black/40">
                                  {opt.sub}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Resumen compacto — solo en mobile */}
                      <div className="rounded-2xl bg-white p-5 lg:hidden">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                          Resumen del pedido
                        </p>
                        <div className="space-y-2.5">
                          {items.map((item) => (
                            <div
                              key={`${item.id}-${item.size}-${item.color}`}
                              className="flex items-center gap-3"
                            >
                              <div className="relative h-10 w-8 shrink-0 overflow-hidden rounded-lg bg-[#e8e8e8]">
                                <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[12px] font-bold text-black">{item.name}</p>
                                <p className="text-[10px] text-black/35">{item.size} · {item.color} · x{item.qty}</p>
                              </div>
                              <span className="text-[12px] font-black text-black">
                                {formatPrice(item.price * item.qty)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 pt-1">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={back}
                            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-black/40 transition hover:text-black"
                          >
                            <ChevronLeft size={13} /> Volver
                          </button>
                          <button
                            onClick={finishOrder}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-full bg-[#c8f000] px-7 py-3.5 text-[12px] font-black uppercase tracking-[0.15em] text-black transition hover:bg-[#b8e000] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {loading ? (
                              <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                Procesando...
                              </>
                            ) : (
                              <>
                                Confirmar compra <Check size={14} />
                              </>
                            )}
                          </button>
                        </div>

                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-1.5 text-center text-[11px] font-bold text-red-500"
                          >
                            <AlertCircle size={12} />
                            {error}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* ── SIDEBAR RESUMEN ── */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="order-1 rounded-2xl bg-white p-5 self-start lg:order-2 lg:p-6"
              >
                <h2 className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-black">
                  Tu pedido
                </h2>
                <div className="mb-4 space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="flex items-center gap-3"
                    >
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-xl bg-[#e8e8e8]">
                        <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
                        <div className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[8px] font-black text-white">
                          {item.qty}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-bold text-black">{item.name}</p>
                        <p className="text-[10px] text-black/35">{item.size} · {item.color}</p>
                      </div>
                      <span className="text-[12px] font-black text-black">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mb-3 h-px bg-black/8" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-black/60">
                    <span>Subtotal</span>
                    <span className="font-bold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-black/60">
                    <span>Envío</span>
                    <span className={`font-bold ${shippingFree ? "text-[#1a9900]" : ""}`}>
                      {shippingFree ? "Gratis" : formatPrice(shipping)}
                    </span>
                  </div>
                </div>
                <div className="my-3 h-px bg-black/8" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black uppercase tracking-[0.1em] text-black">Total</span>
                  <span className="text-2xl font-black text-black">{formatPrice(finalTotal)}</span>
                </div>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-black/35">
                  <Lock size={10} />
                  <span>Pago 100% seguro</span>
                </div>
                <div className="mt-3 flex items-center justify-center gap-2 opacity-40">
                  {["VISA", "MC", "AMEX", "MP"].map((brand) => (
                    <div key={brand} className="rounded border border-black/15 px-2 py-1 text-[9px] font-black tracking-wider text-black">
                      {brand}
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
