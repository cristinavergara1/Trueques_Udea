import { useNavigate, useLocation } from "react-router";
import { Home, Handshake, MessageCircle, LogOut, Code, Package, FileText } from "lucide-react";
import NotificationsDropdown from "./NotificationsDropdown";
import { getUserInitials } from "../utils/getUserInitials";

interface NavbarProps {
  isAuthenticated?: boolean;
}

export default function Navbar({ isAuthenticated = false }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}") as any;
  const avatarInitials = getUserInitials(storedUser?.usuario ?? storedUser);

  const isActive = (path: string) => location.pathname === path;
  const hideCodeButton = location.pathname === "/";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-[#1B6B35] rounded-full flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 1l4 4-4 4"/>
              <path d="M3 11V9a4 4 0 014-4h14"/>
              <path d="M7 23l-4-4 4-4"/>
              <path d="M21 13v2a4 4 0 01-4 4H3"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#1B6B35" }}>TruequeUdeA</span>
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate("/publicaciones")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                isActive("/publicaciones")
                  ? "bg-[#1B6B35] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Home size={15} />
              <span className="hidden sm:inline">Inicio</span>
            </button>
            <button
              onClick={() => navigate("/publicaciones/crear")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                isActive("/publicaciones/crear")
                  ? "bg-[#1B6B35] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FileText size={15} />
              <span className="hidden sm:inline">Publicaciones</span>
            </button>            
            <button
              onClick={() => navigate("/propuestas")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                isActive("/propuestas")
                  ? "bg-[#1B6B35] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Handshake size={15} />
              <span className="hidden sm:inline">Propuestas</span>
            </button>
            <button
              onClick={() => navigate("/mensajes")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                isActive("/mensajes")
                  ? "bg-[#1B6B35] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <MessageCircle size={15} />
              <span className="hidden sm:inline">Mensajes</span>
            </button>
            <div className="ml-2">
              <NotificationsDropdown />
            </div>
            <button
              onClick={() => navigate("/perfil")}
              className="w-8 h-8 bg-[#1B6B35] rounded-full flex items-center justify-center text-white text-xs ml-2 cursor-pointer hover:opacity-80 transition-opacity"
              style={{ fontWeight: 600 }}
            >
              {avatarInitials}
            </button>
            <button
              onClick={() => navigate("/")}
              className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors ml-1"
              title="Cerrar sesión"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {!hideCodeButton && (
              <button
                onClick={() => navigate("/codigo")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Code size={15} />
                <span className="hidden sm:inline">Ver código</span>
              </button>
            )}
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-1.5 text-sm text-gray-700 hover:text-[#1B6B35] transition-colors"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate("/registro")}
              className="px-4 py-1.5 text-sm bg-[#1B6B35] text-white rounded-md hover:bg-[#155229] transition-colors"
            >
              Registrarse
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
