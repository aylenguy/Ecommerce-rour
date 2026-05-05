import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white px-6 py-14 md:px-10">
      <div className="mx-auto max-w-7xl">

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-6">

          {/* Logo + descripción */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-black uppercase tracking-tighter text-black">
              Rour
            </Link>
            <p className="mt-3 max-w-[220px] text-xs leading-6 text-black/50">
              Streetwear pensado para los que se mueven diferente. Estilo, actitud y
              comodidad en cada prenda.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
              Navegación
            </p>
            <ul className="space-y-2">
              {[
                { label: "Inicio", href: "/" },
                { label: "Productos", href: "/productos" },
                { label: "Contacto", href: "/contacto" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-black/60 transition hover:text-black"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
              Categorías
            </p>
            <ul className="space-y-2">
              {[
                { label: "Buzos", href: "/productos?categoria=buzos" },
                { label: "Joggins", href: "/productos?categoria=joggins" },
                { label: "Accesorios", href: "/productos?categoria=accesorios" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-black/60 transition hover:text-black"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
              Info
            </p>
            <ul className="space-y-2">
              {[
                { label: "Envíos y devoluciones", href: "/" },
                { label: "Preguntas frecuentes", href: "/" },
                { label: "Términos y condiciones", href: "/" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-black/60 transition hover:text-black"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 md:flex-row">
          <p className="text-[11px] text-black/40">
            © {new Date().getFullYear()} Rour. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/40 transition hover:text-black"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/40 transition hover:text-black"
            >
              TikTok
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
