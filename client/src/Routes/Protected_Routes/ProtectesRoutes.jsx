import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../AuthContex/AuthContex";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // While loading, render a loading indicator
  if (loading) {
    return <div>Loading...</div>; // Customize with a spinner if desired
  }

  // If there's no user, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role matches any of the allowedRoles
  const hasAccess = allowedRoles.includes(user.role);

  // If no matching role found, redirect to notfound
  if (!hasAccess) {
    return <Navigate to="/notfound" replace />;
  }

  // If the user has access, render the protected component
  return <Outlet />;
};

export default ProtectedRoute;