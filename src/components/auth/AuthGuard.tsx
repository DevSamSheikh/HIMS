import React, { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // In a real app, this would check for a valid token in localStorage or cookies
    // For demo purposes, we'll just check if there's any user data in localStorage
    const checkAuth = () => {
      const user = localStorage.getItem("hims_user");
      setIsAuthenticated(!!user);
    };

    checkAuth();
  }, []);

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default AuthGuard;
