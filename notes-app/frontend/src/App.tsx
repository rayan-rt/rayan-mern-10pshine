import React from "react";
import { logger } from "./utils/logger";
import { useUserContext } from "./contexts/user.context";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  ProfilePage,
  ResetPasswordPage,
  SignupPage,
  VerifyEmailPage,
} from "./pages";
import { ChangePasswordForm, Navbar, UpdateUsernameForm } from "./components";
// --

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUserContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-medium animate-pulse">Authenticating...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!user.isVerified) return <Navigate to="/verify-email" replace />;

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUserContext();

  if (loading) return null;
  if (!user) return <>{children}</>;

  return <Navigate to={user.isVerified ? "/" : "/verify-email"} replace />;
};

function App() {
  const { user } = useUserContext();

  React.useEffect(() => {
    logger.info("App component mounted");
  }, []);

  return (
    <Router>
      <div className="min-h-screen w-[90%] mx-auto bg-linear-to-br from-blue-200 to-blue-400 p-8 shadow-lg">
        {user && user.isVerified && <Navbar />}

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              user?.isVerified ? (
                <Navigate to="/" replace />
              ) : (
                <VerifyEmailPage />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-username"
            element={
              <ProtectedRoute>
                <UpdateUsernameForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePasswordForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
