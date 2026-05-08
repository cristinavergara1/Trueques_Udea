import { useState, useEffect } from "react";
import { Package, Plus, X, Pencil, Trash2, AlertCircle, Loader } from "lucide-react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { publicationsAPI } from "../services/api";

const CATEGORIAS = ["Libros", "Tecnología", "Ropa", "Servicios", "Otro"];
const TIPOS = ["Bien", "Servicio", "Habilidad"];

function getCurrentUser() {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) return null;

  try {
    const parsed = JSON.parse(rawUser);
    const rawId = parsed?.id ?? parsed?.idUsuario ?? parsed?.userId;
    const id = Number(rawId);
    const correo =
      typeof parsed?.correo === "string"
        ? parsed.correo
        : typeof parsed?.correoElectronico === "string"
          ? parsed.correoElectronico
          : typeof parsed?.email === "string"
            ? parsed.email
            : "";

    return {
      id: Number.isNaN(id) ? null : id,
      correo,
    };
  } catch {
    return null;
  }
}

function isOwnPublication(publication: any, currentUser: { id: number | null; correo: string } | null) {
  if (!currentUser) return false;

  const publicationUser = publication?.usuario;
  const publicationUserId = publication?.usuarioId ?? publicationUser?.id;
  const publicationUserCorreo = publicationUser?.correo;

  const matchesId =
    currentUser.id !== null &&
    publicationUserId !== undefined &&
    Number(publicationUserId) === currentUser.id;

  const matchesCorreo =
    currentUser.correo !== "" &&
    typeof publicationUserCorreo === "string" &&
    publicationUserCorreo.toLowerCase() === currentUser.correo.toLowerCase();

  return matchesId || matchesCorreo;
}

export default function CreatePublicationPage() {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    categoria: "",
    tipo: "",
    descripcion: "",
    condicionesIntercambio: "",
    imageUrl: "",
  });

  // Cargar publicaciones al montar
  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      setFetching(true);
      const response = await publicationsAPI.getAll();
      const currentUser = getCurrentUser();
      const ownPublications = (response.data || []).filter((publication: any) =>
        isOwnPublication(publication, currentUser)
      );
      setPublicaciones(ownPublications);
    } catch (err: any) {
      console.error("Error cargando publicaciones:", err);
      setPublicaciones([]);
    } finally {
      setFetching(false);
    }
  };

  const openCreate = () => {
    setForm({
      titulo: "",
      categoria: "",
      tipo: "",
      descripcion: "",
      condicionesIntercambio: "",
      imageUrl: "",
    });
    setEditingId(null);
    setError("");
    setSuccess("");
    setOpenModal(true);
  };

  const openEdit = (p: any) => {
    setForm({
      titulo: p.titulo,
      categoria: p.categoria,
      tipo: p.tipo,
      descripcion: p.descripcion,
      condicionesIntercambio: p.condiciones,
      imageUrl: p.imagen || "",
    });
    setEditingId(p.id);
    setError("");
    setSuccess("");
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    if (!form.titulo || !form.categoria || !form.tipo || !form.descripcion) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    setSubmitLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        // Editar
        await publicationsAPI.update(editingId, {
          titulo: form.titulo,
          categoria: form.categoria,
          tipo: form.tipo,
          descripcion: form.descripcion,
          condicionesIntercambio: form.condicionesIntercambio,
          imageUrl: form.imageUrl,
        });
        setSuccess("Publicación actualizada exitosamente");
      } else {
        // Crear
        const response = await publicationsAPI.create({
          titulo: form.titulo,
          categoria: form.categoria,
          tipo: form.tipo,
          descripcion: form.descripcion,
          condicionesIntercambio: form.condicionesIntercambio,
          imageUrl: form.imageUrl,
        });
        setSuccess("Publicación creada exitosamente");

        const currentUser = getCurrentUser();
        const createdPublication = response?.data;
        if (createdPublication && isOwnPublication(createdPublication, currentUser)) {
          setPublicaciones((prev) => [createdPublication, ...prev.filter((p) => p.id !== createdPublication.id)]);
        }
      }

      setTimeout(() => {
        setOpenModal(false);
        loadPublications();
      }, 1000);

    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error al guardar la publicación";
      setError(errorMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta publicación?")) return;

    try {
      setLoading(true);
      await publicationsAPI.delete(id);
      setPublicaciones(prev => prev.filter(p => p.id !== id));
      setSuccess("Publicación eliminada exitosamente");
    } catch (err: any) {
      setError("Error al eliminar la publicación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated />

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Mis publicaciones</h1>
            <p className="text-gray-500 text-sm">Administra tus intercambios</p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#1B6B35] text-white px-4 py-2 rounded-md text-sm hover:bg-[#155229] transition"
          >
            <Plus size={16} /> Nueva publicación
          </button>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-xs p-4 rounded-md mb-4">
            {success}
          </div>
        )}

        {/* LISTA */}
        {fetching ? (
          <div className="text-center py-8 text-gray-500">
            <Loader size={24} className="animate-spin mx-auto mb-2" />
            Cargando publicaciones...
          </div>
        ) : publicaciones.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
            <Package size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No tienes publicaciones aún</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {publicaciones.map((p) => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5 flex justify-between items-center hover:shadow-md transition">

                <div className="flex gap-3 flex-1">
                  {p.imagen && <img src={p.imagen} alt={p.titulo} className="w-12 h-12 rounded object-cover" />}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold">{p.titulo}</h3>
                    <p className="text-xs text-gray-500">{p.categoria} • {p.tipo}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{p.descripcion}</p>
                    <span className="text-xs text-[#1B6B35] font-semibold mt-1 block">Estado: {p.estado}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => openEdit(p)} 
                    className="text-blue-600 hover:text-blue-700 transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)} 
                    className="text-red-600 hover:text-red-700 transition"
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative border border-gray-200 max-h-[90vh] overflow-y-auto">

            {/* cerrar */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            {/* header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold">
                {editingId ? "Editar publicación" : "Crear publicación"}
              </h2>
              <p className="text-sm text-gray-500">
                Publica lo que quieres intercambiar con la comunidad UdeA
              </p>
            </div>

            {/* Errores en modal */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            {/* FORM */}
            <div className="flex flex-col gap-5">

              <input
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Título *"
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]"
              />

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]"
                >
                  <option value="">Categoría *</option>
                  {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                </select>

                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]"
                >
                  <option value="">Tipo *</option>
                  {TIPOS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <textarea
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción *"
                className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]"
                rows={3}
              />

              <textarea
                value={form.condicionesIntercambio}
                onChange={(e) => setForm({ ...form, condicionesIntercambio: e.target.value })}
                placeholder="Condiciones del intercambio"
                className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]"
                rows={2}
              />

              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="URL de imagen (opcional)"
                className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]"
              />

              {/* aviso */}
              <div className="flex gap-2 bg-yellow-50 border border-yellow-200 p-3 rounded-md text-xs text-yellow-800">
                <AlertCircle size={14} />
                No se permite el uso de dinero en intercambios
              </div>

              {/* botones */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className="px-4 py-2 bg-[#1B6B35] text-white rounded-md text-sm hover:bg-[#155229] transition disabled:opacity-60 flex items-center gap-2"
                >
                  {submitLoading && <Loader size={14} className="animate-spin" />}
                  {editingId ? "Guardar cambios" : "Publicar"}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}