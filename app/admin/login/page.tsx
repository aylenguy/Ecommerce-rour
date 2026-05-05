"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../../../lib/api";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      const { token } = await res.json();

      document.cookie = `admin_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      router.refresh();
      router.push("/admin");
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#c8f000]">
            <Lock size={22} className="text-black" />
          </div>
          <h1 className="text-2xl font-black uppercase text-white">Admin</h1>
          <p className="mt-1 text-[11px] text-white/30 uppercase tracking-widest">UrbanStore</p>
        </div>

        <div className="rounded-2xl bg-white p-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">
              Usuario
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="admin"
              className="h-12 w-full rounded-xl border border-black/12 bg-[#f9f9f9] px-4 text-sm font-medium text-black outline-none placeholder:text-black/25 focus:border-black focus:bg-white transition"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">
              Contraseña
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              className="h-12 w-full rounded-xl border border-black/12 bg-[#f9f9f9] px-4 text-sm font-medium text-black outline-none placeholder:text-black/25 focus:border-black focus:bg-white transition"
            />
          </div>

          {error && (
            <p className="text-center text-[11px] font-bold text-red-500">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !form.username || !form.password}
            className="mt-2 w-full rounded-full bg-black py-3.5 text-[12px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
      </div>
    </div>
  );
}