import React, { useState, useEffect } from "react";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import StatisticsPanel from "./dashboard/StatisticsPanel";
import TasksPanel from "./dashboard/TasksPanel";
import ModulesGrid from "./dashboard/ModulesGrid";

interface HomeProps {
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  theme?: "light" | "dark";
}

const Home = ({
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

          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
            <div className="container mx-auto space-y-6 max-w-7xl">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {userName}. Here's an overview of your healthcare
                system.
              </p>

              <StatisticsPanel className="mt-6" />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                  <TasksPanel
                    onCompleteTask={handleCompleteTask}
                    onReassignTask={handleReassignTask}
                  />
                </div>
                <div className="lg:col-span-1">
                  {/* This could be a quick actions panel, notifications, or calendar widget */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm h-full">
                    <h2 className="text-xl font-semibold mb-4">
                      Quick Actions
                    </h2>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        Register New Patient
                      </button>
                      <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                        Schedule Appointment
                      </button>
                      <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                        Process Payment
                      </button>
                      <button className="w-full text-left p-3 bg-orange-50 dark:bg-orange-900/20 rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                        Generate Reports
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <ModulesGrid
                onModuleSelect={handleModuleSelect}
                onViewAllModules={handleViewAllModules}
              />
            </div>
          </main>
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
