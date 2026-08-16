"use client";

import { useState, useEffect, useRef, FormEvent } from "react";

type DemoModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormState = {
  name: string;
  email: string;
  org: string;
  phone: string;
  message: string;
};

const EMPTY: FormState = { name: "", email: "", org: "", phone: "", message: "" };

export default function DemoModal({ open, onClose }: DemoModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Reset state every time the modal opens
  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setError(null);
      setDone(false);
      setSubmitting(false);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Trap scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          data?.message?.toString().split(",")[0] ?? // class-validator returns array
          data?.message?.toString() ??
          `Error ${res.status}`;
        throw new Error(msg);
      }

      setDone(true);
      setTimeout(() => onClose(), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0e0e0e]/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg rounded-3xl bg-[#1c1b1b] border border-[#2a2a2a] shadow-2xl shadow-[#00a8ff]/10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
          <div>
            <h3 id="demo-modal-title" className="text-xl font-bold text-white font-headline">
              Solicitar Demostración
            </h3>
            <p className="text-xs text-[#bec7d3] mt-1">
              Te contactamos en menos de 24 horas hábiles.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#bec7d3] hover:text-white transition-colors p-2 -mr-2"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#00d4aa]/15 border border-[#00d4aa]/30 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[#00d4aa] text-3xl">check_circle</span>
            </div>
            <h4 className="text-lg font-bold text-white font-headline mb-2">¡Solicitud enviada!</h4>
            <p className="text-sm text-[#bec7d3]">
              Recibirás un correo con los próximos pasos.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Nombre"
                required
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Tu nombre"
              />
              <Field
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="tu@email.com"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Organización"
                required
                value={form.org}
                onChange={(v) => setForm({ ...form, org: v })}
                placeholder="Nombre de tu ONG"
              />
              <Field
                label="Teléfono"
                type="tel"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="+56 9 ..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#bec7d3] mb-2 uppercase tracking-wider">
                Mensaje <span className="text-[#bec7d3]/50">(opcional)</span>
              </label>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Cuéntanos brevemente qué módulos te interesan..."
                className="w-full px-4 py-3 rounded-xl bg-[#0e0e0e] border border-[#2a2a2a] text-white placeholder-[#bec7d3]/40 focus:border-[#00a8ff]/50 focus:outline-none transition-colors resize-none text-sm"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00a8ff] to-[#00d4aa] text-[#003352] font-bold text-base hover:opacity-95 transition-all shadow-lg shadow-[#00a8ff]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <span>Enviar Solicitud</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-[#bec7d3]/60 text-center">
              Al enviar aceptas recibir contacto comercial. No compartimos tus datos.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

function Field({ label, value, onChange, type = "text", required, placeholder }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#bec7d3] mb-2 uppercase tracking-wider">
        {label}
        {required && <span className="text-[#00a8ff] ml-1">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-[#0e0e0e] border border-[#2a2a2a] text-white placeholder-[#bec7d3]/40 focus:border-[#00a8ff]/50 focus:outline-none transition-colors text-sm"
      />
    </div>
  );
}
