import { Routes, Route } from "react-router-dom";
import routes from "tempo-routes";
import { Home } from "./components/home";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import DashboardRouter from "./components/dashboard/DashboardRouter";
import ModuleSelectionPage from "./components/modules/ModuleSelectionPage";
import AuthGuard from "./components/auth/AuthGuard";

function App() {
  // For the tempo routes - use the routes object directly without useRoutes
  // since we're already inside a Router from main.tsx

  return (
    <>
      {/* Render tempo routes conditionally */}
      {import.meta.env.VITE_TEMPO && (
        <Routes>
          {routes.map((route: any) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/module-selection" element={<ModuleSelectionPage />} />
        <Route
          path="/dashboard/*"
          element={
            <AuthGuard>
              <DashboardRouter />
            </AuthGuard>
          }
        />
        <Route
          path="/billing-details"
          element={
            <AuthGuard>
              <ModuleSelectionPage />
            </AuthGuard>
          }
        />
        {/* Add more routes here */}

        {/* Add this before any catchall route */}
        {import.meta.env.VITE_TEMPO && (
          <Route path="/tempobook/*" element={null} />
        )}
      </Routes>
    </>
  );
}

export default App;
