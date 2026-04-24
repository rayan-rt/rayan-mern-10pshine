import React from "react";
import { logger } from "./utils/logger";
import { UserProvider } from "./contexts/user.provider";
import { useUserContext } from "./contexts/user.context";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  React.useEffect(() => {
    logger.info("App component mounted");
  }, []);

  return (
    <Router>
      <UserProvider>
        <div className="min-h-screen bg-slate-50 p-8">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <h1 className="text-3xl font-bold text-blue-600">
                    Dashboard - Welcome to your Notes
                  </h1>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page Mock</div>} />
            <Route path="/signup" element={<div>Signup Page Mock</div>} />
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
