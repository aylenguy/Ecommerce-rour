"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
  ArrowRight,
  Share2,
  Users,
  AtSign,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── VARIANTS ────────────────────────────────────────────────────────────────
// Definidos fuera de los componentes para evitar recreación en cada render

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "¿Cuánto tarda en llegar mi pedido?",
    a: "El tiempo estimado de entrega es de 3 a 7 días hábiles según tu ubicación. Zonas del interior pueden demorar un poco más. Te enviamos el número de seguimiento por email una vez despachado.",
  },
  {
    q: "¿Cómo puedo cambiar o devolver un producto?",
    a: "Tenés 30 días desde la fecha de compra para gestionar un cambio o devolución. El producto debe estar sin uso, con etiquetas y en su empaque original. Escribinos por WhatsApp o email con tu número de pedido.",
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencia bancaria y efectivo mediante Rapipago / Pago Fácil. También podés pagar en cuotas con tarjeta.",
  },
  {
    q: "¿Los talles son estándar?",
    a: "Nuestros talles siguen la guía estándar argentina. En cada producto encontrás la tabla de talles con las medidas exactas. Si tenés dudas, escribinos y te ayudamos a elegir.",
  },
  {
    q: "¿Hacen envíos a todo el país?",
    a: "Sí, enviamos a todo el territorio argentino mediante correo oficial y empresas privadas como Andreani y OCA. El envío es gratis en compras superiores a $50.000.",
  },
  {
    q: "¿Puedo hacer un pedido mayorista?",
    a: "¡Sí! Para pedidos mayoristas escribinos directamente por WhatsApp o email con la cantidad y productos que te interesan y te pasamos los precios especiales.",
  },
];

const socials = [
  {
    name: "Instagram",
    handle: "@rour.store",
    href: "https://instagram.com",
    icon: AtSign,
    bg: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    desc: "Novedades, looks y drops",
  },
  {
    name: "Facebook",
    handle: "Rour Store",
    href: "https://facebook.com",
    icon: Users,
    bg: "bg-[#1877f2]",
    desc: "Comunidad y atención",
  },
  {
    name: "Twitter / X",
    handle: "@rour_store",
    href: "https://twitter.com",
    icon: Share2,
    bg: "bg-black",
    desc: "Novedades y sorteos",
  },
];

