import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Calendar, User, Eye } from "lucide-react";
import Navbar from "../components/Navbar";

const PUBLICATIONS = [
  {
    id: 1,
    titulo: "Calculadora Científica Casio",
    categoria: "Tecnología",
    tipo: "Bien",
    descripcion: "Calculadora Casio FX-991 en excelente estado. Perfecta para cálculo e ingeniería.",
    estado: "disponible",
    usuario: "Carlos Restrepo",
    fecha: "2/4/2026",
    imagen: "https://images.unsplash.com/photo-1694753736023-ddad6cfc8263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 2,
    titulo: "Clases de Programación Python",
    categoria: "Otro",
    tipo: "Servicio",
    descripcion: "Ofrezco clases particulares de Python nivel básico e intermedio. Tengo experiencia enseñando.",
    estado: "disponible",
    usuario: "María González",
    fecha: "3/4/2026",
    imagen: "https://images.unsplash.com/photo-1640370287940-6921711c4816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 3,
    titulo: "Libro: Cien Años de Soledad",
    categoria: "Libros",
    tipo: "Bien",
    descripcion: "Edición conmemorativa de Cien Años de Soledad de García Márquez. En muy buen estado.",
    estado: "disponible",
    usuario: "Andrea López",
    fecha: "1/4/2026",
    imagen: "https://images.unsplash.com/photo-1598738865218-7809c17181c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 4,
    titulo: "Guitarra Acústica Yamaha",
    categoria: "Otro",
    tipo: "Bien",
    descripcion: "Guitarra acústica Yamaha F310, buen estado, con funda. Ideal para principiantes.",
    estado: "en_proceso",
    usuario: "Pedro Martínez",
    fecha: "4/4/2026",
    imagen: "https://images.unsplash.com/photo-1610620146780-26908fab50ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 5,
    titulo: "Mochila Universitaria",
    categoria: "Ropa",
    tipo: "Bien",
    descripcion: "Mochila ergonómica con compartimento para laptop de 15\". Poco uso, en perfecto estado.",
    estado: "disponible",
    usuario: "Laura Sánchez",
    fecha: "5/4/2026",
    imagen: "https://images.unsplash.com/photo-1547817752-c23df0357f18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 6,
    titulo: "Tutorías de Cálculo Diferencial",
    categoria: "Servicios",
    tipo: "Servicio",
    descripcion: "Ofrezco tutorías de cálculo diferencial e integral. Estudiante de Ingeniería Matemática.",
    estado: "disponible",
    usuario: "Santiago Gómez",
    fecha: "6/4/2026",
    imagen: null,
  },
];

const CATEGORIAS = ["Todas las categorías", "Libros", "Tecnología", "Ropa", "Servicios", "Otro"];
const TIPOS = ["Todos los tipos", "Bien", "Servicio", "Habilidad"];
const ESTADOS = [
  { label: "Todos los estados", value: "all" },
  { label: "Disponible", value: "disponible" },
  { label: "En proceso", value: "en_proceso" },
  { label: "No disponible", value: "intercambiado" }
];

const STATUS_UI = {
  disponible: {
    label: "Disponible",
    class: "bg-green-100 text-green-700"
  },
  en_proceso: {
    label: "En proceso",
    class: "bg-yellow-100 text-yellow-700"
  },
  intercambiado: {
    label: "No disponible",
    class: "bg-red-100 text-red-700"
  }
};

export default function PublicationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("Todas las categorías");
  const [tipo, setTipo] = useState("Todos los tipos");
  const [estado, setEstado] = useState("all");

  const [publications, setPublications] = useState(PUBLICATIONS);
  useEffect(() => {
    const saved = localStorage.getItem("publications");
    if (saved) {
      setPublications(JSON.parse(saved));
    } else {
    localStorage.setItem("publications", JSON.stringify(PUBLICATIONS));
    }
  }, []);

  const filtered = publications.filter((p) => {
  const matchSearch =
    p.titulo.toLowerCase().includes(search.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(search.toLowerCase());

  const matchCat =
    categoria === "Todas las categorías" || p.categoria === categoria;

  const matchTipo =
    tipo === "Todos los tipos" || p.tipo === tipo;

  const matchEstado =
    estado === "all" || p.estado === estado;

  return matchSearch && matchCat && matchTipo && matchEstado;
});

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>Publicaciones disponibles</h1>
          <p className="text-gray-500 text-sm mt-1">Explora los intercambios disponibles en la comunidad UdeA</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-col gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar publicaciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#1B6B35] focus:ring-1 focus:ring-[#1B6B35]"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="flex-1 min-w-40 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-[#1B6B35] bg-white"
            >
              {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="flex-1 min-w-36 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-[#1B6B35] bg-white"
            >
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              {ESTADOS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} resultados</p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((pub) => (
            <div key={pub.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              {pub.imagen ? (
                <img src={pub.imagen} alt={pub.titulo} className="w-full h-44 object-cover" />
              ) : (
                <div className="w-full h-44 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                  <span className="text-4xl">🤝</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-gray-900 text-sm leading-snug" style={{ fontWeight: 600 }}>{pub.titulo}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                      STATUS_UI[pub.estado].class
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {STATUS_UI[pub.estado].label}
                </span>
                </div>
                <div className="flex gap-1.5 mb-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{pub.categoria}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{pub.tipo}</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{pub.descripcion}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><User size={11} />{pub.usuario}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} />{pub.fecha}</span>
                </div>
                <button
                  onClick={() => navigate(`/publicaciones/${pub.id}`)}
                  className="w-full bg-[#1B6B35] text-white py-2 rounded-md text-xs hover:bg-[#155229] transition-colors flex items-center justify-center gap-1.5"
                  style={{ fontWeight: 500 }}
                >
                  <Eye size={13} />
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">No se encontraron publicaciones con esos filtros.</p>
          </div>
        )}
      </main>
    </div>
  );
}
