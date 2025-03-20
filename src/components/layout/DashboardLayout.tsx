import React, { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* You can add header, sidebar, etc. here */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default DashboardLayout;
