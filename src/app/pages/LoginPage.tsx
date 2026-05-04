import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock } from "lucide-react";
import { authAPI } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.correo.endsWith("@udea.edu.co")) {
      setError("Solo se permiten correos @udea.edu.co");
      return;
    }
    setLoading(true);
    try {
      const response = await authAPI.login(form.correo, form.password);
  // Guardar token y usuario en localStorage (evita guardar "undefined")
  const token = response.data?.token ?? response.data?.accessToken;

  // Algunos backends envuelven la respuesta (data/response/usuario)
  const user =
    response.data?.usuario ??
    response.data?.user ??
    response.data?.data?.usuario ??
    response.data?.data?.user ??
    response.data?.response?.usuario ??
    response.data?.response?.user;

  if (token) localStorage.setItem("token", String(token));
  if (user) localStorage.setItem("user", JSON.stringify(user));

  // Si el backend no devuelve el usuario, como mínimo deja un objeto para no romper flujo.
  // (Ideal: backend devuelva usuario con id)
  if (!user) {
    localStorage.removeItem("user");
  }
      navigate("/publicaciones");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity"
      >
        <div className="w-12 h-12 bg-[#1B6B35] rounded-full flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 1l4 4-4 4"/>
            <path d="M3 11V9a4 4 0 014-4h14"/>
            <path d="M7 23l-4-4 4-4"/>
            <path d="M21 13v2a4 4 0 01-4 4H3"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "#1B6B35" }}>TruequeUdeA</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Volver al inicio
          </button>
        </div>
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
