import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SettingsDrawer from "./SettingsDrawer";

const MainLayout = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Initialize theme from localStorage if available
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark");
      }
    }
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="min-h-screen bg-background">
      <SettingsDrawer
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
      />
      <Outlet />
    </div>
  );
};

export default MainLayout;
