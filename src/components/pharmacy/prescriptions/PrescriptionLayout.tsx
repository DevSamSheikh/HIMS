import React from "react";
import { Outlet } from "react-router-dom";

const PrescriptionLayout = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-950 h-full">
      <h1 className="text-2xl font-bold mb-6">Prescription Management</h1>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default PrescriptionLayout;
