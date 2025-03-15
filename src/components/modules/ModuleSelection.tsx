import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  ArrowRight,
  X,
  ChevronLeft,
  CreditCard,
  Download,
  Check,
  Tag,
  AlertCircle,
} from "lucide-react";
import ModuleCard from "./ModuleCard";
import PricingSummary from "./PricingSummary";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Module {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  features: {
    name: string;
    included: boolean;
  }[];
}

interface ModuleSelectionProps {
  modules?: Module[];
  onComplete?: (selectedModules: string[]) => void;
  onBack?: () => void;
}

const ModuleSelection = ({
  modules = [
    {
      id: "patient-management",
      title: "Patient Management",
      description:
        "Comprehensive patient data management with registration, search, and record viewing capabilities.",
      price: 49.99,
      category: "core",
      features: [
        { name: "Patient Registration", included: true },
        { name: "Medical History Tracking", included: true },
        { name: "Insurance Management", included: true },
        { name: "Document Upload", included: true },
        { name: "Custom Fields", included: false },
      ],
    },
    {
      id: "appointments",
      title: "Appointments",
      description:
        "Schedule and manage patient appointments with calendar integration and automated reminders.",
      price: 29.99,
      category: "core",
      features: [
        { name: "Calendar Integration", included: true },
        { name: "Automated Reminders", included: true },
        { name: "Recurring Appointments", included: true },
        { name: "Online Booking", included: false },
      ],
    },
    {
      id: "billing",
      title: "Billing",
      description:
        "Generate invoices, process payments, and manage insurance claims efficiently.",
      price: 39.99,
      category: "finance",
      features: [
        { name: "Invoice Generation", included: true },
        { name: "Payment Processing", included: true },
        { name: "Insurance Claims", included: true },
        { name: "Financial Reporting", included: true },
      ],
    },
    {
      id: "inventory",
      title: "Inventory Management",
      description:
        "Track medical supplies, medications, and equipment with automated reordering.",
      price: 34.99,
      category: "operations",
      features: [
        { name: "Stock Tracking", included: true },
        { name: "Automated Reordering", included: true },
        { name: "Expiration Alerts", included: true },
        { name: "Supplier Management", included: false },
      ],
    },
    {
      id: "reporting",
      title: "Advanced Reporting",
      description:
        "Generate detailed reports and analytics on all aspects of your healthcare facility.",
      price: 24.99,
      category: "analytics",
      features: [
        { name: "Custom Reports", included: true },
        { name: "Data Visualization", included: true },
        { name: "Export Options", included: true },
        { name: "Scheduled Reports", included: false },
      ],
    },
    {
      id: "telemedicine",
      title: "Telemedicine",
      description:
        "Conduct virtual consultations with secure video conferencing and digital prescriptions.",
      price: 59.99,
      category: "clinical",
      features: [
        { name: "Video Consultations", included: true },
        { name: "Digital Prescriptions", included: true },
        { name: "Secure Messaging", included: true },
        { name: "Virtual Waiting Room", included: true },
      ],
    },
  ],
  onComplete = () => {},
  onBack = () => {},
}: ModuleSelectionProps) => {
  const navigate = useNavigate();
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Calculate pricing whenever selected modules change
  useEffect(() => {
    const selected = modules.filter((module) =>
      selectedModules.includes(module.id),
    );
    const newSubtotal = selected.reduce((sum, module) => sum + module.price, 0);

    // Apply discount based on number of selected modules
    let newDiscount = 0;
    if (selected.length >= 3) {
      newDiscount = newSubtotal * 0.1; // 10% discount for 3+ modules
    } else if (selected.length === 2) {
      newDiscount = newSubtotal * 0.05; // 5% discount for 2 modules
    }

    setSubtotal(newSubtotal);
    setDiscount(newDiscount);
    setTotal(newSubtotal - newDiscount - promoDiscount);
  }, [selectedModules, modules, promoDiscount]);

  // Validate and apply promo code
  const applyPromoCode = () => {
    // Reset previous promo state
    setPromoError("");
    setPromoDiscount(0);

    // Mock promo codes
    const promoCodes = {
      WELCOME10: 0.1, // 10% off
      HEALTH20: 0.2, // 20% off
      CLINIC15: 0.15, // 15% off
      FIRST25: 0.25, // 25% off
    };

    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    const discountRate =
      promoCodes[promoCode.toUpperCase() as keyof typeof promoCodes];

    if (discountRate) {
      const newPromoDiscount = (subtotal - discount) * discountRate;
      setPromoDiscount(newPromoDiscount);
    } else {
      setPromoError("Invalid promo code");
    }
  };

  const handleToggleModule = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedModules((prev) => [...prev, id]);
    } else {
      setSelectedModules((prev) => prev.filter((moduleId) => moduleId !== id));
    }
  };

  const handleViewDetails = (id: string) => {
    console.log(`Viewing details for module: ${id}`);
    // Implementation for viewing module details would go here
  };

  const handleCheckout = () => {
    setShowPayment(true);
  };

  const handlePayment = () => {
    setIsProcessingPayment(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);

      // Navigate to home/dashboard with selected modules
      navigate("/", {
        state: {
          selectedModules,
          newSubscription: true,
        },
      });

      // Call the onComplete callback as well
      onComplete(selectedModules);
    }, 1500);
  };

  const handleDownloadQuote = () => {
    setIsGeneratingQuote(true);

    // Simulate PDF generation
    setTimeout(() => {
      setIsGeneratingQuote(false);
      // In a real implementation, this would generate and download a PDF
      console.log("Quote PDF generated with the following details:", {
        selectedModules: modules.filter((m) => selectedModules.includes(m.id)),
        pricing: { subtotal, discount, total },
        customer: {
          facilityName: "Your Healthcare Facility",
          date: new Date().toLocaleDateString(),
          quoteNumber: `HIMS-${Math.floor(Math.random() * 10000)}`,
        },
      });

      // Show success message
      alert("Quote downloaded successfully!");
    }, 1500);
  };

  const handleFilterChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedFilters((prev) => [...prev, category]);
    } else {
      setSelectedFilters((prev) => prev.filter((c) => c !== category));
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Get unique categories from modules
  const categories = [
    "all",
    ...new Set(modules.map((module) => module.category)),
  ];

  // Filter modules based on search query, active category, and selected filters
  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || module.category === activeCategory;

    const matchesFilters =
      selectedFilters.length === 0 || selectedFilters.includes(module.category);

    return matchesSearch && matchesCategory && matchesFilters;
  });

  return (
    <div className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-950">
      <div className="p-4 sm:p-6 md:p-8">
        {/* No header needed here as it's now in the parent component */}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Module selection */}
          <div className="flex-1">
            {/* Search and filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </Button>
                )}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  >
                    <Filter className="text-gray-500 h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Filter by Category</h4>
                    <div className="space-y-2">
                      {categories
                        .filter((c) => c !== "all")
                        .map((category) => (
                          <div
                            key={category}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`filter-${category}`}
                              checked={selectedFilters.includes(category)}
                              onCheckedChange={(checked) =>
                                handleFilterChange(category, checked === true)
                              }
                            />
                            <Label
                              htmlFor={`filter-${category}`}
                              className="capitalize"
                            >
                              {category}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Category tabs */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
              <Tabs
                defaultValue="all"
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="w-full"
              >
                <TabsList className="w-full justify-start overflow-x-auto pb-px">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="capitalize text-sm"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Module cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  id={module.id}
                  title={module.title}
                  description={module.description}
                  price={module.price}
                  features={module.features}
                  isSelected={selectedModules.includes(module.id)}
                  onToggle={handleToggleModule}
                  onViewDetails={handleViewDetails}
                />
              ))}
              {filteredModules.length === 0 && (
                <div className="col-span-full flex justify-center items-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <p className="text-gray-500 dark:text-gray-400">
                    No modules found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Pricing summary */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 mt-8 lg:mt-0 lg:ml-6">
            <div className="sticky top-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Subscription Summary
              </h2>

              {/* Selected modules list */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Selected Modules
                </h3>
                <div className="space-y-2">
                  {selectedModules.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No modules selected
                    </p>
                  ) : (
                    modules
                      .filter((module) => selectedModules.includes(module.id))
                      .map((module) => (
                        <div
                          key={module.id}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm">{module.title}</span>
                          <span className="text-sm font-medium">
                            ${module.price.toFixed(2)}/month
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-3 py-4 border-t border-b border-gray-200 dark:border-gray-800">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="text-sm">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    Bundle Discount
                  </span>
                  <span className="text-sm text-green-600">
                    -${discount.toFixed(2)}
                  </span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      Promo Discount
                    </span>
                    <span className="text-sm text-green-600">
                      -${promoDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-medium pt-2">
                  <span>Total</span>
                  <div className="text-right">
                    <div className="text-lg">${total.toFixed(2)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      per month, billed monthly
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 space-y-3">
                {!showPayment ? (
                  <>
                    <Button
                      className="w-full"
                      onClick={handleCheckout}
                      disabled={selectedModules.length === 0}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Checkout
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleDownloadQuote}
                      disabled={
                        selectedModules.length === 0 || isGeneratingQuote
                      }
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isGeneratingQuote ? "Generating..." : "Download Quote"}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        Payment Method
                      </h3>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="space-y-3"
                      >
                        <div>
                          <Card
                            className={`cursor-pointer ${paymentMethod === "credit-card" ? "border-primary" : ""}`}
                          >
                            <CardContent className="p-3 flex items-center">
                              <RadioGroupItem
                                value="credit-card"
                                id="credit-card"
                                className="mr-3"
                              />
                              <Label
                                htmlFor="credit-card"
                                className="flex-1 cursor-pointer"
                              >
                                <div className="flex items-center">
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  <span>Credit/Debit Card</span>
                                </div>
                              </Label>
                            </CardContent>
                          </Card>
                          {paymentMethod === "credit-card" && (
                            <div className="mt-3 space-y-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                              <div className="space-y-1">
                                <Label htmlFor="card-number">Card Number</Label>
                                <Input
                                  id="card-number"
                                  placeholder="1234 5678 9012 3456"
                                  className="bg-white dark:bg-gray-950"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <Label htmlFor="expiry-date">
                                    Expiry Date
                                  </Label>
                                  <Input
                                    id="expiry-date"
                                    placeholder="MM/YY"
                                    className="bg-white dark:bg-gray-950"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor="cvv">CVV</Label>
                                  <Input
                                    id="cvv"
                                    placeholder="123"
                                    className="bg-white dark:bg-gray-950"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="card-name">Name on Card</Label>
                                <Input
                                  id="card-name"
                                  placeholder="John Doe"
                                  className="bg-white dark:bg-gray-950"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <Card
                            className={`cursor-pointer ${paymentMethod === "paypal" ? "border-primary" : ""}`}
                          >
                            <CardContent className="p-3 flex items-center">
                              <RadioGroupItem
                                value="paypal"
                                id="paypal"
                                className="mr-3"
                              />
                              <Label
                                htmlFor="paypal"
                                className="flex-1 cursor-pointer"
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="mr-2 h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M19.5 8.5h-2.5a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M18 11v2a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-2"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M9 21h6"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M12 17v4"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <span>PayPal</span>
                                </div>
                              </Label>
                            </CardContent>
                          </Card>
                          {paymentMethod === "paypal" && (
                            <div className="mt-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                You will be redirected to PayPal to complete
                                your payment securely.
                              </p>
                            </div>
                          )}
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Promo Code</h3>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Enter promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Button variant="outline" onClick={applyPromoCode}>
                          Apply
                        </Button>
                      </div>
                      {promoError && (
                        <div className="mt-1 flex items-center text-xs text-red-500">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {promoError}
                        </div>
                      )}
                      {promoDiscount > 0 && (
                        <div className="mt-1 flex items-center text-xs text-green-500">
                          <Check className="h-3 w-3 mr-1" />
                          Promo code applied successfully!
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full"
                      onClick={handlePayment}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment
                        ? "Processing..."
                        : `Pay ${total.toFixed(2)}`}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowPayment(false)}
                      disabled={isProcessingPayment}
                    >
                      Back to Selection
                    </Button>
                  </div>
                )}
              </div>

              {/* Next steps info */}
              {selectedModules.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Next Steps
                  </h3>
                  <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                    After checkout, our team will contact you to set up your
                    selected modules and provide training.
                  </p>
                  <Button
                    variant="link"
                    className="mt-2 p-0 h-auto text-xs text-blue-600 dark:text-blue-400"
                    onClick={() =>
                      window.open(
                        "https://docs.google.com/spreadsheets/d/1example-timeline-url",
                        "_blank",
                      )
                    }
                  >
                    View implementation timeline
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleSelection;
