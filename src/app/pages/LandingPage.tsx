import { useNavigate } from "react-router";
import { ArrowRight, RefreshCw, Shield, Zap } from "lucide-react";
import Navbar from "../components/Navbar";

const HERO_IMAGE = "https://images.unsplash.com/photo-1718327453695-4d32b94c90a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBzdHVkeWluZyUyMGxpYnJhcnl8ZW58MXx8fHwxNzc1NTcwMTI1fDA&ixlib=rb-4.1.0&q=80&w=1080";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl sm:text-4xl text-gray-900 mb-4 leading-tight" style={{ fontWeight: 700 }}>
          Intercambia bienes y servicios con<br />la comunidad UdeA
        </h1>
        <p className="text-gray-500 text-base mb-8 max-w-lg mx-auto">
          Una plataforma de trueques diseñada para estudiantes universitarios.{" "}
          <span className="text-[#1B6B35]" style={{ fontWeight: 600 }}>Sin dinero</span>, solo
          intercambios <span style={{ fontWeight: 600 }}>justos</span> entre{" "}
          <span className="text-[#1B6B35]" style={{ fontWeight: 600 }}>compañeros</span>.
        </p>
        <button
          onClick={() => navigate("/registro")}
          className="inline-flex items-center gap-2 bg-[#1B6B35] text-white px-6 py-2.5 rounded-md hover:bg-[#155229] transition-colors text-sm"
          style={{ fontWeight: 500 }}
        >
          Comenzar ahora
          <ArrowRight size={16} />
        </button>

        {/* Hero image */}
        <div className="mt-10 rounded-2xl overflow-hidden shadow-lg max-w-2xl mx-auto">
          <img
            src={HERO_IMAGE}
            alt="Estudiantes intercambiando"
            className="w-full h-64 object-cover"
          />
        </div>
      </main>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
            <RefreshCw size={22} className="text-[#1B6B35]" />
          </div>
          <h3 className="text-[#1B6B35] text-sm" style={{ fontWeight: 700 }}>Intercambios Justos</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            Intercambia bienes, servicios o habilidades sin necesidad de dinero.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-yellow-50 border-2 border-yellow-200 rounded-full flex items-center justify-center">
            <Shield size={22} className="text-yellow-600" />
          </div>
          <h3 className="text-[#1B6B35] text-sm" style={{ fontWeight: 700 }}>Comunidad Confiable</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            Solo usuarios con correo institucional @udea.edu.co pueden participar.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
            <Zap size={22} className="text-[#1B6B35]" />
          </div>
          <h3 className="text-[#1B6B35] text-sm" style={{ fontWeight: 700 }}>Fácil de Usar</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            Publica, busca y propón intercambios en pocos clics.
          </p>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-[#1B6B35] py-10 text-center">
        <h2 className="text-white text-xl" style={{ fontWeight: 700 }}>¿Listo para comenzar a intercambiar?</h2>
        <p className="text-green-200 text-sm mt-2 mb-6">Únete a cientos de estudiantes de la UdeA</p>
        <button
          onClick={() => navigate("/registro")}
          className="bg-white text-[#1B6B35] px-6 py-2.5 rounded-md hover:bg-green-50 transition-colors text-sm"
          style={{ fontWeight: 600 }}
        >
          Crear cuenta gratis
        </button>
      </section>

      {/* Dev link */}
      <div className="text-center py-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => navigate("/codigo")}
          className="text-xs text-gray-400 hover:text-[#1B6B35] transition-colors underline"
        >
          📄 Ver código fuente (Next.js + Java Spring Boot)
        </button>
      </div>
    </div>
  );
}
