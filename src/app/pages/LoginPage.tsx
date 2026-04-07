import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock } from "lucide-react";
import { mockLogin, getMockUser } from "../utils/mockAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));

    // Use mock authentication
    const result = mockLogin(form.correo, form.password);

    if (result.success) {
      // Guardar usuario en localStorage
      localStorage.setItem("user", JSON.stringify(result.user));
      setLoading(false);
      navigate("/publicaciones");
    } else {
      setError(result.message || "Credenciales inválidas");
      setLoading(false);
    }
  };

  const mockUser = getMockUser();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-[#1B6B35] rounded-full flex items-center justify-center mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 1l4 4-4 4"/>
            <path d="M3 11V9a4 4 0 014-4h14"/>
            <path d="M7 23l-4-4 4-4"/>
            <path d="M21 13v2a4 4 0 01-4 4H3"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "#1B6B35" }}>TruequeUdeA</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-center text-gray-900 text-lg mb-1" style={{ fontWeight: 700 }}>Iniciar sesión</h1>
        <p className="text-center text-[#1B6B35] text-sm mb-6">Ingresa con tu correo institucional</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Correo institucional</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="tu.nombre@udea.edu.co"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Contraseña</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35] transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setForm({ correo: mockUser.email, password: mockUser.password })}
            className="text-xs text-[#1B6B35] hover:underline text-left bg-blue-50 p-2 rounded"
          >
            Usar credenciales de prueba
          </button>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B6B35] text-white py-2.5 rounded-md text-sm hover:bg-[#155229] transition-colors disabled:opacity-60"
            style={{ fontWeight: 600 }}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿No tienes cuenta?{" "}
          <button
            onClick={() => navigate("/registro")}
            className="text-[#1B6B35] hover:underline"
            style={{ fontWeight: 500 }}
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}
