import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ModuleCard from "./ModuleCard";
import PricingSummary from "./PricingSummary";
import ModuleDetailsModal from "./ModuleDetailsModal";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ModuleSelectionProps {
  onComplete?: (selectedModules: string[]) => void;
}

interface Feature {
  name: string;
  included: boolean;
}

interface Module {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: string;
  features: Feature[];
}

const ModuleSelection = ({ onComplete }: ModuleSelectionProps) => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [billingCycle, setBillingCycle] = useState<
    "monthly" | "yearly" | "biennial"
  >("monthly");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const modules: Module[] = [
    {
      id: "patient-management",
      name: "Patient Management",
      description:
        "Register and manage patient records with comprehensive history tracking",
      price: 50,
      icon: "👤",
      category: "Core",
      features: [
        { name: "Patient Registration", included: true },
        { name: "Medical History Tracking", included: true },
        { name: "Insurance Management", included: true },
        { name: "Document Upload", included: true },
        { name: "Patient Portal Access", included: true },
        { name: "Custom Fields", included: false },
        { name: "Advanced Reporting", included: false },
      ],
    },
    {
      id: "appointments",
      name: "Appointments",
      description: "Schedule and manage appointments with calendar integration",
      price: 30,
      icon: "📅",
      category: "Core",
      features: [
        { name: "Calendar View", included: true },
        { name: "Appointment Scheduling", included: true },
        { name: "Reminders & Notifications", included: true },
        { name: "Online Booking", included: false },
        { name: "Recurring Appointments", included: false },
        { name: "Wait List Management", included: false },
      ],
    },
    {
      id: "billing",
      name: "Billing & Invoicing",
      description:
        "Generate invoices and manage payments with insurance integration",
      price: 40,
      icon: "💰",
      category: "Finance",
      features: [
        { name: "Invoice Generation", included: true },
        { name: "Payment Processing", included: true },
        { name: "Insurance Billing", included: true },
        { name: "Financial Reporting", included: true },
        { name: "Automated Billing", included: false },
        { name: "Claims Management", included: false },
      ],
    },
    {
      id: "pharmacy",
      name: "Pharmacy Management",
      description:
        "Manage medications and prescriptions with inventory tracking",
      price: 45,
      icon: "💊",
      category: "Clinical",
      features: [
        { name: "Medication Management", included: true },
        { name: "Prescription Management", included: true },
        { name: "Inventory Tracking", included: true },
        { name: "Drug Interaction Checks", included: true },
        { name: "Automated Refills", included: false },
        { name: "Compounding Management", included: false },
      ],
    },
    {
      id: "laboratory",
      name: "Laboratory",
      description:
        "Track lab tests and results with integration to diagnostic equipment",
      price: 35,
      icon: "🧪",
      category: "Clinical",
      features: [
        { name: "Test Ordering", included: true },
        { name: "Results Management", included: true },
        { name: "Sample Tracking", included: true },
        { name: "Lab Reports", included: true },
        { name: "Equipment Integration", included: false },
        { name: "Reference Ranges", included: false },
      ],
    },
    {
      id: "reports",
      name: "Reports & Analytics",
      description: "Generate insights and reports with customizable dashboards",
      price: 25,
      icon: "📊",
      category: "Administrative",
      features: [
        { name: "Standard Reports", included: true },
        { name: "Custom Reports", included: true },
        { name: "Data Export", included: true },
        { name: "Interactive Dashboards", included: false },
        { name: "Predictive Analytics", included: false },
        { name: "Scheduled Reports", included: false },
      ],
    },
    {
      id: "inventory",
      name: "Inventory Management",
      description: "Track and manage medical supplies and equipment",
      price: 30,
      icon: "📦",
      category: "Administrative",
      features: [
        { name: "Stock Management", included: true },
        { name: "Purchase Orders", included: true },
        { name: "Supplier Management", included: true },
        { name: "Barcode Scanning", included: false },
        { name: "Automated Reordering", included: false },
        { name: "Expiry Tracking", included: false },
      ],
    },
    {
      id: "telemedicine",
      name: "Telemedicine",
      description: "Conduct virtual consultations with video integration",
      price: 55,
      icon: "📱",
      category: "Clinical",
      features: [
        { name: "Video Consultations", included: true },
        { name: "Secure Messaging", included: true },
        { name: "Digital Prescriptions", included: true },
        { name: "Screen Sharing", included: true },
        { name: "Group Sessions", included: false },
        { name: "Mobile App", included: false },
      ],
    },
  ];

  // Extract all unique categories
  const categories = Array.from(
    new Set(modules.map((module) => module.category)),
  );

  // Find min and max prices
  const minPrice = Math.min(...modules.map((module) => module.price));
  const maxPrice = Math.max(...modules.map((module) => module.price));

  // Initialize price range to min and max
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, []);

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) => {
      if (prev.includes(moduleId)) {
        return prev.filter((id) => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };

  const handleComplete = () => {
    setIsLoading(true);
    if (onComplete) {
      onComplete(selectedModules);
    }
  };

  const handleViewDetails = (module: Module) => {
    setSelectedModule(module);
    setIsDetailsModalOpen(true);
  };

  const handleBillingCycleChange = (
    cycle: "monthly" | "yearly" | "biennial",
  ) => {
    setBillingCycle(cycle);
  };

  // Filter modules based on search, categories, and price range
  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(module.category);
    const matchesPrice =
      module.price >= priceRange[0] && module.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Calculate total price based on selected modules and billing cycle
  const calculatePrice = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return 0;

    switch (billingCycle) {
      case "yearly":
        return module.price * 10; // 2 months free
      case "biennial":
        return module.price * 20 * 0.8; // 20% discount
      default:
        return module.price;
    }
  };

  const totalPrice = selectedModules.reduce(
    (sum, moduleId) => sum + calculatePrice(moduleId),
    0,
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="p-4 sm:p-6 md:p-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {(selectedCategories.length > 0 ||
                  priceRange[0] > minPrice ||
                  priceRange[1] < maxPrice) && (
                  <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {selectedCategories.length +
                      (priceRange[0] > minPrice || priceRange[1] < maxPrice
                        ? 1
                        : 0)}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories((prev) => [
                                ...prev,
                                category,
                              ]);
                            } else {
                              setSelectedCategories((prev) =>
                                prev.filter((c) => c !== category),
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className="cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[minPrice, maxPrice]}
                      min={minPrice}
                      max={maxPrice}
                      step={5}
                      value={priceRange}
                      onValueChange={(value) =>
                        setPriceRange(value as [number, number])
                      }
                      className="my-4"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCategories([]);
                      setPriceRange([minPrice, maxPrice]);
                    }}
                    className="w-full"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {filteredModules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredModules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    id={module.id}
                    name={module.name}
                    description={module.description}
                    price={
                      billingCycle === "monthly"
                        ? module.price
                        : billingCycle === "yearly"
                          ? module.price * 10
                          : module.price * 20 * 0.8
                    }
                    icon={module.icon}
                    features={module.features}
                    selected={selectedModules.includes(module.id)}
                    onClick={() => toggleModule(module.id)}
                    onViewDetails={() => handleViewDetails(module)}
                    billingCycle={billingCycle}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-medium">No modules found</h3>
                <p className="text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                    setPriceRange([minPrice, maxPrice]);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          <div className="w-full lg:w-auto">
            <div className="sticky top-4">
              <PricingSummary
                selectedModules={modules
                  .filter((module) => selectedModules.includes(module.id))
                  .map((module) => ({
                    id: module.id,
                    name: module.name,
                    price:
                      billingCycle === "monthly"
                        ? module.price
                        : billingCycle === "yearly"
                          ? module.price * 10
                          : module.price * 20 * 0.8,
                    billingCycle,
                  }))}
                totalPrice={totalPrice}
                billingCycle={billingCycle}
                onCheckout={handleComplete}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Module Details Modal */}
      <ModuleDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        module={selectedModule}
        onSelect={() => selectedModule && toggleModule(selectedModule.id)}
        isSelected={
          selectedModule ? selectedModules.includes(selectedModule.id) : false
        }
        onBillingCycleChange={handleBillingCycleChange}
        billingCycle={billingCycle}
      />
    </div>
  );
};

export default ModuleSelection;
