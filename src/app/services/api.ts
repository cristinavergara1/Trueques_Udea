import axios from 'axios';

// Configurar la URL base del API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backendproyectotruequesuniversitarios.onrender.com/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========================
// Auth Endpoints
// ========================
export const authAPI = {
	register: (data: { nombre: string; apellido?: string; correo: string; programaAcademico?: string; password: string; confirmarPassword: string }) =>
		api.post('/usuarios/registro', {
			nombre: data.nombre,
			correo: data.correo,
			password: data.password,
			confirmarpassword: data.confirmarPassword,
			// opcionales, se envían si el frontend las proporciona
			apellido: data.apellido,
			programaAcademico: data.programaAcademico,
		}),

	login: (correo: string, password: string) =>
		api.post('/usuarios/login', { correo, password }),
};

// ========================
// Publications Endpoints
// ========================
export const publicationsAPI = {
  getAll: (params?: {
    search?: string;
    categoria?: string;
    tipo?: string;
    estado?: string;
    page?: number;
    pageSize?: number;
  }) => api.get('/articulos', { params }),

  getById: (id: number) => api.get(`/articulos/${id}`),

  create: (data: {
    titulo: string;
    categoria: string;
    tipo: string;
    descripcion: string;
    condicionesIntercambio: string;
    imageUrl?: string;
  }) => {
    const rawUser = localStorage.getItem('user');
    let userId: number | undefined;
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        const id = parsed?.id;
        if (typeof id === 'number') userId = id;
        else if (typeof id === 'string' && id.trim() && !Number.isNaN(Number(id))) userId = Number(id);
      } catch {
        // ignore: user mal guardado
      }
    }

    if (userId === undefined) {
      // Evita enviar un payload inválido que hace fallar el backend (500)
      return Promise.reject({
        response: {
          data: {
            message: 'No hay usuario autenticado (user.id no encontrado). Inicia sesión nuevamente.',
          },
        },
      });
    }

    const payload: any = {
    titulo: data.titulo,
    categoria: data.categoria,
    tipo: data.tipo,
    descripcion: data.descripcion,
    condiciones: data.condicionesIntercambio,
    imagen: data.imageUrl,
    usuarioId: userId,
    };

    return api.post('/articulos', payload);
  },

  update: (id: number, data: any) =>
    api.put(`/articulos/${id}`, {
      ...data,
      // Normalización de nombres (front usa condicionesIntercambio/imageUrl)
      condiciones: data.condicionesIntercambio ?? data.condiciones,
      imagen: data.imageUrl ?? data.imagen,
    }),

  delete: (id: number) => api.delete(`/articulos/${id}`),
};

// ========================
// Proposals Endpoints
// ========================
export const proposalsAPI = {
  getAll: () => api.get('/propuestas'),

  getById: (id: number) => api.get(`/propuestas/${id}`),

  create: (publicacionId: number, mensaje: string) =>
    api.post('/propuestas', { publicacionId, mensaje }),

  update: (id: number, estado: 'aceptada' | 'rechazada' | 'pendiente') =>
    api.put(`/propuestas/${id}`, { estado }),

  delete: (id: number) => api.delete(`/propuestas/${id}`),
};

// ========================
// Messages Endpoints
// ========================
export const messagesAPI = {
  getConversations: () => api.get('/mensajes/conversaciones'),

  getMessages: (userId: number) => api.get(`/mensajes/${userId}`),

  send: (destinatarioId: number, contenido: string) =>
    api.post('/mensajes', { destinatarioId, contenido }),
};

// ========================
// User Endpoints
// ========================
export const userAPI = {
  getProfile: () => api.get('/usuarios/perfil'),

  updateProfile: (data: any) => api.put('/usuarios/perfil', data),

  getById: (id: number) => api.get(`/usuarios/${id}`),
};

// ========================
// Reviews/Ratings Endpoints
// ========================
export const reviewsAPI = {
  create: (usuarioId: number, calificacion: number, comentario: string) =>
    api.post('/resenas', { usuarioId, calificacion, comentario }),

  getByUser: (usuarioId: number) => api.get(`/resenas/usuario/${usuarioId}`),
};

// ========================
// Reports Endpoints
// ========================
export const reportsAPI = {
  create: (publicacionId: number, motivo: string, descripcion: string) =>
    api.post('/reportes', { publicacionId, motivo, descripcion }),

  getAll: () => api.get('/reportes'),

  update: (id: number, estado: string) =>
    api.put(`/reportes/${id}`, { estado }),
};

export default api;
