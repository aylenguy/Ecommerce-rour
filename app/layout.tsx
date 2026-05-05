import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./components/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UrbanStore | Streetwear Collection",
  description: "Tienda de streetwear con las últimas colecciones. Envío a todo el país.",
  openGraph: {
    title: "UrbanStore | Streetwear Collection",
    description: "Tienda de streetwear con las últimas colecciones. Envío a todo el país.",
    url: "https://tu-dominio.vercel.app", // ← cambiá por tu URL real
    siteName: "UrbanStore",
    images: [
      {
        url: "https://tu-dominio.vercel.app/og-image.jpg", // ← imagen que se ve en LinkedIn
        width: 1200,
        height: 630,
        alt: "UrbanStore Streetwear",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}