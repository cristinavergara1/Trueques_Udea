import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PublicationsPage from "./pages/PublicationsPage";
import PublicationDetailPage from "./pages/PublicationDetailPage";
import CreatePublicationPage from "./pages/CreatePublicationPage";
import ProposalsPage from "./pages/ProposalsPage";
import MessagesPage from "./pages/MessagesPage";
import CodeExportPage from "./pages/CodeExportPage";
import MyExchangesPage from "./pages/MyExchangesPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/login", Component: LoginPage },
  { path: "/registro", Component: RegisterPage },
  { path: "/publicaciones", Component: PublicationsPage },
  { path: "/publicaciones/:id", Component: PublicationDetailPage },
  { path: "/publicaciones/crear", Component: CreatePublicationPage },
  { path: "/propuestas", Component: ProposalsPage },
  { path: "/mensajes", Component: MessagesPage },
  { path: "/perfil", Component: ProfilePage },
  { path: "/admin", Component: AdminPage },
  { path: "/codigo", Component: CodeExportPage },
]);
