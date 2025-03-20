import React from "react";
import { Outlet } from "react-router-dom";

const SecurityLayout = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-950 h-full">
      <Outlet />
    </div>
  );
};

export default SecurityLayout;
