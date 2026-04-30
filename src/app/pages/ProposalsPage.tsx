import { useState } from "react";
import { Check, X, Clock, Handshake } from "lucide-react";
import Navbar from "../components/Navbar";
import RatingModal from "../components/RatingModal";

const PROPOSALS = [
  {
    id: 1,
    tipo: "recibida",
    publicacion: "Calculadora Científica Casio",
    proponente: "Juan Pérez",
    programa: "Ingeniería de Sistemas",
    mensaje: "Hola! Tengo libros de cálculo y física que puedo intercambiar por tu calculadora. Son de la editorial Stewart, en muy buen estado.",
    estado: "pendiente",
    createdAt: "2026-04-05T10:00:00",
    acceptedAt: null,
    completedAt: null,
    calificado: false,
  },
  {
    id: 2,
    tipo: "recibida",
    publicacion: "Calculadora Científica Casio",
    proponente: "Ana Rodríguez",
    programa: "Matemáticas",
    mensaje: "Me interesa mucho la calculadora. Puedo ofrecerte tutorías de álgebra lineal a cambio, tengo amplia experiencia.",
    estado: "pendiente",
    createdAt: "2026-04-05T10:00:00",
    acceptedAt: null,
    completedAt: null,
    calificado: false,
  },
  {
    id: 3,
    tipo: "enviada",
    publicacion: "Clases de Programación Python",
    proponente: "María González",
    programa: "Ingeniería de Sistemas",
    mensaje: "Hola María! Me interesa aprender Python. A cambio puedo ofrecerte clases de diseño gráfico y Figma.",
    estado: "aceptada",
    createdAt: "2026-04-05T10:00:00",
    acceptedAt: null,
    completedAt: null,
    calificado: false,
  },
  {
    id: 4,
    tipo: "enviada",
    publicacion: "Libro: Cien Años de Soledad",
    proponente: "Andrea López",
    programa: "Literatura",
    mensaje: "Andrea, tengo otro libro de García Márquez que podríamos intercambiar. ¿Te interesa El Amor en los Tiempos del Cólera?",
    estado: "rechazada",
    createdAt: "2026-04-05T10:00:00",
    acceptedAt: null,
    completedAt: null,
    calificado: false,
  },
];

const ESTADO_CONFIG: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  pendiente: { color: "bg-yellow-100 text-yellow-700", label: "Pendiente", icon: <Clock size={12} /> },
  aceptada: { color: "bg-green-100 text-green-700", label: "Aceptada", icon: <Check size={12} /> },
  rechazada: { color: "bg-red-100 text-red-700", label: "Rechazada", icon: <X size={12} /> },
  finalizado: { color: "bg-blue-100 text-blue-700", label: "Finalizado", icon: <Check size={12} />,},
  cancelado: { color: "bg-gray-200 text-gray-600", label: "Cancelado", icon: <X size={12} />, },
};

