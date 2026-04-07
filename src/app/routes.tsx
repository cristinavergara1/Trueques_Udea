import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PublicationsPage from "./pages/PublicationsPage";
import CreatePublicationPage from "./pages/CreatePublicationPage";
import ProposalsPage from "./pages/ProposalsPage";
import MessagesPage from "./pages/MessagesPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/login", Component: LoginPage },
  { path: "/registro", Component: RegisterPage },
  { path: "/publicaciones", Component: PublicationsPage },
  { path: "/publicaciones/crear", Component: CreatePublicationPage },
  { path: "/propuestas", Component: ProposalsPage },
  { path: "/mensajes", Component: MessagesPage },
]);
