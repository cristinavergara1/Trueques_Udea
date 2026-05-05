import { useEffect, useState } from "react";
import { Star, Package, CheckCircle, TrendingUp, Flag } from "lucide-react";
import Navbar from "../components/Navbar";
import ReportModal from "../components/ReportModal";

const API = "https://backendproyectotruequesuniversitarios.onrender.com";

export default function ProfilePage() {

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser?.id || storedUser?.usuario?.id;

  // Usuario
  useEffect(() => {
    if (!userId) return;

    fetch(`${API}/api/usuarios/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    fetch(`${API}/api/usuarios/${userId}/estadisticas`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, [userId]);

  const [reportModal, setReportModal] = useState(false);

  const mockRatings = [ { id: 1, de: "Juan Pérez", estrellas: 5, comentario: "Excelente intercambio", fecha: "2026-04-20" }, { id: 2, de: "Laura Gómez", estrellas: 4, comentario: "Todo bien, recomendado", fecha: "2026-04-18" } ];

  if (!userId) return <p>No hay usuario logueado</p>;
  if (!user || !stats) return <p>Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-[#1B6B35] rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0" style={{ fontWeight: 600 }}>
                MG
              </div>
              <div>
                <h1 className="text-xl text-gray-900 mb-1" style={{ fontWeight: 700 }}>
                  {user?.nombre}
                </h1>
                <p className="text-sm text-gray-500 mb-1">{user?.programa}</p>
                <p className="text-xs text-gray-400">{user?.correo}</p>
                <p className="text-xs text-gray-400 mt-1">Miembro desde {user?.miembro_desde}</p>
              </div>
            </div>
            <button
              onClick={() => setReportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 rounded-md text-xs hover:bg-red-50 transition-colors"
              style={{ fontWeight: 500 }}
            >
              <Flag size={12} /> Reportar
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-6">
          <h2 className="text-lg text-gray-900 mb-3" style={{ fontWeight: 700 }}>Estadísticas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>
                    {stats.totalIntercambios}
                  </p>
                  <p className="text-xs text-gray-500">Total intercambios</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>
                    {stats.intercambiosCompletados}
                  </p>
                  <p className="text-xs text-gray-500">Completados</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Star size={20} className="text-amber-500" fill="#F59E0B" />
                </div>
                <div>
                  <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>
                    {stats.calificacionPromedio}
                  </p>
                  <p className="text-xs text-gray-500">Calificación promedio</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div> 
          <h2 className="text-lg text-gray-900 mb-3"> 
            Calificaciones recibidas ({mockRatings.length}) 
          </h2>           
          <div className="flex flex-col gap-3"> 
            {mockRatings.map((cal) => ( 
              <div key={cal.id} className="bg-white border border-gray-200 rounded-xl p-4"> 
                <div className="flex items-start justify-between gap-3 mb-2"> 
                  <div> 
                    <p className="text-sm text-gray-900 font-semibold"> 
                      {cal.de} 
                    </p> 
                    <div className="flex gap-0.5 mt-1"> 
                      {[...Array(5)].map((_, i) => ( 
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < cal.estrellas ? "#F2A900" : "none"} 
                          stroke={i < cal.estrellas ? "#F2A900" : "#D1D5DB"} 
                        /> 
                      ))} 
                    </div> 
                  </div> 
                  <span className="text-xs text-gray-400"> 
                    {cal.fecha} 
                  </span> 
                </div> 
                {cal.comentario && ( 
                  <p className="text-sm text-gray-600"> 
                    {cal.comentario} 
                  </p> 
                )} 
              </div> 
            ))} 
          </div> 
        </div>
      </main>

      <ReportModal
        isOpen={reportModal}
        onClose={() => setReportModal(false)}
        tipo="usuario"
        targetName={user?.nombre}
      />
    </div>
  );
}
