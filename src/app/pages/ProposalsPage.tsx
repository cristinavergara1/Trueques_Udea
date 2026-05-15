import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, X, Clock, Handshake } from "lucide-react";
import Navbar from "../components/Navbar";
import RatingModal from "../components/RatingModal";

import { proposalsAPI } from "../services/api";

type BackendProposalDTO = {
  id: number;
  oferta: string;
  mensaje?: string | null;
  estado: string;
  fechaCreacion?: string;
  fechaDecision?: string | null;
  usuarioOrigen?: string | null;
  usuarioDestino?: string | null;
  publicacionId?: number;
  tituloPublicacion?: { titulo?: string } | null;
};

type ProposalView = {
  id: number;
  tipo: "recibida" | "enviada";
  publicacion: string;
  publicacionId?: number;
  proponente: string;
  programa: string;
  oferta: string;
  mensaje: string;
  estado: "pendiente" | "aceptada" | "rechazada" | "finalizado" | "cancelado";
  createdAt: string;
  acceptedAt: string | null;
  completedAt: string | null;
  calificado: boolean;
};

function mapEstado(estado?: string): ProposalView["estado"] {
  const normalized = (estado || "").trim().toUpperCase();
  if (normalized === "ACEPTADA") return "aceptada";
  if (normalized === "RECHAZADA") return "rechazada";
  if (normalized === "PENDIENTE") return "pendiente";

  // compatibilidad si algún backend envía minúsculas
  const lower = (estado || "").trim().toLowerCase();
  if (lower === "aceptada" || lower === "aceptado") return "aceptada";
  if (lower === "rechazada" || lower === "rechazado") return "rechazada";
  if (lower === "pendiente") return "pendiente";

  return "pendiente";
}

function toView(dto: BackendProposalDTO, tipo: ProposalView["tipo"]): ProposalView {
  const titulo = dto?.tituloPublicacion?.titulo || (dto.publicacionId ? `Publicación #${dto.publicacionId}` : "Publicación");
  const createdAt = dto.fechaCreacion || new Date().toISOString();
  const estado = mapEstado(dto.estado);
  const proponente = tipo === "recibida" ? (dto.usuarioOrigen || "Usuario") : (dto.usuarioDestino || "Usuario");
  return {
    id: dto.id,
    tipo,
    publicacion: titulo,
    publicacionId: dto.publicacionId,
    proponente,
    programa: "—",
    oferta: dto.oferta || "",
    mensaje: (dto.mensaje || "").toString(),
    estado,
    createdAt,
    acceptedAt: dto.fechaDecision || null,
    completedAt: null,
    calificado: false,
  };
}

const ESTADO_CONFIG: Record<string, { color: string; label: string; icon: ReactNode }> = {
  pendiente: { color: "bg-yellow-100 text-yellow-700", label: "Pendiente", icon: <Clock size={12} /> },
  aceptada: { color: "bg-green-100 text-green-700", label: "Aceptada", icon: <Check size={12} /> },
  rechazada: { color: "bg-red-100 text-red-700", label: "Rechazada", icon: <X size={12} /> },
  finalizado: { color: "bg-blue-100 text-blue-700", label: "Finalizado", icon: <Check size={12} />,},
  cancelado: { color: "bg-gray-200 text-gray-600", label: "Cancelado", icon: <X size={12} />, },
};

export default function ProposalsPage() {
  const [tab, setTab] = useState<"recibidas" | "enviadas">("recibidas");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [proposals, setProposals] = useState<ProposalView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [counts, setCounts] = useState({ recibidas: 0, enviadas: 0 });
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

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const request = tab === "recibidas" ? proposalsAPI.getReceived() : proposalsAPI.getSent();
    request
      .then((res) => {
        if (cancelled) return;
        const data = Array.isArray(res.data) ? (res.data as BackendProposalDTO[]) : [];
        const mapped = data.map((dto) => toView(dto, tab === "recibidas" ? "recibida" : "enviada"));
        setProposals(mapped);
      })
      .catch((err: any) => {
        if (cancelled) return;
        setProposals([]);
        setError(err?.response?.data?.message || "No se pudieron cargar las propuestas");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab]);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([proposalsAPI.getReceived(), proposalsAPI.getSent()])
      .then(([rec, sent]) => {
        if (cancelled) return;
        const recibidas = rec.status === "fulfilled" && Array.isArray(rec.value.data) ? rec.value.data.length : 0;
        const enviadas = sent.status === "fulfilled" && Array.isArray(sent.value.data) ? sent.value.data.length : 0;
        setCounts({ recibidas, enviadas });
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (date: string) => {
  return new Date(date).toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

  const filtradas = useMemo(() => {
    return proposals.filter((p) => {
      const matchTab = tab === "recibidas" ? p.tipo === "recibida" : p.tipo === "enviada";
      const matchEstado = filtroEstado === "todos" || p.estado === filtroEstado;
      return matchTab && matchEstado;
    });
  }, [proposals, tab, filtroEstado]);

  const updateEstado = async (id: number, nuevoEstado: ProposalView["estado"]) => {
    // Para estados soportados por backend, solo el dueño (recibidas) gestiona.
    const isBackendManaged = nuevoEstado === "aceptada" || nuevoEstado === "rechazada";

    if (isBackendManaged) {
      if (tab !== "recibidas") return;

      if (nuevoEstado === "aceptada") {
        const propuestaActual = proposals.find((p) => p.id === id);
        const yaExisteAceptada = proposals.some(
          (p) => p.publicacionId != null && p.publicacionId === propuestaActual?.publicacionId && p.estado === "aceptada"
        );
        if (yaExisteAceptada) {
          alert("Ya hay una propuesta aceptada para esta publicación");
          return;
        }
      }

      try {
        const estadoBackend = nuevoEstado === "aceptada" ? "ACEPTADA" : "RECHAZADA";
        await proposalsAPI.manage(id, estadoBackend);
      } catch (err: any) {
        alert(err?.response?.data?.message || "No se pudo actualizar el estado");
        return;
      }
    }

    // Actualización local de UI
    setProposals((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              estado: nuevoEstado,
              acceptedAt: nuevoEstado === "aceptada" ? new Date().toISOString() : p.acceptedAt,
              completedAt: nuevoEstado === "finalizado" ? new Date().toISOString() : p.completedAt,
            }
          : p
      )
    );
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
            Recibidas ({counts.recibidas})
          </button>
          <button
            onClick={() => setTab("enviadas")}
            className={`px-5 py-2 rounded-md text-sm transition-colors ${
              tab === "enviadas" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
            style={{ fontWeight: tab === "enviadas" ? 600 : 400 }}
          >
            Enviadas ({counts.enviadas})
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

        {loading && <p className="text-sm text-gray-500">Cargando propuestas...</p>}
        {!loading && error && <p className="text-sm text-red-500">{error}</p>}

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
                  {p.oferta && (
                    <p className="text-sm text-gray-700 mb-2" style={{ fontWeight: 600 }}>
                      Oferta: <span className="text-gray-600" style={{ fontWeight: 400 }}>{p.oferta}</span>
                    </p>
                  )}
                  {p.mensaje ? (
                    <p className="text-sm text-gray-600 leading-relaxed">"{p.mensaje}"</p>
                  ) : (
                    <p className="text-sm text-gray-400">Sin mensaje</p>
                  )}
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