// ─── FAQ ITEM ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black/10 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 py-5 text-left"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 text-[11px] font-bold tabular-nums text-black/25">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm font-bold leading-snug text-black">{q}</span>
        </div>
        <ChevronDown
          size={16}
          className={`mt-0.5 shrink-0 text-black/40 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
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
            <p className="pb-5 pl-8 text-sm leading-7 text-black/55">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function ContactoPage() {
  return (
    <>
      <Navbar />

      <main className="bg-white">

        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        <section className="bg-[#111] px-5 pb-16 pt-40 md:px-10 md:pb-28 md:pt-36">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-6 bg-white/40" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50">
                  Estamos para ayudarte
                </span>
              </div>
              <h1 className="text-4xl font-black uppercase leading-none text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Contacto
              </h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/50">
                ¿Tenés una duda, consulta o querés hacer un pedido especial? Escribinos
                por cualquiera de nuestros canales.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── WHATSAPP + INFO ──────────────────────────────────────────────── */}
        <section className="px-5 py-12 md:px-10 md:py-20">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-4 md:grid-cols-3"
            >
              {/* WhatsApp — destacado */}
              <motion.a
                variants={fadeUp}
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="group col-span-1 flex items-center justify-between gap-4 rounded-2xl bg-[#25d366] px-6 py-8 transition duration-300 hover:brightness-105 md:col-span-2 md:rounded-3xl md:px-8 md:py-10"
              >
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">
                    Respuesta inmediata
                  </p>
                  <h2 className="text-2xl font-black uppercase text-black sm:text-3xl md:text-4xl">
                    WhatsApp
                  </h2>
                  <p className="mt-1.5 text-sm text-black/60">
                    Lunes a viernes · 9hs a 18hs
                  </p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black/10 transition duration-300 group-hover:bg-black/20">
                  <MessageCircle size={26} className="text-black" />
                </div>
              </motion.a>

              {/* Email */}
              <motion.a
                variants={fadeUp}
                href="mailto:hola@rour.store"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#f9f9f9] px-6 py-8 transition duration-300 hover:border-black/30 hover:bg-white md:rounded-3xl md:px-8 md:py-10"
              >
                <div className="min-w-0">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
                    Email
                  </p>
                  <h2 className="truncate text-lg font-black uppercase text-black sm:text-xl">
                    hola@rour.store
                  </h2>
                  <p className="mt-1.5 text-sm text-black/40">Respuesta en 24hs</p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 transition group-hover:border-black/30">
                  <Mail size={17} className="text-black/50" />
                </div>
              </motion.a>
            </motion.div>

            {/* Horarios */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-black/8 bg-[#f9f9f9] px-5 py-4"
            >
              <Clock size={15} className="shrink-0 text-black/30" />
              <div className="flex flex-wrap gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-black/50 sm:gap-6">
                <span>Lun – Vie: 9:00 – 18:00</span>
                <span className="hidden sm:block text-black/20">|</span>
                <span>Sáb: 10:00 – 14:00</span>
                <span className="hidden sm:block text-black/20">|</span>
                <span>Dom: Cerrado</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── REDES SOCIALES ───────────────────────────────────────────────── */}
        <section className="bg-[#f5f5f5] px-5 py-12 md:px-10 md:py-20">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mb-8"
            >
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-black/40">
                Seguinos
              </p>
              <h2 className="text-3xl font-black uppercase text-black md:text-4xl">
                Redes sociales
              </h2>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {socials.map((s) => (
                <motion.a
                  key={s.name}
                  variants={fadeUp}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.bg}`}
                  >
                    <s.icon size={19} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-black">{s.name}</p>
                    <p className="text-[11px] font-bold text-black/50">{s.handle}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-black/30">
                      {s.desc}
                    </p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="shrink-0 text-black/20 transition group-hover:translate-x-1 group-hover:text-black/50"
                  />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── MAPA / ZONA DE ENVÍOS ────────────────────────────────────────── */}
        <section className="px-5 py-12 md:px-10 md:py-20">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center md:gap-10"
            >
              <motion.div variants={fadeUp}>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-black/40">
                  Cobertura
                </p>
                <h2 className="mb-3 text-3xl font-black uppercase text-black md:text-4xl">
                  Enviamos a todo el país
                </h2>
                <p className="mb-6 text-sm leading-7 text-black/55">
                  Somos una tienda 100% online. Despachamos desde Buenos Aires hacia
                  todo el territorio argentino mediante correo oficial y empresas
                  privadas.
                </p>
                <div className="space-y-2.5">
                  {[
                    { label: "AMBA", detail: "2 – 4 días hábiles" },
                    { label: "Interior GBA y Córdoba", detail: "3 – 5 días hábiles" },
                    { label: "Resto del país", detail: "5 – 7 días hábiles" },
                    { label: "Envío gratis", detail: "En compras desde $50.000" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border border-black/8 bg-[#f9f9f9] px-4 py-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin size={12} className="shrink-0 text-black/30" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-black">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-black/40">
                        {item.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Mapa embed — Argentina */}
              <motion.div
                variants={fadeUp}
                className="overflow-hidden rounded-2xl border border-black/8 md:rounded-3xl"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13136045.88609093!2d-70.0!3d-38.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x943a43dfbd31ceb3%3A0xe2bb26c3ed8aba55!2sArgentina!5e0!3m2!1ses!2sar!4v1680000000000"
                  width="100%"
                  height="320"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Zona de envíos — Argentina"
                  className="md:h-[420px]"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="bg-[#f5f5f5] px-5 py-12 md:px-10 md:py-20">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mb-8"
            >
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-black/40">
                Dudas frecuentes
              </p>
              <h2 className="text-3xl font-black uppercase text-black md:text-4xl">
                Preguntas frecuentes
              </h2>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-2xl bg-white px-4 py-1 md:rounded-3xl md:px-10 md:py-2"
            >
              {faqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </motion.div>

            {/* CTA si no encontró respuesta */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-6 flex flex-col gap-4 rounded-2xl bg-black px-6 py-6 text-center md:flex-row md:items-center md:justify-between md:px-8 md:py-7 md:text-left"
            >
              <div>
                <p className="text-sm font-black uppercase text-white">
                  ¿No encontraste lo que buscabas?
                </p>
                <p className="mt-0.5 text-[12px] text-white/50">
                  Escribinos directamente y te respondemos a la brevedad.
                </p>
              </div>
              <a
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full bg-[#25d366] px-7 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-black transition hover:brightness-105"
              >
                Escribir por WhatsApp
              </a>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
