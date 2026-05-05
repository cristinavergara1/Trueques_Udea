import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Tag, Flag, MessageCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import ReportModal from "../components/ReportModal";
import { publicationsAPI } from "../services/api";
import { getUserInitials } from "../utils/getUserInitials";

type PublicationDTO = {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  categoria: string;
  tipo: string;
  condiciones: string;
  imagen?: string | null;
  nombreUsuario?: string | null;
};

export default function PublicationDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [reportModal, setReportModal] = useState(false);
  const [propuestaModal, setPropuestaModal] = useState(false);

  const publicationId = useMemo(() => {
    const raw = params?.id;
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, [params]);

  const [publication, setPublication] = useState<PublicationDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (publicationId === null) {
      setError("ID de publicación inválido");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    publicationsAPI
      .getById(publicationId)
      .then((res) => {
        if (cancelled) return;
        setPublication(res.data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.message || "No se pudo cargar la publicación");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [publicationId]);

  const publisherName = publication?.nombreUsuario || "";
  const publisherInitials = getUserInitials({ nombre: publisherName });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/publicaciones")}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 mb-6 text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Volver a publicaciones
        </button>

        {loading && <p className="text-sm text-gray-500">Cargando...</p>}
        {!loading && error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && publication && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Image */}
          {publication.imagen && (
            <img
              src={publication.imagen}
              alt={publication.titulo}
              className="w-full h-80 object-cover"
            />
          )}

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>
                  {publication.titulo}
                </h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    <Tag size={11} />
                    {publication.categoria}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {publication.tipo}
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full" style={{ fontWeight: 500 }}>
                    {publication.estado}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setReportModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 rounded-md text-xs hover:bg-red-50 transition-colors flex-shrink-0"
                style={{ fontWeight: 500 }}
              >
                <Flag size={12} /> Reportar
              </button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-sm text-gray-900 mb-2" style={{ fontWeight: 600 }}>Descripción</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{publication.descripcion}</p>
            </div>

            {/* Looking for */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h2 className="text-sm text-gray-900 mb-2" style={{ fontWeight: 600 }}>Busca intercambiar por:</h2>
              <p className="text-sm text-gray-600">{publication.condiciones}</p>
            </div>

            {/* User info */}
            <div className="border-t border-gray-100 pt-5 mb-6">
              <h2 className="text-sm text-gray-900 mb-3" style={{ fontWeight: 600 }}>Publicado por</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1B6B35] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0" style={{ fontWeight: 600 }}>
                  {publisherInitials}
                </div>
                <div>
                  <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{publisherName || "Usuario"}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setPropuestaModal(true)}
                className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 bg-[#1B6B35] text-white rounded-md text-sm hover:bg-[#155229] transition-colors"
                style={{ fontWeight: 500 }}
              >
                Proponer intercambio
              </button>
              <button
                onClick={() => navigate("/mensajes")}
                className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 border border-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <MessageCircle size={15} />
                Enviar mensaje
              </button>
            </div>
          </div>
        </div>
        )}
      </main>

      <ReportModal
        isOpen={reportModal}
        onClose={() => setReportModal(false)}
        tipo="publicacion"
        targetName={publication?.titulo}
      />

      {/* Modal de propuesta simple */}
      {propuestaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg text-gray-900 mb-4" style={{ fontWeight: 700 }}>
              Proponer intercambio
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Describe qué puedes ofrecer a cambio de "{publication?.titulo}"
            </p>
            <textarea
              placeholder="Ejemplo: Tengo libros de física que puedo intercambiar..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35] resize-none mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setPropuestaModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setPropuestaModal(false);
                  alert("Propuesta enviada exitosamente");
                }}
                className="flex-1 px-4 py-2.5 bg-[#1B6B35] text-white rounded-md text-sm hover:bg-[#155229] transition-colors"
                style={{ fontWeight: 500 }}
              >
                Enviar propuesta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
