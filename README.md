# TruequeUdeA 🔄

Plataforma de trueques diseñada para estudiantes de la Universidad de Antioquia. Intercambia bienes, servicios y habilidades con la comunidad universitaria sin necesidad de dinero.

## 🚀 Características

- ✅ Autenticación con correo institucional (@udea.edu.co)
- 📦 Publicación de artículos para intercambio
- 🤝 Sistema de propuestas de trueque
- 💬 Mensajería entre usuarios
- 🎨 Interfaz moderna y responsive

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Routing**: React Router 7
- **Estilos**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Deploy**: Vercel
- **CI/CD**: GitHub Actions

## 📋 Requisitos Previos

- Node.js >= 20.0.0
- npm >= 9.0.0

## 🏃‍♂️ Instalación y Ejecución Local

```bash
# Clonar el repositorio
git clone https://github.com/cristinavergara1/Trueques-Udea.git

# Entrar al directorio
cd Trueques-Udea

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

## 🏗️ Build de Producción

```bash
# Generar build optimizado
npm run build

# Preview del build
npm run preview
```

## 🚢 Deploy en Vercel

### Opción 1: Deploy Automático con GitHub Actions

El proyecto tiene configurado CI/CD automático. Cada push a `main` despliega automáticamente a Vercel.

#### Configurar Secrets en GitHub:

1. Ve a tu repositorio → **Settings** → **Secrets and variables** → **Actions**
2. Agrega los siguientes secrets:

```
VERCEL_TOKEN          → Token de Vercel (desde vercel.com/account/tokens)
VERCEL_ORG_ID         → ID de tu organización (desde .vercel/project.json)
VERCEL_PROJECT_ID     → ID del proyecto (desde .vercel/project.json)
```

#### Obtener los IDs de Vercel:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login y vincular proyecto
vercel login
vercel link

# Los IDs estarán en .vercel/project.json
```

### Opción 2: Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy a producción
vercel --prod
```

## 📁 Estructura del Proyecto

```
udea-trueques/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD GitHub Actions
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   └── ui/             # Componentes shadcn/ui
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── PublicationsPage.tsx
│   │   │   ├── CreatePublicationPage.tsx
│   │   │   ├── ProposalsPage.tsx
│   │   │   └── MessagesPage.tsx
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── styles/
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   └── theme.css
│   └── main.tsx
├── vercel.json                 # Configuración Vercel
├── vite.config.ts              # Configuración Vite
└── package.json
```

## 🔄 CI/CD Pipeline

El workflow de GitHub Actions incluye:

### 1. **Build and Test**
- ✅ Checkout del código
- ✅ Setup de Node.js 20
- ✅ Instalación de dependencias
- ✅ Build del proyecto
- ✅ Upload de artefactos

### 2. **Deploy Production** (push a main)
- 🚀 Deploy automático a Vercel Production
- 📝 Comentario en el commit con URL de despliegue

### 3. **Deploy Preview** (pull requests)
- 🔍 Deploy de preview para PRs
- 💬 Comentario en el PR con URL de preview

## 🌐 URLs

- **Producción**: https://trueques-udea.vercel.app (configurar después del primer deploy)
- **Preview**: Se genera automáticamente para cada PR

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Roadmap

- [ ] Implementar backend (Java Spring Boot)
- [ ] Autenticación JWT real
- [ ] Base de datos PostgreSQL
- [ ] Sistema de notificaciones
- [ ] Chat en tiempo real
- [ ] Sistema de valoraciones
- [ ] Búsqueda y filtros avanzados


## 📄 Licencia

Este proyecto es parte de un trabajo académico de la Universidad de Antioquia.

  