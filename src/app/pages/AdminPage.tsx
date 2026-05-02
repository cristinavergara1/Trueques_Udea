import { useState } from "react";
import { AlertCircle, Eye, Check, X, Shield } from "lucide-react";
import Navbar from "../components/Navbar";

const REPORTS = [
  {
    id: 1,
    tipo: "publicacion",
    reportado: "Calculadora Científica Casio",
    reportadoPor: "Andrea López",
    motivo: "Información falsa o engañosa",
    descripcion: "La calculadora no está en el estado descrito, tiene daños que no se mencionan.",
    fecha: "28/4/2026",
    estado: "pendiente",
  },
  {
    id: 2,
    tipo: "usuario",
    reportado: "Pedro Martínez",
    reportadoPor: "Laura Sánchez",
    motivo: "No cumple con intercambios",
    descripcion: "Acordamos un intercambio hace una semana y no se ha presentado ni responde mensajes.",
    fecha: "27/4/2026",
    estado: "pendiente",
  },
  {
    id: 3,
    tipo: "publicacion",
    reportado: "Clases de Programación Python",
    reportadoPor: "Carlos Restrepo",
    motivo: "Spam o publicidad",
    descripcion: "Está promocionando un curso pago externo, no es un intercambio real.",
    fecha: "26/4/2026",
    estado: "revisado",
  },
  {
    id: 4,
    tipo: "usuario",
    reportado: "Juan Pérez",
    reportadoPor: "María González",
    motivo: "Comportamiento inapropiado",
    descripcion: "Mensajes ofensivos en el chat cuando rechacé su propuesta.",
    fecha: "25/4/2026",
    estado: "cerrado",
  },
];

const ESTADO_COLORS: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  revisado: "bg-blue-100 text-blue-700",
  cerrado: "bg-gray-100 text-gray-600",
};

export default function AdminPage() {
  const [reports, setReports] = useState(REPORTS);
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterTipo, setFilterTipo] = useState("Todos");

  const updateEstado = (id: number, estado: string) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, estado } : r)));
  };

  const filtered = reports.filter((r) => {
    const matchEstado = filterEstado === "Todos" || r.estado === filterEstado.toLowerCase();
    const matchTipo = filterTipo === "Todos" || r.tipo === filterTipo.toLowerCase();
    return matchEstado && matchTipo;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Shield size={22} className="text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>Panel de Administración</h1>
            <p className="text-gray-500 text-sm">Gestiona reportes de la comunidad</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3">
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="flex-1 min-w-40 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-[#1B6B35] bg-white"
          >
            {["Todos", "Pendiente", "Revisado", "Cerrado"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="flex-1 min-w-40 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-[#1B6B35] bg-white"
          >
            {["Todos", "Publicacion", "Usuario"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} reportes</p>

        {/* Reports Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-600" style={{ fontWeight: 600 }}>Tipo</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600" style={{ fontWeight: 600 }}>Reportado</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600" style={{ fontWeight: 600 }}>Motivo</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600" style={{ fontWeight: 600 }}>Por</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600" style={{ fontWeight: 600 }}>Fecha</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600" style={{ fontWeight: 600 }}>Estado</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600" style={{ fontWeight: 600 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        <AlertCircle size={11} />
                        {report.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900" style={{ fontWeight: 500 }}>
                      {report.reportado}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-xs">
                      <div className="line-clamp-1">{report.motivo}</div>
                      <div className="text-gray-400 line-clamp-1 mt-0.5">{report.descripcion}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{report.reportadoPor}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{report.fecha}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${ESTADO_COLORS[report.estado]}`} style={{ fontWeight: 500 }}>
                        {report.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {report.estado === "pendiente" && (
                          <>
                            <button
                              onClick={() => updateEstado(report.id, "revisado")}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Marcar como revisado"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => updateEstado(report.id, "cerrado")}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Cerrar reporte"
                            >
                              <Check size={14} />
                            </button>
                          </>
                        )}
                        {report.estado === "revisado" && (
                          <button
                            onClick={() => updateEstado(report.id, "cerrado")}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Cerrar reporte"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-sm">No hay reportes con estos filtros.</p>
          </div>
        )}
      </main>
    </div>
  );
}
