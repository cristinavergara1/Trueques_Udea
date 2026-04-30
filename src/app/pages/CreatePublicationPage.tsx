import { useState } from "react";
import { Package, Plus, X, Pencil, Trash2, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";

const CATEGORIAS = ["Libros", "Tecnología", "Ropa", "Servicios", "Otro"];
const TIPOS = ["Bien", "Servicio", "Habilidad"];

export default function PublicationsPage() {
  const [publicaciones, setPublicaciones] = useState([
    {
      id: 1,
      titulo: "Calculadora científica Casio",
      categoria: "Tecnología",
      tipo: "Bien",
      descripcion: "En excelente estado, poco uso",
      condiciones: "Busco libros de matemáticas",
      imageUrl: "",
    },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    titulo: "",
    categoria: "",
    tipo: "",
    descripcion: "",
    condiciones: "",
    imageUrl: "",
  });

  const openCreate = () => {
    setForm({
      titulo: "",
      categoria: "",
      tipo: "",
      descripcion: "",
      condiciones: "",
      imageUrl: "",
    });
    setEditingId(null);
    setOpenModal(true);
  };

  const openEdit = (p: any) => {
    setForm(p);
    setEditingId(p.id);
    setOpenModal(true);
  };

  const handleSubmit = () => {
    if (!form.titulo) return;

    if (editingId) {
      setPublicaciones(prev =>
        prev.map(p => p.id === editingId ? { ...form, id: editingId } : p)
      );
    } else {
      setPublicaciones(prev => [
        ...prev,
        { ...form, id: Date.now() },
      ]);
    }

    setOpenModal(false);
  };

  const handleDelete = (id: number) => {
    setPublicaciones(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated />

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Mis publicaciones</h1>
            <p className="text-gray-500 text-sm">Aquí están tus publicaciones</p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#1B6B35] text-white px-4 py-2 rounded-md text-sm"
          >
            <Plus size={16} /> Nueva publicación
          </button>
        </div>

        {/* LISTA */}
        <div className="flex flex-col gap-4">
          {publicaciones.map((p) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5 flex justify-between">

              <div className="flex gap-3">
                <Package className="text-[#1B6B35]" />
                <div>
                  <h3 className="text-sm font-semibold">{p.titulo}</h3>
                  <p className="text-xs text-gray-500">{p.categoria}</p>
                  <p className="text-xs text-gray-400">{p.descripcion}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => openEdit(p)} className="text-blue-600">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>

      </main>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative border border-gray-200">

            {/* cerrar */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-gray-400"
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

            {/* FORM */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">

              <h3 className="text-[#1B6B35] text-sm font-semibold mb-1">
                Información del intercambio
              </h3>
              <p className="text-gray-400 text-xs mb-5">
                Completa todos los campos
              </p>

              <div className="flex flex-col gap-5">

                <input
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Título"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm"
                />

                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm"
                  >
                    <option value="">Categoría</option>
                    {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                  </select>

                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm"
                  >
                    <option value="">Tipo</option>
                    {TIPOS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Descripción"
                  className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm"
                />

                <textarea
                  value={form.condiciones}
                  onChange={(e) => setForm({ ...form, condiciones: e.target.value })}
                  placeholder="Condiciones"
                  className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm"
                />

                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="URL imagen"
                  className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm"
                />

                {/* aviso */}
                <div className="flex gap-2 bg-yellow-50 border border-yellow-200 p-3 rounded-md text-xs text-yellow-800">
                  <AlertCircle size={14} />
                  No se permite el uso de dinero en intercambios
                </div>

                {/* botones */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="px-4 py-2 border rounded-md text-sm"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-[#1B6B35] text-white rounded-md text-sm"
                  >
                    {editingId ? "Guardar cambios" : "Publicar"}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}