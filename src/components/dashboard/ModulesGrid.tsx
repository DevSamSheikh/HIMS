import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Star } from "lucide-react";
import ModuleCard from "../modules/ModuleCard";

interface Module {
  id: string;
  title: string;
  description: string;
  price: number;
  features: Array<{ name: string; included: boolean }>;
  isActive: boolean;
  lastAccessed?: string;
  hasUpdates?: boolean;
}

interface ModulesGridProps {
  modules?: Module[];
  onModuleSelect?: (moduleId: string) => void;
  onViewAllModules?: () => void;
}

const ModulesGrid = ({
  modules = [
    {
      id: "patient-management",
      title: "Patient Management",
      description:
        "Comprehensive patient data management with registration, search, and record viewing capabilities.",
      price: 99.99,
      features: [
        { name: "Patient Registration", included: true },
        { name: "Medical History Tracking", included: true },
        { name: "Insurance Management", included: true },
        { name: "Document Upload", included: false },
      ],
      isActive: true,
      lastAccessed: "2 hours ago",
      hasUpdates: false,
    },
    {
      id: "appointments",
      title: "Appointments",
      description:
        "Schedule and manage patient appointments with calendar integration and automated reminders.",
      price: 79.99,
      features: [
        { name: "Calendar Integration", included: true },
        { name: "Automated Reminders", included: true },
        { name: "Recurring Appointments", included: true },
        { name: "Video Consultations", included: false },
      ],
      isActive: true,
      lastAccessed: "1 day ago",
      hasUpdates: true,
    },
    {
      id: "billing",
      title: "Billing",
      description:
        "Streamline healthcare billing with insurance claim processing and patient invoicing.",
      price: 129.99,
      features: [
        { name: "Insurance Claims", included: true },
        { name: "Patient Invoicing", included: true },
        { name: "Payment Processing", included: true },
        { name: "Financial Reporting", included: true },
      ],
      isActive: true,
      lastAccessed: "3 days ago",
      hasUpdates: false,
    },
    {
      id: "admin",
      title: "Administrative Tasks",
      description:
        "Manage staff, resources, and facility operations efficiently.",
      price: 89.99,
      features: [
        { name: "Staff Management", included: true },
        { name: "Resource Allocation", included: true },
        { name: "Inventory Tracking", included: true },
        { name: "Reporting Tools", included: false },
      ],
      isActive: false,
      lastAccessed: null,
      hasUpdates: false,
    },
    {
      id: "analytics",
      title: "Analytics & Reporting",
      description:
        "Gain insights with comprehensive analytics and customizable reports.",
      price: 149.99,
      features: [
        { name: "Custom Dashboards", included: true },
        { name: "Data Visualization", included: true },
        { name: "Export Capabilities", included: true },
        { name: "Predictive Analytics", included: false },
      ],
      isActive: false,
      lastAccessed: null,
      hasUpdates: false,
    },
  ],
  onModuleSelect = () => {},
  onViewAllModules = () => {},
}: ModulesGridProps) => {
  // Filter active modules to display first
  const activeModules = modules.filter((module) => module.isActive);
  const inactiveModules = modules.filter((module) => !module.isActive);

  // Only show up to 3 active modules in the grid
  const displayedActiveModules = activeModules.slice(0, 3);

  return (
    <div className="w-full bg-card dark:bg-gray-900 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Modules</h2>
        <Button variant="outline" onClick={onViewAllModules}>
          View All Modules <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedActiveModules.map((module) => (
          <Card
            key={module.id}
            className={`cursor-pointer transition-all hover:shadow-md ${module.hasUpdates ? "border-blue-400 dark:border-blue-600" : ""}`}
            onClick={() => onModuleSelect(module.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{module.title}</CardTitle>
                {module.hasUpdates && (
                  <Badge className="bg-blue-500">Updates</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {module.description}
              </p>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>Last accessed: {module.lastAccessed || "Never"}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Module Selection Card */}
        {inactiveModules.length > 0 && (
          <Card className="cursor-pointer transition-all hover:shadow-md border-dashed border-2 flex flex-col justify-center items-center p-6">
            <Star className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">Discover More Modules</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
              Enhance your HIMS with {inactiveModules.length} additional modules
            </p>
            <Button onClick={onViewAllModules}>Browse Modules</Button>
          </Card>
        )}
      </div>

      {/* Preview of available modules section */}
      {inactiveModules.length > 0 && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Available Modules</h2>
            <Button variant="ghost" onClick={onViewAllModules}>
              View All
            </Button>
          </div>

          <div className="flex overflow-x-auto pb-4 gap-6 hide-scrollbar">
            {inactiveModules.slice(0, 3).map((module) => (
              <ModuleCard
                key={module.id}
                id={module.id}
                title={module.title}
                description={module.description}
                price={module.price}
                features={module.features}
                isSelected={false}
                onToggle={() => {}}
                onViewDetails={() => onModuleSelect(module.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulesGrid;
