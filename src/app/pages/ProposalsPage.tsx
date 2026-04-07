import { useState } from "react";
import { Check, X, Clock, Handshake } from "lucide-react";
import Navbar from "../components/Navbar";

const PROPOSALS = [
  {
    id: 1,
    tipo: "recibida",
    publicacion: "Calculadora Científica Casio",
    proponente: "Juan Pérez",
    programa: "Ingeniería de Sistemas",
    mensaje: "Hola! Tengo libros de cálculo y física que puedo intercambiar por tu calculadora. Son de la editorial Stewart, en muy buen estado.",
    estado: "pendiente",
    fecha: "5/4/2026",
  },
  {
    id: 2,
    tipo: "recibida",
    publicacion: "Calculadora Científica Casio",
    proponente: "Ana Rodríguez",
    programa: "Matemáticas",
    mensaje: "Me interesa mucho la calculadora. Puedo ofrecerte tutorías de álgebra lineal a cambio, tengo amplia experiencia.",
    estado: "pendiente",
    fecha: "6/4/2026",
  },
  {
    id: 3,
    tipo: "enviada",
    publicacion: "Clases de Programación Python",
    proponente: "María González",
    programa: "Ingeniería de Sistemas",
    mensaje: "Hola María! Me interesa aprender Python. A cambio puedo ofrecerte clases de diseño gráfico y Figma.",
    estado: "aceptada",
    fecha: "3/4/2026",
  },
  {
    id: 4,
    tipo: "enviada",
    publicacion: "Libro: Cien Años de Soledad",
    proponente: "Andrea López",
    programa: "Literatura",
    mensaje: "Andrea, tengo otro libro de García Márquez que podríamos intercambiar. ¿Te interesa El Amor en los Tiempos del Cólera?",
    estado: "rechazada",
    fecha: "2/4/2026",
  },
];

const ESTADO_CONFIG: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  pendiente: { color: "bg-yellow-100 text-yellow-700", label: "Pendiente", icon: <Clock size={12} /> },
  aceptada: { color: "bg-green-100 text-green-700", label: "Aceptada", icon: <Check size={12} /> },
  rechazada: { color: "bg-red-100 text-red-700", label: "Rechazada", icon: <X size={12} /> },
};

export default function ProposalsPage() {
  const [tab, setTab] = useState<"recibidas" | "enviadas">("recibidas");
  const [proposals, setProposals] = useState(PROPOSALS);

  const filtradas = proposals.filter((p) =>
    tab === "recibidas" ? p.tipo === "recibida" : p.tipo === "enviada"
  );

  const updateEstado = (id: number, estado: string) => {
    setProposals((prev) => prev.map((p) => p.id === id ? { ...p, estado } : p));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>Propuestas de intercambio</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona tus propuestas recibidas y enviadas</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
          <button
            onClick={() => setTab("recibidas")}
            className={`px-5 py-2 rounded-md text-sm transition-colors ${
              tab === "recibidas" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
            style={{ fontWeight: tab === "recibidas" ? 600 : 400 }}
          >
            Recibidas ({proposals.filter((p) => p.tipo === "recibida").length})
          </button>
          <button
            onClick={() => setTab("enviadas")}
            className={`px-5 py-2 rounded-md text-sm transition-colors ${
              tab === "enviadas" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
            style={{ fontWeight: tab === "enviadas" ? 600 : 400 }}
          >
            Enviadas ({proposals.filter((p) => p.tipo === "enviada").length})
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {filtradas.map((p) => {
            const cfg = ESTADO_CONFIG[p.estado];
            return (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      {tab === "recibidas" ? "Propuesta para:" : "Tu propuesta sobre:"}
                    </p>
                    <h3 className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{p.publicacion}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {tab === "recibidas" ? `De: ${p.proponente}` : `A: ${p.proponente}`} · {p.programa}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${cfg.color}`} style={{ fontWeight: 500 }}>
                      {cfg.icon} {cfg.label}
                    </span>
                    <span className="text-xs text-gray-400">{p.fecha}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg px-4 py-3 mb-3">
                  <p className="text-sm text-gray-600 leading-relaxed">"{p.mensaje}"</p>
                </div>

                {tab === "recibidas" && p.estado === "pendiente" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateEstado(p.id, "aceptada")}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#1B6B35] text-white rounded-md text-xs hover:bg-[#155229] transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      <Check size={13} /> Aceptar
                    </button>
                    <button
                      onClick={() => updateEstado(p.id, "rechazada")}
                      className="flex items-center gap-1.5 px-4 py-2 border border-red-300 text-red-600 rounded-md text-xs hover:bg-red-50 transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      <X size={13} /> Rechazar
                    </button>
                  </div>
                )}

                {p.estado === "aceptada" && (
                  <div className="flex items-center gap-1.5 text-xs text-[#1B6B35]" style={{ fontWeight: 500 }}>
                    <Handshake size={14} /> ¡Intercambio acordado! Coordina los detalles por mensajes.
                  </div>
                )}
              </div>
            );
          })}

          {filtradas.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-sm">No tienes propuestas {tab} aún.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
