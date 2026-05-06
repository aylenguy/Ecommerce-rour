"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function OrdenConfirmadaContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f5f5f5]">
        <div className="bg-[#111] px-6 pb-12 pt-40 md:px-10 md:pb-16 md:pt-34">
          <div className="mx-auto max-w-7xl">
            <div className="mb-2 flex items-center gap-3">
              <div className="h-px w-6 bg-white/40" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50">
                Confirmación
              </span>
            </div>
            <h1 className="text-4xl font-black uppercase text-white md:text-5xl">Tu pedido</h1>
          </div>
        </div>

        <section className="px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl bg-white p-8 text-center md:p-12"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#c8f000]"
              >
                <CheckCircle size={36} className="text-black" strokeWidth={2} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-black/35">
                  ¡Compra realizada!
                </p>
                <h2 className="text-2xl font-black uppercase text-black md:text-3xl">
                  Gracias por tu compra
                </h2>
                {orderId && (
                  <p className="mt-3 inline-block rounded-full bg-black/5 px-4 py-1.5 text-[11px] font-bold tracking-wider text-black/50">
                    Orden #{orderId}
                  </p>
                )}
                <p className="mt-4 text-sm leading-relaxed text-black/50">
                  Recibimos tu pedido correctamente. Te enviamos los detalles
                  y el seguimiento a tu email en los próximos minutos.
                </p>
              </motion.div>

              <div className="my-8 h-px bg-black/8" />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="mb-8 grid grid-cols-2 gap-3 text-left"
              >
                {[
                  { label: "Tiempo de entrega", value: "3 a 7 días hábiles" },
                  { label: "Seguimiento", value: "Por email" },
                  { label: "Cambios", value: "Hasta 30 días" },
                  { label: "Soporte", value: "soporte@urban.com" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-[#f5f5f5] px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/35">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[12px] font-bold text-black">{item.value}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  href="/productos"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-black/80"
                >
                  <ShoppingBag size={14} /> Seguir comprando
                </Link>
                <Link
                  href="/"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black/15 py-3.5 text-[12px] font-bold uppercase tracking-[0.15em] text-black/60 transition hover:border-black hover:text-black"
                >
                  Inicio <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function OrdenConfirmada() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f5f5]" />}>
      <OrdenConfirmadaContent />
    </Suspense>
  );
}