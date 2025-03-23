import React from "react";
import { Outlet } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

const LaboratoryLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Laboratory Management
        </h1>
        <p className="text-muted-foreground">
          Manage laboratory tests, samples, results, and reports
        </p>
      </div>

      <Tabs
        defaultValue="dashboard"
        value={
          currentPath.includes("/laboratory/tests")
            ? "tests"
            : currentPath.includes("/laboratory/samples")
              ? "samples"
              : currentPath.includes("/laboratory/results")
                ? "results"
                : currentPath.includes("/laboratory/reports")
                  ? "reports"
                  : currentPath.includes("/laboratory/packages")
                    ? "packages"
                    : currentPath.includes("/laboratory/machines")
                      ? "machines"
                      : currentPath.includes("/laboratory/settings")
                        ? "settings"
                        : "dashboard"
        }
        className="w-full"
        onValueChange={(value) => {
          navigate(`/laboratory/${value === "dashboard" ? "" : value}`);
        }}
      >
        <TabsList className="grid grid-cols-8 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tests">Test Catalog</TabsTrigger>
          <TabsTrigger value="samples">Sample Management</TabsTrigger>
          <TabsTrigger value="results">Results Entry</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="machines">Machines</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
};

export default LaboratoryLayout;
