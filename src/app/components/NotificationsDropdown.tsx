import { useState, useRef, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";

const NOTIFICATIONS = [
  {
    id: 1,
    tipo: "propuesta",
    mensaje: "Juan Pérez hizo una propuesta en tu publicación 'Calculadora Científica'",
    fecha: "Hace 2 horas",
    leida: false,
  },
  {
    id: 2,
    tipo: "aceptada",
    mensaje: "María González aceptó tu propuesta sobre 'Clases de Python'",
    fecha: "Hace 5 horas",
    leida: false,
  },
  {
    id: 3,
    tipo: "rechazo",
    mensaje: "Tu propuesta sobre 'Libro: Cien Años de Soledad' fue rechazada",
    fecha: "Hace 1 día",
    leida: true,
  },
  {
    id: 4,
    tipo: "mensaje",
    mensaje: "Nuevo mensaje de Pedro Martínez",
    fecha: "Hace 2 días",
    leida: true,
  },
];

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.leida).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" style={{ fontWeight: 600, fontSize: "10px" }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm text-gray-900" style={{ fontWeight: 600 }}>Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#1B6B35] hover:underline"
                style={{ fontWeight: 500 }}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Bell size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    !notif.leida ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-snug mb-1">{notif.mensaje}</p>
                      <p className="text-xs text-gray-400">{notif.fecha}</p>
                    </div>
                    {!notif.leida && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="p-1 text-gray-400 hover:text-[#1B6B35] transition-colors flex-shrink-0"
                        title="Marcar como leída"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