export default function ProposalsPage() {
  const [tab, setTab] = useState<"recibidas" | "enviadas">("recibidas");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [proposals, setProposals] = useState(PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [ratingModal, setRatingModal] = useState({
  isOpen: false,
  proposalId: null as number | null,
  });

  const openConfirmModal = (proposal: any) => {
    setSelectedProposal(proposal);
    setShowModal(true);
  };

  const formatDate = (date: string) => {
  return new Date(date).toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

  const filtradas = proposals.filter((p) => {
  const matchTab =
    tab === "recibidas" ? p.tipo === "recibida" : p.tipo === "enviada";

  const matchEstado =
    filtroEstado === "todos" || p.estado === filtroEstado;

  return matchTab && matchEstado;
});

  const updateEstado = (id: number, nuevoEstado: string) => {
    if (nuevoEstado === "aceptada") {
      const propuestaActual = proposals.find(p => p.id === id);
      const yaExisteAceptada = proposals.some(
        (p) =>
          p.publicacion === propuestaActual?.publicacion &&
          p.estado === "aceptada"
      );
      if (yaExisteAceptada) {
        alert("Ya hay una propuesta aceptada para esta publicación");
        return;
      }
      }
  setProposals((prev) => {
    const updated = prev.map((p) =>
      p.id === id
        ? {
            ...p,
            estado: nuevoEstado,
            acceptedAt:
              nuevoEstado === "aceptada"
                ? new Date().toISOString()
              : p.acceptedAt,
            completedAt:
              nuevoEstado === "finalizado"
                ? new Date().toISOString()
                : p.completedAt,
          }
      : p
    );
    if (nuevoEstado === "aceptada") {
      const propuesta = prev.find((p) => p.id === id);
      if (propuesta) {
        const publicaciones = JSON.parse(
          localStorage.getItem("publications") || "[]"
        );
        const nuevasPublicaciones = publicaciones.map((pub: any) =>
          pub.titulo === propuesta.publicacion
            ? { ...pub, estado: "en_proceso" }
            : pub
        );
        localStorage.setItem(
          "publications",
          JSON.stringify(nuevasPublicaciones)
        );
      }
    }
    return updated;
  });
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
        <div className="flex gap-2 mb-6 flex-wrap">
          {["todos", "pendiente", "aceptada", "rechazada", "finalizado", "cancelado"].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={`px-3 py-1 rounded-md text-xs ${
                filtroEstado === estado
                  ? "bg-[#1B6B35] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </button>
          ))}
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
                    <div className="text-xs text-gray-400 text-right">
                      <p>Enviada: {formatDate(p.createdAt)}</p>
                      {p.acceptedAt && (
                        <p>Aceptada: {formatDate(p.acceptedAt)}</p>
                      )}
                      {p.completedAt && (
                        <p>Finalizada: {formatDate(p.completedAt)}</p>
                      )}
                  </div>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => openConfirmModal(p)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-md text-xs hover:bg-blue-700"
                    >
                      Confirmar intercambio
                    </button>
                    <button
                      onClick={() => updateEstado(p.id, "cancelado")}
                      className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-md text-xs hover:bg-gray-200"
                    >
                      No se completó
                    </button>
                  </div>
                )}
                {p.estado === "finalizado" && !p.calificado && (
                  <button
                    onClick={() =>
                      setRatingModal({ isOpen: true, proposalId: p.id })
                    }
                    className="w-full bg-yellow-100 text-yellow-700 py-2 rounded-md text-xs hover:bg-yellow-200 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    Calificar intercambio
                  </button>
                )}
                {p.estado === "finalizado" && p.calificado && (
                  <div className="text-xs text-green-600 mt-2">
                    Ya calificaste este intercambio
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
      {showModal && selectedProposal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">      
            <h2 className="text-lg font-semibold mb-4">
              Confirmar intercambio
            </h2>
            <div className="text-sm text-gray-600 space-y-2 mb-4">
              <p><strong>Publicación:</strong> {selectedProposal.publicacion}</p>
              <p><strong>Usuario:</strong> {selectedProposal.proponente}</p>
              <p><strong>Programa:</strong> {selectedProposal.programa}</p>
              <p><strong>Fecha:</strong> {formatDate(new Date().toISOString())}</p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-gray-100 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  updateEstado(selectedProposal.id, "finalizado");
                  setShowModal(false);
                }}
                className="px-4 py-2 text-sm bg-[#1B6B35] text-white rounded-md"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() =>
          setRatingModal({ isOpen: false, proposalId: null })
        }
        onSubmit={(rating: number, comment: string) => {
          if (ratingModal.proposalId) {
            setProposals((prev) =>
              prev.map((p) =>
                p.id === ratingModal.proposalId
                  ? { ...p, calificado: true }
                  : p
              )
            );
          }

          setRatingModal({ isOpen: false, proposalId: null });
         }}
        />
    </div>
  );
}
