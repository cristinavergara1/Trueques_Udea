import { useState } from "react";
import { Send } from "lucide-react";
import Navbar from "../components/Navbar";

const CONVERSATIONS = [
  {
    id: 1,
    usuario: "María González",
    initials: "MG",
    color: "#1B6B35",
    ultimoMensaje: "¡Perfecto! ¿Cuándo podemos reunirnos?",
    hora: "10:30",
    noLeidos: 2,
    mensajes: [
      { id: 1, remitente: "yo", texto: "Hola María, vi tu publicación de clases de Python y me interesa mucho.", hora: "10:00" },
      { id: 2, remitente: "ellos", texto: "¡Hola! Claro, con gusto. ¿Qué nivel de Python tienes?", hora: "10:05" },
      { id: 3, remitente: "yo", texto: "Básico, apenas estoy empezando. Puedo ofrecerte diseño en Figma a cambio.", hora: "10:20" },
      { id: 4, remitente: "ellos", texto: "¡Perfecto! ¿Cuándo podemos reunirnos?", hora: "10:30" },
    ],
  },
  {
    id: 2,
    usuario: "Carlos Restrepo",
    initials: "CR",
    color: "#2563eb",
    ultimoMensaje: "La calculadora está en perfecto estado.",
    hora: "Ayer",
    noLeidos: 0,
    mensajes: [
      { id: 1, remitente: "ellos", texto: "Hola! Vi que quieres intercambiar por la calculadora.", hora: "Ayer" },
      { id: 2, remitente: "yo", texto: "Sí, ¿en qué estado está exactamente?", hora: "Ayer" },
      { id: 3, remitente: "ellos", texto: "La calculadora está en perfecto estado.", hora: "Ayer" },
    ],
  },
  {
    id: 3,
    usuario: "Laura Sánchez",
    initials: "LS",
    color: "#7c3aed",
    ultimoMensaje: "Tengo la mochila disponible esta semana.",
    hora: "Lun",
    noLeidos: 0,
    mensajes: [
      { id: 1, remitente: "yo", texto: "Hola Laura, me interesa la mochila.", hora: "Lun" },
      { id: 2, remitente: "ellos", texto: "Tengo la mochila disponible esta semana.", hora: "Lun" },
    ],
  },
];

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState(CONVERSATIONS);

  const selected = conversations.find((c) => c.id === selectedId)!;

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              ultimoMensaje: newMessage,
              hora: "Ahora",
              mensajes: [...c.mensajes, { id: Date.now(), remitente: "yo", texto: newMessage, hora: "Ahora" }],
            }
          : c
      )
    );
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl text-gray-900 mb-4" style={{ fontWeight: 700 }}>Mensajes</h1>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex" style={{ height: "calc(100vh - 180px)", minHeight: 400 }}>
          {/* Sidebar */}
          <div className="w-72 border-r border-gray-100 flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-gray-100">
              <input
                type="text"
                placeholder="Buscar conversación..."
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#1B6B35]"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${
                    selectedId === conv.id ? "bg-green-50" : ""
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0"
                    style={{ backgroundColor: conv.color, fontWeight: 700 }}
                  >
                    {conv.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-sm text-gray-900 truncate" style={{ fontWeight: 600 }}>{conv.usuario}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">{conv.hora}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{conv.ultimoMensaje}</p>
                  </div>
                  {conv.noLeidos > 0 && (
                    <span className="w-5 h-5 bg-[#1B6B35] text-white text-xs rounded-full flex items-center justify-center flex-shrink-0" style={{ fontWeight: 700 }}>
                      {conv.noLeidos}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm"
                style={{ backgroundColor: selected.color, fontWeight: 700 }}
              >
                {selected.initials}
              </div>
              <div>
                <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{selected.usuario}</p>
                <p className="text-xs text-green-500">En línea</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {selected.mensajes.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.remitente === "yo" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      msg.remitente === "yo"
                        ? "bg-[#1B6B35] text-white rounded-tr-sm"
                        : "bg-gray-100 text-gray-800 rounded-tl-sm"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.texto}</p>
                    <p className={`text-xs mt-1 ${msg.remitente === "yo" ? "text-green-200" : "text-gray-400"}`}>
                      {msg.hora}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#1B6B35]"
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 bg-[#1B6B35] text-white rounded-full flex items-center justify-center hover:bg-[#155229] transition-colors flex-shrink-0"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
