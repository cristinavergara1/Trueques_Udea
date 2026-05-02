import { useState } from "react";
import { X, AlertCircle } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: "publicacion" | "usuario";
  targetName: string;
}

const MOTIVOS_PUBLICACION = [
  "Contenido inapropiado",
  "Información falsa o engañosa",
  "Artículo prohibido",
  "Spam o publicidad",
  "Duplicado",
  "Otro",
];

const MOTIVOS_USUARIO = [
  "Comportamiento inapropiado",
  "Acoso o intimidación",
  "No cumple con intercambios",
  "Suplantación de identidad",
  "Spam",
  "Otro",
];

export default function ReportModal({ isOpen, onClose, tipo, targetName }: ReportModalProps) {
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const motivos = tipo === "publicacion" ? MOTIVOS_PUBLICACION : MOTIVOS_USUARIO;

  const handleSubmit = () => {
    if (!motivo) {
      alert("Por favor selecciona un motivo");
      return;
    }
    if (!descripcion.trim()) {
      alert("Por favor describe el problema");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setMotivo("");
      setDescripcion("");
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        {!submitted ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-gray-900" style={{ fontWeight: 700 }}>
                Reportar {tipo === "publicacion" ? "publicación" : "usuario"}
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mb-5 flex items-start gap-2">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Estás reportando: <span style={{ fontWeight: 600 }}>{targetName}</span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2" style={{ fontWeight: 500 }}>
                Motivo del reporte
              </label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35] bg-white"
              >
                <option value="">Selecciona un motivo</option>
                {motivos.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm text-gray-700 mb-2" style={{ fontWeight: 500 }}>
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe el problema con detalle..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35] resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Enviar reporte
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2" style={{ fontWeight: 600 }}>
              Reporte enviado
            </h3>
            <p className="text-sm text-gray-500">
              Revisaremos tu reporte y tomaremos las medidas necesarias.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
