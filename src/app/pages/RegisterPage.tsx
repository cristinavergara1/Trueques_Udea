import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, User, BookOpen } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "", apellido: "", correo: "", programa: "", password: "", confirmar: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nombre) e.nombre = "Requerido";
    if (!form.apellido) e.apellido = "Requerido";
    if (!form.correo.endsWith("@udea.edu.co")) e.correo = "Solo se permiten correos @udea.edu.co";
    if (!form.programa) e.programa = "Requerido";
    if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (form.password !== form.confirmar) e.confirmar = "Las contraseñas no coinciden";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    navigate("/publicaciones");
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
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
        <h1 className="text-center text-gray-900 text-lg mb-1" style={{ fontWeight: 700 }}>Crear cuenta</h1>
        <p className="text-center text-[#1B6B35] text-sm mb-6">Únete a la comunidad de intercambios UdeA</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nombre + Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Nombre</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...field("nombre")} placeholder="Juan" className="w-full pl-8 pr-2 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]" />
              </div>
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Apellido</label>
              <input {...field("apellido")} placeholder="Pérez" className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]" />
              {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
            </div>
          </div>

          {/* Correo */}
          <div>
            <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Correo institucional</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input {...field("correo")} type="email" placeholder="tu.nombre@udea.edu.co" className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]" />
            </div>
            <p className="text-gray-400 text-xs mt-1">Solo se permiten correos @udea.edu.co</p>
            {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
          </div>

          {/* Programa */}
          <div>
            <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Programa académico</label>
            <div className="relative">
              <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input {...field("programa")} placeholder="Ej: Ingeniería de Sistemas" className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]" />
            </div>
            {errors.programa && <p className="text-red-500 text-xs mt-1">{errors.programa}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Contraseña</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input {...field("password")} type="password" placeholder="••••••••" className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]" />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirmar Password */}
          <div>
            <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Confirmar contraseña</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input {...field("confirmar")} type="password" placeholder="••••••••" className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]" />
            </div>
            {errors.confirmar && <p className="text-red-500 text-xs mt-1">{errors.confirmar}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B6B35] text-white py-2.5 rounded-md text-sm hover:bg-[#155229] transition-colors disabled:opacity-60 mt-1"
            style={{ fontWeight: 600 }}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿Ya tienes cuenta?{" "}
          <button onClick={() => navigate("/login")} className="text-[#1B6B35] hover:underline" style={{ fontWeight: 500 }}>
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}
