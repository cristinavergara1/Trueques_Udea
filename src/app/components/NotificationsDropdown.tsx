import { useState, useRef, useEffect } from "react";
import { Bell, Check } from "lucide-react";

import { notificationsAPI } from "../services/api";

type NotificationDTO = {
  id: number;
  tipo: string;
  mensaje: string;
  leida: boolean;
  fechaCreacion?: string;
};

function formatRelativeDate(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Hace un momento";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} d`;
}

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
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

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    notificationsAPI
      .getAll()
      .then((res) => {
        if (cancelled) return;
        setNotifications(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        if (cancelled) return;
        setNotifications([]);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const markAsRead = (id: number) => {
    notificationsAPI
      .markRead(id)
      .then(() => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
      })
      .catch(() => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
      });
  };

  const markAllAsRead = () => {
    const unread = notifications.filter((n) => !n.leida);
    setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
    unread.forEach((n) => {
      notificationsAPI.markRead(n.id).catch(() => undefined);
    });
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
                      <p className="text-xs text-gray-400">{formatRelativeDate(notif.fechaCreacion)}</p>
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
