import React, { useState, useEffect } from "react";
import StatisticsPanel from "./StatisticsPanel";
import { Pill, ShoppingCart, AlertCircle, Truck } from "lucide-react";
import DashboardSkeleton from "./DashboardSkeleton";
import WeeklySaleschart from "./widgets/WeeklySaleschart";
import CustomerSatisfactionchart from "./widgets/CustomerSatisfactionchart";
import Comparisonchart from "./widgets/Comparisonchart";
import TopProductschart from "./widgets/TopProductschart";
import VolumeChart from "./widgets/VolumeChart";

const NewPharmacyDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container bg-gray-100/50 px-5 py-4 rounded-xl mx-auto space-y-6 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight font-roboto">
        Pharmacy Dashboard
      </h1>
      <p className="text-muted-foreground font-roboto">
        Manage medication inventory, prescriptions, and pharmacy operations.
      </p>

      {/* First section: Statistics */}
      <section className="w-full bg-ColorFul">
        <StatisticsPanel
          statistics={[
            {
              title: "Total  Medications",
              value: "21,048",
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
      </section>

      {/* Second section: Weekly Sales, Customer Satisfaction, Comparison */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="md:col-span-2 lg:col-span-2 col-span-1">
          <WeeklySaleschart />
        </div>
        <div className="col-span-1">
          <CustomerSatisfactionchart />
        </div>
        <div className="col-span-1">
          <Comparisonchart />
        </div>
      </section>

      {/* Third section: Top Products, Volume */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <TopProductschart />
        </div>
        <div className="col-span-1">
          <VolumeChart />
        </div>
      </section>
    </div>
  );
};

export default NewPharmacyDashboard;
