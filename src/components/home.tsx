import React, { useState, useEffect } from "react";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import DashboardRouter from "./dashboard/DashboardRouter";

interface HomeProps {
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  theme?: "light" | "dark";
}

export const Home = ({
  userName = "Dr. Smith",
  userAvatar = "",
  notificationCount = 3,
  theme: initialTheme = "light",
}: HomeProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint in tailwind
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleModuleSelect = (moduleId: string) => {
    // Handle module selection - in a real app, this would navigate to the module
    console.log(`Selected module: ${moduleId}`);
  };

  const handleViewAllModules = () => {
    // Handle view all modules - in a real app, this would navigate to the modules page
    console.log("View all modules");
  };

  const handleCompleteTask = (taskId: string) => {
    // Handle task completion - in a real app, this would update the task status
    console.log(`Completed task: ${taskId}`);
  };

  const handleReassignTask = (taskId: string) => {
    // Handle task reassignment - in a real app, this would open a dialog to reassign the task
    console.log(`Reassigning task: ${taskId}`);
  };

  return (
    <div
      className={`flex h-screen flex-col overflow-hidden ${theme === "dark" ? "dark" : ""}`}
    >
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
            isMobile={false}
          />
        )}

        <div className="flex flex-col flex-1">
          <Header
            theme={theme}
            onThemeToggle={handleThemeToggle}
            userName={userName}
            userAvatar={userAvatar}
            notificationCount={notificationCount}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
            isMobile={isMobile}
          />

          <DashboardRouter />
        </div>
      </div>

      {/* Mobile sidebar - only render when needed */}
      {isMobile && sidebarCollapsed && (
        <Sidebar
          isMobile={true}
          collapsed={false}
          onToggleCollapse={handleToggleSidebar}
        />
      )}
    </div>
  );
};

export default Home;
