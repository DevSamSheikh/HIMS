import React, { useState, useEffect } from "react";
import StatisticsPanel from "./StatisticsPanel";
import TasksPanel from "./TasksPanel";
import { Pill, ShoppingCart, Package, AlertCircle, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import LineChart from "./charts/LineChart";
import BarChart from "./charts/BarChart";
import DashboardSkeleton from "./DashboardSkeleton";

const PharmacyDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Chart data
  const salesData = [
    { label: "Mon", value: 12500 },
    { label: "Tue", value: 14200 },
    { label: "Wed", value: 16800 },
    { label: "Thu", value: 14500 },
    { label: "Fri", value: 18900 },
    { label: "Sat", value: 21500 },
    { label: "Sun", value: 16200 },
  ];

  const topSellingMeds = [
    { label: "Amoxicillin", value: 245, color: "bg-blue-500" },
    { label: "Paracetamol", value: 189, color: "bg-green-500" },
    { label: "Ibuprofen", value: 156, color: "bg-purple-500" },
    { label: "Metformin", value: 132, color: "bg-amber-500" },
    { label: "Atorvastatin", value: 98, color: "bg-red-500" },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  // Mock data for inventory items
  const inventoryItems = [
    {
      name: "Amoxicillin 500mg",
      stock: 1245,
      threshold: 200,
      status: "normal",
    },
    { name: "Ibuprofen 200mg", stock: 856, threshold: 150, status: "normal" },
    { name: "Paracetamol 500mg", stock: 124, threshold: 200, status: "low" },
    { name: "Metformin 500mg", stock: 45, threshold: 100, status: "critical" },
    { name: "Atorvastatin 20mg", stock: 356, threshold: 100, status: "normal" },
  ];

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-500 bg-red-50 dark:bg-red-900/20";
      case "low":
        return "text-amber-500 bg-amber-50 dark:bg-amber-900/20";
      case "normal":
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getStockPercentage = (stock: number, threshold: number) => {
    // Calculate percentage with a minimum of 5% for visibility
    const percentage = Math.max(
      5,
      Math.min(100, (stock / (threshold * 3)) * 100),
    );
    return percentage;
  };

  return (
    <div className="container mx-auto space-y-6 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight">Pharmacy Dashboard</h1>
      <p className="text-muted-foreground">
        Manage medication inventory, prescriptions, and pharmacy operations.
      </p>

      <StatisticsPanel
        statistics={[
          {
            title: "Total Medications",
            value: "2,548",
            description: "Items in inventory",
            icon: <Pill className="h-5 w-5" />,
            trend: { value: 3, isPositive: true },
          },
          {
            title: "Prescriptions Today",
            value: "124",
            description: "Processed today",
            icon: <ShoppingCart className="h-5 w-5" />,
            trend: { value: 12, isPositive: true },
          },
          {
            title: "Low Stock Items",
            value: "18",
            description: "Need reordering",
            icon: <AlertCircle className="h-5 w-5" />,
            trend: { value: 5, isPositive: false },
          },
          {
            title: "Incoming Shipments",
            value: "3",
            description: "Expected this week",
            icon: <Truck className="h-5 w-5" />,
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Weekly Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={salesData} height={200} />
            </CardContent>
          </Card>

          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Inventory Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.name}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(item.status)}`}
                      >
                        {item.stock} units
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={getStockPercentage(item.stock, item.threshold)}
                        className="h-2"
                      />
                      <span className="text-xs text-muted-foreground w-16">
                        {item.status === "critical"
                          ? "Critical"
                          : item.status === "low"
                            ? "Low"
                            : "Normal"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card className="w-full bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Pill className="mr-2 h-5 w-5" />
                Top Selling Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={topSellingMeds} height={200} />
            </CardContent>
          </Card>

          <TasksPanel
            tasks={[
              {
                id: "1",
                title: "Restock Paracetamol 500mg",
                module: "Pharmacy",
                priority: "high",
                dueDate: "2023-06-15",
              },
              {
                id: "2",
                title: "Verify incoming shipment",
                module: "Pharmacy",
                priority: "medium",
                dueDate: "2023-06-16",
              },
              {
                id: "3",
                title: "Update medication prices",
                module: "Pharmacy",
                priority: "low",
                dueDate: "2023-06-20",
              },
              {
                id: "4",
                title: "Check expiry dates",
                module: "Pharmacy",
                priority: "high",
                dueDate: "2023-06-15",
              },
            ]}
          />

          <Card className="w-full bg-card overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  Process Prescription
                </button>
                <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  Order Medications
                </button>
                <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  Generate Inventory Report
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
