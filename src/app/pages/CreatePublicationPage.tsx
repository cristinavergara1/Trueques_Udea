import { useState } from "react";
import { useNavigate } from "react-router";
import { Image, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";

const CATEGORIAS = ["", "Libros", "Tecnología", "Ropa", "Servicios", "Otro"];
const TIPOS = ["", "Bien", "Servicio", "Habilidad"];

export default function CreatePublicationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: "", categoria: "", tipo: "", descripcion: "", condiciones: "", imageUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.titulo.trim()) e.titulo = "El título es requerido";
    if (!form.categoria) e.categoria = "Selecciona una categoría";
    if (!form.tipo) e.tipo = "Selecciona el tipo";
    if (!form.descripcion.trim()) e.descripcion = "La descripción es requerida";
    if (!form.condiciones.trim()) e.condiciones = "Las condiciones son requeridas";
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
    setSuccess(true);
    setTimeout(() => navigate("/publicaciones"), 1500);
  };

  const f = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>¡Publicación creada!</h2>
          <p className="text-gray-500 text-sm">Redirigiendo a publicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>Crear publicación</h1>
          <p className="text-sm mt-1">
            Publica lo que quieres intercambiar con la{" "}
            <span className="text-[#1B6B35]" style={{ fontWeight: 500 }}>comunidad UdeA</span>
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-[#1B6B35] text-sm mb-0.5" style={{ fontWeight: 600 }}>Información del intercambio</h2>
          <p className="text-gray-400 text-xs mb-5">Completa todos los campos para crear tu publicación</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Título */}
            <div>
              <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>
                Título <span className="text-red-500">*</span>
              </label>
              <input
                {...f("titulo")}
                placeholder="Ej: Calculadora científica en excelente estado"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]"
              />
              {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
            </div>

            {/* Categoría + Tipo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  {...f("categoria")}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#1B6B35] text-gray-600"
                >
                  <option value="">Selecciona una categoría</option>
                  {CATEGORIAS.filter(Boolean).map((c) => <option key={c}>{c}</option>)}
                </select>
                {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>
                  Tipo <span className="text-red-500">*</span>
                </label>
                <select
                  {...f("tipo")}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#1B6B35] text-gray-600"
                >
                  <option value="">Selecciona el tipo</option>
                  {TIPOS.filter(Boolean).map((t) => <option key={t}>{t}</option>)}
                </select>
                {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                {...f("descripcion")}
                rows={4}
                placeholder="Describe detalladamente lo que ofreces..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35] resize-none"
              />
              <p className="text-gray-400 text-xs mt-1">Sé específico sobre el estado, características y cualquier detalle relevante</p>
              {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
            </div>

            {/* Condiciones */}
            <div>
              <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>
                Condiciones de intercambio <span className="text-red-500">*</span>
              </label>
              <textarea
                {...f("condiciones")}
                rows={3}
                placeholder="¿Qué buscas a cambio? Ej: Libros de matemáticas, clases de inglés, etc."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35] resize-none"
              />
              {errors.condiciones && <p className="text-red-500 text-xs mt-1">{errors.condiciones}</p>}
            </div>

            {/* URL imagen */}
            <div>
              <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>
                URL de imagen <span className="text-gray-400">(opcional)</span>
              </label>
              <div className="relative">
                <Image size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...f("imageUrl")}
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]"
                />
              </div>
              <p className="text-gray-400 text-xs mt-1">Una imagen ayuda a que tu publicación sea más atractiva</p>
            </div>

            {/* Aviso */}
            <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-md px-4 py-3">
              <AlertCircle size={15} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-800">
                <span style={{ fontWeight: 600 }}>Recuerda:</span> Esta plataforma es solo para{" "}
                <span style={{ fontWeight: 600 }}>intercambios</span>. No se permite el uso de{" "}
                <span className="text-red-600" style={{ fontWeight: 600 }}>dinero</span> en ninguna transacción.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate("/publicaciones")}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#1B6B35] text-white rounded-md text-sm hover:bg-[#155229] transition-colors disabled:opacity-60"
                style={{ fontWeight: 600 }}
              >
                {loading ? "Publicando..." : "Publicar"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
