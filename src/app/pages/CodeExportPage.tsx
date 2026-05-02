import { useState } from "react";
import { useNavigate } from "react-router";
import { Copy, Check, ArrowLeft, Code2, Coffee } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Next.js code files
// ─────────────────────────────────────────────────────────────────────────────
const NEXTJS_FILES: Record<string, string> = {
  "package.json": `{
  "name": "trueque-udea-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "lucide-react": "^0.487.0",
    "axios": "^1.7.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3.4.1",
    "postcss": "^8",
    "autoprefixer": "^10",
    "typescript": "^5",
    "eslint": "^8",
    "eslint-config-next": "14.2.3"
  }
}`,

  "next.config.js": `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;`,

  "lib/api.ts": `import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

// Auth
export const login = (correo: string, password: string) =>
  api.post('/auth/login', { correo, password });

export const register = (data: {
  nombre: string; apellido: string; correo: string;
  programaAcademico: string; password: string;
}) => api.post('/usuarios/registro', data);

// Publications
export const getPublications = (params?: {
  search?: string; categoria?: string; tipo?: string; estado?: string;
}) => api.get('/publicaciones', { params });

export const createPublication = (data: {
  titulo: string; categoria: string; tipo: string;
  descripcion: string; condicionesIntercambio: string; imageUrl?: string;
}) => api.post('/publicaciones', data);

export const deletePublication = (id: number) =>
  api.delete(\`/publicaciones/\${id}\`);

// Proposals
export const getProposals = () => api.get('/propuestas');
export const sendProposal = (publicacionId: number, mensaje: string) =>
  api.post('/propuestas', { publicacionId, mensaje });
export const updateProposal = (id: number, estado: 'aceptada' | 'rechazada') =>
  api.put(\`/propuestas/\${id}\`, { estado });

// Messages
export const getConversations = () => api.get('/mensajes/conversaciones');
export const getMessages = (userId: number) =>
  api.get(\`/mensajes/\${userId}\`);
export const sendMessage = (destinatarioId: number, contenido: string) =>
  api.post('/mensajes', { destinatarioId, contenido });

export default api;`,

  "pages/index.tsx": `import { useRouter } from 'next/router';
import { ArrowRight, RefreshCw, Shield, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Intercambia bienes y servicios con<br />la comunidad UdeA
        </h1>
        <p className="text-gray-500 text-base mb-8 max-w-lg mx-auto">
          Una plataforma de trueques diseñada para estudiantes universitarios.{' '}
          <span className="text-green-700 font-semibold">Sin dinero</span>, solo
          intercambios <strong>justos</strong> entre{' '}
          <span className="text-green-700 font-semibold">compañeros</span>.
        </p>
        <button
          onClick={() => router.push('/registro')}
          className="inline-flex items-center gap-2 bg-green-800 text-white px-6 py-3 rounded-md hover:bg-green-900 transition-colors"
        >
          Comenzar ahora <ArrowRight size={16} />
        </button>
        <div className="mt-10 rounded-2xl overflow-hidden shadow-lg max-w-2xl mx-auto">
          <img
            src="https://images.unsplash.com/photo-1718327453695-4d32b94c90a4?w=1080&q=80"
            alt="Estudiantes"
            className="w-full h-64 object-cover"
          />
        </div>
      </main>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-12 grid sm:grid-cols-3 gap-8 text-center">
        {[
          { icon: <RefreshCw />, title: 'Intercambios Justos', desc: 'Intercambia bienes, servicios o habilidades sin dinero.' },
          { icon: <Shield />, title: 'Comunidad Confiable', desc: 'Solo usuarios @udea.edu.co pueden participar.' },
          { icon: <Zap />, title: 'Fácil de Usar', desc: 'Publica, busca y propón intercambios en pocos clics.' },
        ].map((f) => (
          <div key={f.title} className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-700">
              {f.icon}
            </div>
            <h3 className="font-bold text-green-700 text-sm">{f.title}</h3>
            <p className="text-gray-500 text-xs">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-green-800 py-10 text-center">
        <h2 className="text-white text-xl font-bold">¿Listo para comenzar a intercambiar?</h2>
        <p className="text-green-200 text-sm mt-2 mb-6">Únete a cientos de estudiantes de la UdeA</p>
        <button
          onClick={() => router.push('/registro')}
          className="bg-white text-green-800 px-6 py-3 rounded-md hover:bg-green-50 font-semibold"
        >
          Crear cuenta gratis
        </button>
      </section>
    </div>
  );
}`,

  "pages/login.tsx": `import { useState } from 'react';
import { useRouter } from 'next/router';
import { Mail, Lock } from 'lucide-react';
import { login } from '../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form.correo, form.password);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/publicaciones');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-green-800 rounded-full flex items-center justify-center mb-3">
          {/* Logo SVG */}
        </div>
        <span className="font-bold text-xl text-green-800">TruequeUdeA</span>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-8 w-full max-w-sm">
        <h1 className="text-center font-bold text-lg mb-1">Iniciar sesión</h1>
        <p className="text-center text-green-700 text-sm mb-6">Ingresa con tu correo institucional</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Correo institucional</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email" placeholder="tu.nombre@udea.edu.co"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border rounded-md text-sm bg-gray-50 focus:outline-none focus:border-green-700"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Contraseña</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password" placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border rounded-md text-sm bg-gray-50 focus:outline-none focus:border-green-700"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-green-800 text-white py-2.5 rounded-md text-sm font-semibold hover:bg-green-900 disabled:opacity-60"
          >
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          ¿No tienes cuenta?{' '}
          <a href="/registro" className="text-green-700 font-medium hover:underline">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}`,

  "pages/publicaciones/index.tsx": `import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { getPublications } from '../../lib/api';

export default function PublicacionesPage() {
  const router = useRouter();
  const [publications, setPublications] = useState([]);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublications();
  }, [search, categoria]);

  const fetchPublications = async () => {
    try {
      const res = await getPublications({ search, categoria });
      setPublications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Publicaciones disponibles</h1>
        <div className="bg-white rounded-xl border p-4 mb-6">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="Buscar publicaciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border rounded-md text-sm focus:outline-none focus:border-green-700"
            />
          </div>
        </div>
        {loading ? (
          <div className="text-center py-16 text-gray-400">Cargando...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {publications.map((pub: any) => (
              <div key={pub.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                {pub.imageUrl && <img src={pub.imageUrl} alt={pub.titulo} className="w-full h-44 object-cover" />}
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2">{pub.titulo}</h3>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">{pub.descripcion}</p>
                  <button className="w-full bg-green-800 text-white py-2 rounded-md text-xs font-medium hover:bg-green-900">
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}`,

  "components/Navbar.tsx": `import { useRouter } from 'next/router';
import { Home, Plus, Handshake, MessageCircle, LogOut } from 'lucide-react';

interface NavbarProps {
  isAuthenticated?: boolean;
}

export default function Navbar({ isAuthenticated = false }: NavbarProps) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => router.push('/')} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center">
            {/* Logo icon */}
          </div>
          <span className="font-bold text-green-800">TruequeUdeA</span>
        </button>
        {isAuthenticated ? (
          <div className="flex items-center gap-1">
            <button onClick={() => router.push('/publicaciones')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100">
              <Home size={15} /> Inicio
            </button>
            <button onClick={() => router.push('/publicaciones/crear')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100">
              <Plus size={15} /> Publicar
            </button>
            <button onClick={() => router.push('/propuestas')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100">
              <Handshake size={15} /> Propuestas
            </button>
            <button onClick={() => router.push('/mensajes')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100">
              <MessageCircle size={15} /> Mensajes
            </button>
            <button onClick={logout} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md ml-1">
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/login')} className="px-4 py-1.5 text-sm text-gray-700">
              Iniciar sesión
            </button>
            <button onClick={() => router.push('/registro')}
              className="px-4 py-1.5 text-sm bg-green-800 text-white rounded-md hover:bg-green-900">
              Registrarse
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Java Spring Boot files
// ─────────────────────────────────────────────────────────────────────────────
const JAVA_FILES: Record<string, string> = {
  "pom.xml": `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.5</version>
  </parent>
  <groupId>com.udea</groupId>
  <artifactId>trueque-udea</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>trueque-udea</name>
  <properties>
    <java.version>17</java.version>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-api</artifactId>
      <version>0.12.5</version>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-impl</artifactId>
      <version>0.12.5</version>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-jackson</artifactId>
      <version>0.12.5</version>
    </dependency>
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>`,

  "application.properties": `# Server
server.port=8080

# Database (PostgreSQL)
spring.datasource.url=jdbc:postgresql://localhost:5432/trueque_udea
spring.datasource.username=postgres
spring.datasource.password=tu_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# JWT
jwt.secret=TruequeUdeASecretKey2024SuperSecureKeyForJWTToken123456
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:3000,https://trueque-udea.vercel.app`,

  "TruequeUdeaApplication.java": `package com.udea.trueque;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TruequeUdeaApplication {
    public static void main(String[] args) {
        SpringApplication.run(TruequeUdeaApplication.class, args);
    }
}`,

  "model/Usuario.java": `package com.udea.trueque.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nombre;

    @NotBlank
    @Column(nullable = false)
    private String apellido;

    @NotBlank
    @Email
    @Column(unique = true, nullable = false)
    @Pattern(regexp = ".*@udea\\.edu\\.co",
             message = "Solo se permiten correos @udea.edu.co")
    private String correo;

    @NotBlank
    @Column(nullable = false)
    private String programaAcademico;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private LocalDateTime creadoEn = LocalDateTime.now();
}`,

  "model/Publicacion.java": `package com.udea.trueque.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "publicaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Publicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String titulo;

    @NotBlank
    @Column(nullable = false)
    private String categoria; // Libros, Tecnología, Ropa, Servicios, Otro

    @NotBlank
    @Column(nullable = false)
    private String tipo; // Bien, Servicio, Habilidad

    @NotBlank
    @Column(nullable = false, length = 2000)
    private String descripcion;

    @NotBlank
    @Column(nullable = false, length = 1000)
    private String condicionesIntercambio;

    private String imageUrl;

    @Column(nullable = false)
    private String estado = "Disponible"; // Disponible, En proceso, Completado

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime creadoEn = LocalDateTime.now();
}`,

  "model/Propuesta.java": `package com.udea.trueque.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "propuestas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Propuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publicacion_id", nullable = false)
    private Publicacion publicacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proponente_id", nullable = false)
    private Usuario proponente;

    @Column(nullable = false, length = 1000)
    private String mensaje;

    @Column(nullable = false)
    private String estado = "pendiente"; // pendiente, aceptada, rechazada

    @Column(nullable = false)
    private LocalDateTime creadoEn = LocalDateTime.now();
}`,

  "model/Mensaje.java": `package com.udea.trueque.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "remitente_id", nullable = false)
    private Usuario remitente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destinatario_id", nullable = false)
    private Usuario destinatario;

    @Column(nullable = false, length = 2000)
    private String contenido;

    @Column(nullable = false)
    private boolean leido = false;

    @Column(nullable = false)
    private LocalDateTime creadoEn = LocalDateTime.now();
}`,

  "security/JwtUtil.java": `package com.udea.trueque.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("\${jwt.secret}")
    private String secret;

    @Value("\${jwt.expiration}")
    private long expiration;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String correo) {
        return Jwts.builder()
            .subject(correo)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getKey())
            .compact();
    }

    public String extractCorreo(String token) {
        return Jwts.parser()
            .verifyWith(getKey())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}`,

  "security/SecurityConfig.java": `package com.udea.trueque.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/publicaciones").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "https://trueque-udea.vercel.app"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}`,

  "controller/AuthController.java": `package com.udea.trueque.controller;

import com.udea.trueque.dto.*;
import com.udea.trueque.model.Usuario;
import com.udea.trueque.repository.UsuarioRepository;
import com.udea.trueque.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (!req.getCorreo().endsWith("@udea.edu.co")) {
            return ResponseEntity.badRequest()
                .body("Solo se permiten correos @udea.edu.co");
        }
        if (usuarioRepo.existsByCorreo(req.getCorreo())) {
            return ResponseEntity.badRequest()
                .body("El correo ya está registrado");
        }
        Usuario usuario = Usuario.builder()
            .nombre(req.getNombre())
            .apellido(req.getApellido())
            .correo(req.getCorreo())
            .programaAcademico(req.getProgramaAcademico())
            .password(encoder.encode(req.getPassword()))
            .build();
        usuarioRepo.save(usuario);
        String token = jwtUtil.generateToken(usuario.getCorreo());
        return ResponseEntity.ok(new AuthResponse(token, usuario));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        return usuarioRepo.findByCorreo(req.getCorreo())
            .filter(u -> encoder.matches(req.getPassword(), u.getPassword()))
            .map(u -> {
                String token = jwtUtil.generateToken(u.getCorreo());
                return ResponseEntity.ok(new AuthResponse(token, u));
            })
            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .build());
    }
}`,

  "controller/PublicacionController.java": `package com.udea.trueque.controller;

import com.udea.trueque.model.*;
import com.udea.trueque.repository.*;
import com.udea.trueque.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/publicaciones")
@RequiredArgsConstructor
public class PublicacionController {

    private final PublicacionRepository pubRepo;
    private final UsuarioRepository usuarioRepo;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<Publicacion>> listar(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String categoria,
        @RequestParam(required = false) String tipo,
        @RequestParam(required = false) String estado
    ) {
        // Usar Specification o filtrado manual según los params
        return ResponseEntity.ok(pubRepo.findAllWithFilters(
            search, categoria, tipo, estado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Publicacion> obtener(@PathVariable Long id) {
        return pubRepo.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Publicacion> crear(
        @Valid @RequestBody Publicacion pub,
        @RequestHeader("Authorization") String bearerToken
    ) {
        String correo = jwtUtil.extractCorreo(bearerToken.replace("Bearer ", ""));
        Usuario usuario = usuarioRepo.findByCorreo(correo).orElseThrow();
        pub.setUsuario(usuario);
        pub.setEstado("Disponible");
        return ResponseEntity.status(HttpStatus.CREATED).body(pubRepo.save(pub));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Publicacion> actualizar(
        @PathVariable Long id,
        @Valid @RequestBody Publicacion updated,
        @RequestHeader("Authorization") String bearerToken
    ) {
        String correo = jwtUtil.extractCorreo(bearerToken.replace("Bearer ", ""));
        return pubRepo.findById(id)
            .filter(p -> p.getUsuario().getCorreo().equals(correo))
            .map(p -> {
                p.setTitulo(updated.getTitulo());
                p.setDescripcion(updated.getDescripcion());
                p.setEstado(updated.getEstado());
                return ResponseEntity.ok(pubRepo.save(p));
            })
            .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
        @PathVariable Long id,
        @RequestHeader("Authorization") String bearerToken
    ) {
        String correo = jwtUtil.extractCorreo(bearerToken.replace("Bearer ", ""));
        return pubRepo.findById(id)
            .filter(p -> p.getUsuario().getCorreo().equals(correo))
            .map(p -> {
                pubRepo.delete(p);
                return ResponseEntity.noContent().<Void>build();
            })
            .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }
}`,

  "controller/PropuestaController.java": `package com.udea.trueque.controller;

import com.udea.trueque.model.*;
import com.udea.trueque.repository.*;
import com.udea.trueque.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/propuestas")
@RequiredArgsConstructor
public class PropuestaController {

    private final PropuestaRepository propRepo;
    private final PublicacionRepository pubRepo;
    private final UsuarioRepository usuarioRepo;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<Propuesta>> misPropuestas(
        @RequestHeader("Authorization") String bearerToken
    ) {
        String correo = jwtUtil.extractCorreo(bearerToken.replace("Bearer ", ""));
        Usuario usuario = usuarioRepo.findByCorreo(correo).orElseThrow();
        return ResponseEntity.ok(propRepo.findByProponenteOrPublicacionUsuario(usuario, usuario));
    }

    @PostMapping
    public ResponseEntity<Propuesta> crear(
        @RequestBody CreatePropuestaRequest req,
        @RequestHeader("Authorization") String bearerToken
    ) {
        String correo = jwtUtil.extractCorreo(bearerToken.replace("Bearer ", ""));
        Usuario proponente = usuarioRepo.findByCorreo(correo).orElseThrow();
        Publicacion publicacion = pubRepo.findById(req.getPublicacionId()).orElseThrow();
        
        Propuesta p = Propuesta.builder()
            .publicacion(publicacion)
            .proponente(proponente)
            .mensaje(req.getMensaje())
            .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(propRepo.save(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Propuesta> actualizar(
        @PathVariable Long id,
        @RequestBody UpdatePropuestaRequest req,
        @RequestHeader("Authorization") String bearerToken
    ) {
        String correo = jwtUtil.extractCorreo(bearerToken.replace("Bearer ", ""));
        return propRepo.findById(id)
            .filter(p -> p.getPublicacion().getUsuario().getCorreo().equals(correo))
            .map(p -> {
                p.setEstado(req.getEstado());
                if ("aceptada".equals(req.getEstado())) {
                    p.getPublicacion().setEstado("En proceso");
                    pubRepo.save(p.getPublicacion());
                }
                return ResponseEntity.ok(propRepo.save(p));
            })
            .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }
}`,

  "controller/MensajeController.java": `package com.udea.trueque.controller;

import com.udea.trueque.model.*;
import com.udea.trueque.repository.*;
import com.udea.trueque.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/mensajes")
@RequiredArgsConstructor
public class MensajeController {

    private final MensajeRepository mensajeRepo;
    private final UsuarioRepository usuarioRepo;
    private final JwtUtil jwtUtil;

    @GetMapping("/conversaciones")
    public ResponseEntity<List<Map<String, Object>>> conversaciones(
        @RequestHeader("Authorization") String bearerToken
    ) {
        String correo = jwtUtil.extractCorreo(bearerToken.replace("Bearer ", ""));
        Usuario yo = usuarioRepo.findByCorreo(correo).orElseThrow();
        return ResponseEntity.ok(mensajeRepo.findConversaciones(yo.getId()));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Mensaje>> mensajesConUsuario(
        @PathVariable Long userId,
        @RequestHeader("Authorization") String bearerToken
    ) {
        String correo = jwtUtil.extractCorreo(bearerToken.replace("Bearer ", ""));
        Usuario yo = usuarioRepo.findByCorreo(correo).orElseThrow();
        Usuario otro = usuarioRepo.findById(userId).orElseThrow();
        return ResponseEntity.ok(
            mensajeRepo.findConversacionEntre(yo.getId(), otro.getId())
        );
    }

    @PostMapping
    public ResponseEntity<Mensaje> enviar(
        @RequestBody SendMensajeRequest req,
        @RequestHeader("Authorization") String bearerToken
    ) {
        String correo = jwtUtil.extractCorreo(bearerToken.replace("Bearer ", ""));
        Usuario remitente = usuarioRepo.findByCorreo(correo).orElseThrow();
        Usuario destinatario = usuarioRepo.findById(req.getDestinatarioId()).orElseThrow();
        
        Mensaje m = Mensaje.builder()
            .remitente(remitente)
            .destinatario(destinatario)
            .contenido(req.getContenido())
            .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(mensajeRepo.save(m));
    }
}`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
function CodeBlock({ code, filename }: { code: string; filename: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 mb-4">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-300 font-mono">{filename}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors"
        >
          {copied ? <><Check size={11} /> Copiado!</> : <><Copy size={11} /> Copiar</>}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs text-gray-100 leading-relaxed max-h-80 overflow-y-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function CodeExportPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"nextjs" | "java">("nextjs");
  const [selectedFile, setSelectedFile] = useState<string>("");

  const files = tab === "nextjs" ? NEXTJS_FILES : JAVA_FILES;
  const fileList = Object.keys(files);
  const currentFile = selectedFile && files[selectedFile] ? selectedFile : fileList[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1B6B35] text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-green-200 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Volver</span>
          </button>
          <div>
            <h1 className="text-lg" style={{ fontWeight: 700 }}>TruequeUdeA — Código Fuente</h1>
            <p className="text-green-200 text-xs">Descarga y adapta este código para tu proyecto</p>
          </div>
        </div>
      </div>

      {/* Tech tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 flex gap-2 py-3">
          <button
            onClick={() => { setTab("nextjs"); setSelectedFile(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              tab === "nextjs" ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-gray-600 hover:bg-gray-100"
            }`}
            style={{ fontWeight: tab === "nextjs" ? 600 : 400 }}
          >
            <Code2 size={15} />
            Frontend — Next.js
          </button>
          <button
            onClick={() => { setTab("java"); setSelectedFile(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              tab === "java" ? "bg-orange-50 text-orange-700 border border-orange-200" : "text-gray-600 hover:bg-gray-100"
            }`}
            style={{ fontWeight: tab === "java" ? 600 : 400 }}
          >
            <Coffee size={15} />
            Backend — Java Spring Boot
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* File tree */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
              <p className="text-xs text-gray-500" style={{ fontWeight: 600 }}>
                {tab === "nextjs" ? "📁 trueque-udea-frontend" : "📁 trueque-udea-backend"}
              </p>
            </div>
            <div className="py-1">
              {fileList.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFile(f)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors ${
                    currentFile === f
                      ? "bg-[#1B6B35] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {f.includes("/") ? (
                    <span className="opacity-60">{f.split("/").slice(0, -1).join("/")}/</span>
                  ) : null}
                  <span style={{ fontWeight: currentFile === f ? 600 : 400 }}>
                    {f.split("/").pop()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <p className="text-xs text-yellow-800" style={{ fontWeight: 700 }}>📋 Instrucciones</p>
            {tab === "nextjs" ? (
              <ol className="text-xs text-yellow-700 mt-2 space-y-1 list-decimal list-inside">
                <li>Copia los archivos</li>
                <li>Instala dependencias</li>
                <li>Configura <code className="bg-yellow-100 px-0.5 rounded">.env.local</code></li>
                <li>Deploy en Vercel</li>
              </ol>
            ) : (
              <ol className="text-xs text-yellow-700 mt-2 space-y-1 list-decimal list-inside">
                <li>Crea proyecto Maven</li>
                <li>Crea base de datos PostgreSQL</li>
                <li>Configura <code className="bg-yellow-100 px-0.5 rounded">application.properties</code></li>
                <li>Ejecuta con <code className="bg-yellow-100 px-0.5 rounded">mvn spring-boot:run</code></li>
              </ol>
            )}
          </div>
        </div>

        {/* Code viewer */}
        <div className="flex-1 min-w-0">
          {tab === "nextjs" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm">
              <p className="text-blue-800" style={{ fontWeight: 700 }}>🚀 Deploy en Vercel</p>
              <p className="text-blue-700 text-xs mt-1">
                Crea el proyecto con <code className="bg-blue-100 px-1 rounded">npx create-next-app@latest trueque-udea</code>, 
                copia estos archivos, configura la variable <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_API_URL</code> en Vercel 
                apuntando a tu backend Java, y haz deploy con <code className="bg-blue-100 px-1 rounded">vercel --prod</code>.
              </p>
            </div>
          )}
          {tab === "java" && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4 text-sm">
              <p className="text-orange-800" style={{ fontWeight: 700 }}>☕ Deploy del Backend Java</p>
              <p className="text-orange-700 text-xs mt-1">
                Crea el proyecto en <strong>Spring Initializr</strong> (start.spring.io) con las dependencias del pom.xml. 
                Puedes deployarlo en <strong>Railway</strong>, <strong>Render</strong> o <strong>Heroku</strong>. 
                Configura las variables de entorno de la base de datos PostgreSQL en producción.
              </p>
            </div>
          )}
          <CodeBlock
            filename={currentFile}
            code={files[currentFile] || ""}
          />
        </div>
      </div>
    </div>
  );
}
