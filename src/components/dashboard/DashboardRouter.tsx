import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import PharmacyDashboard from "./PharmacyDashboard";
import OPDDashboard from "./OPDDashboard";
import IPDDashboard from "./IPDDashboard";
import LabDashboard from "./LabDashboard";

const DashboardRouter = () => {
  const location = useLocation();
  const path = location.pathname;

  // Determine which dashboard to render based on the current path
  const renderDashboard = () => {
    if (path.includes("/pharmacy")) {
      return <PharmacyDashboard />;
    } else if (path.includes("/opd")) {
      return <OPDDashboard />;
    } else if (path.includes("/ipd")) {
      return <IPDDashboard />;
    } else if (path.includes("/lab")) {
      return <LabDashboard />;
    } else if (path.includes("/laboratory")) {
      return <Outlet />; // Use Outlet for nested routes
    } else {
      // Default to admin dashboard
      return <AdminDashboard />;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {renderDashboard()}
    </main>
  );
};

export default DashboardRouter;
