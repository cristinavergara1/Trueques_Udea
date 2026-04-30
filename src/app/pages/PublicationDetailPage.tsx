import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Calendar, User, Tag, Flag, MessageCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import ReportModal from "../components/ReportModal";

// Mock data - en producción vendría de la URL/API
const PUBLICATION = {
  id: 1,
  titulo: "Calculadora Científica Casio",
  categoria: "Tecnología",
  tipo: "Bien",
  descripcion: "Calculadora Casio FX-991 en excelente estado. Perfecta para cálculo e ingeniería. Incluye manual de usuario y estuche protector. La he usado durante 2 semestres pero ahora necesito una más avanzada. Funciona perfectamente, todas las funciones operativas. Ideal para estudiantes de ingeniería, matemáticas o física.",
  estado: "Disponible",
  usuario: "Carlos Restrepo",
  programa: "Ingeniería Mecánica",
  email: "carlos.restrepo@udea.edu.co",
  fecha: "2/4/2026",
  imagen: "https://images.unsplash.com/photo-1694753736023-ddad6cfc8263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  buscaIntercambio: "Libros de física o matemáticas, tutorías de programación, o artículos de tecnología.",
};

export default function PublicationDetailPage() {
  const navigate = useNavigate();
  const [reportModal, setReportModal] = useState(false);
  const [propuestaModal, setPropuestaModal] = useState(false);

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

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Image */}
          {PUBLICATION.imagen && (
            <img
              src={PUBLICATION.imagen}
              alt={PUBLICATION.titulo}
              className="w-full h-80 object-cover"
            />
          )}

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>
                  {PUBLICATION.titulo}
                </h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    <Tag size={11} />
                    {PUBLICATION.categoria}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {PUBLICATION.tipo}
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full" style={{ fontWeight: 500 }}>
                    {PUBLICATION.estado}
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
              <p className="text-sm text-gray-600 leading-relaxed">{PUBLICATION.descripcion}</p>
            </div>

            {/* Looking for */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h2 className="text-sm text-gray-900 mb-2" style={{ fontWeight: 600 }}>Busca intercambiar por:</h2>
              <p className="text-sm text-gray-600">{PUBLICATION.buscaIntercambio}</p>
            </div>

            {/* User info */}
            <div className="border-t border-gray-100 pt-5 mb-6">
              <h2 className="text-sm text-gray-900 mb-3" style={{ fontWeight: 600 }}>Publicado por</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1B6B35] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0" style={{ fontWeight: 600 }}>
                  CR
                </div>
                <div>
                  <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{PUBLICATION.usuario}</p>
                  <p className="text-xs text-gray-500">{PUBLICATION.programa}</p>
                  <p className="text-xs text-gray-400">{PUBLICATION.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                <Calendar size={11} />
                Publicado el {PUBLICATION.fecha}
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
      </main>

      <ReportModal
        isOpen={reportModal}
        onClose={() => setReportModal(false)}
        tipo="publicacion"
        targetName={PUBLICATION.titulo}
      />

      {/* Modal de propuesta simple */}
      {propuestaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg text-gray-900 mb-4" style={{ fontWeight: 700 }}>
              Proponer intercambio
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Describe qué puedes ofrecer a cambio de "{PUBLICATION.titulo}"
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
