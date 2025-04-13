import React, { useState } from "react";
import ModuleSelection from "./ModuleSelection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DistributorPlan from "./DistributorPlan";
import DistributorSelection from "./DistributorSelection";
import PricingSummary from "./PricingSummary";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { generateQuotePDF } from "@/utils/pdf-generator";

interface ModuleSelectionPageProps {
  onComplete?: (selectedModules: string[]) => void;
  showBackButton?: boolean;
}

const ModuleSelectionPage = ({
  onComplete,
  showBackButton = true,
}: ModuleSelectionPageProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"customer" | "distributor">(
    "customer",
  );
  const [selectedDistributorPlan, setSelectedDistributorPlan] = useState<
    string | null
  >(null);
  const [distributorCode, setDistributorCode] = useState("");
  const [distributorFreeTrial, setDistributorFreeTrial] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(
    null,
  );
  const [downPayment, setDownPayment] = useState<number | null>(null);
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [selectedModulesData, setSelectedModulesData] = useState<any[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [bundleDiscount, setBundleDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Mock distributor plans
  const distributorPlans = [
    {
      id: "basic-distributor",
      name: "Basic Distributor",
      description: "Essential tools for small-scale distributors",
      price: 299.99,
      downPayment: 999.99,
      features: [
        { name: "Manage up to 10 customers", included: true },
        { name: "Basic reporting", included: true },
        { name: "Email support", included: true },
        { name: "Custom branding", included: false },
        { name: "Advanced analytics", included: false },
        { name: "Priority support", included: false },
      ],
      popular: false,
    },
    {
      id: "professional-distributor",
      name: "Professional Distributor",
      description: "Comprehensive solution for growing distribution networks",
      price: 499.99,
      downPayment: 1499.99,
      features: [
        { name: "Manage up to 50 customers", included: true },
        { name: "Advanced reporting", included: true },
        { name: "Priority email support", included: true },
        { name: "Custom branding", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Phone support", included: false },
      ],
      popular: true,
    },
    {
      id: "enterprise-distributor",
      name: "Enterprise Distributor",
      description: "Full-featured platform for large distribution operations",
      price: 999.99,
      downPayment: 2999.99,
      features: [
        { name: "Unlimited customers", included: true },
        { name: "Custom reporting", included: true },
        { name: "24/7 priority support", included: true },
        { name: "Custom branding", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Dedicated account manager", included: true },
      ],
      popular: false,
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleComplete = async (
    selectedModules: string[],
    modulesData?: any[],
  ) => {
    if (modulesData) {
      setSelectedModulesData(modulesData);

      // Calculate total price
      const total = modulesData.reduce((sum, module) => sum + module.price, 0);
      setTotalPrice(total);

      // Calculate bundle discount (10% if 3 or more modules selected)
      const discount = modulesData.length >= 3 ? total * 0.1 : 0;
      setBundleDiscount(discount);
    }
    setIsLoading(true);

    try {
      // Simulate API call for module selection
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Modules selected",
        description: `${selectedModules.length} modules have been selected`,
      });

      // The actual navigation happens in the PricingSummary component
      // This is just a callback for any additional processing
    } catch (error) {
      toast({
        title: "Error selecting modules",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadQuote = async (
    couponCode?: string,
    couponDiscountAmount?: number,
  ) => {
    console.log("handleDownloadQuote called with:", {
      couponCode,
      couponDiscountAmount,
    });
    setIsGeneratingQuote(true);

    if (couponCode) {
      setAppliedCoupon(couponCode);
    }

    if (couponDiscountAmount !== undefined) {
      setCouponDiscount(couponDiscountAmount);
    }

    try {
      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const quoteNumber = `Q-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

      let quoteDetails;

      if (activeTab === "distributor" && selectedDistributorPlan) {
        const selectedPlan = distributorPlans.find(
          (p) => p.id === selectedDistributorPlan,
        );

        quoteDetails = {
          isDistributor: true,
          distributorPlan: selectedPlan
            ? {
                name: selectedPlan.name,
                price: selectedPlan.price,
                downPayment: selectedPlan.downPayment,
              }
            : null,
          pricing: {
            subtotal: selectedPlan?.price || 0,
            couponDiscount: couponDiscount,
            total: (selectedPlan?.price || 0) - couponDiscount,
          },
          customer: {
            date: formattedDate,
            quoteNumber: quoteNumber,
          },
          billingCycle: "monthly",
          appliedCoupon: appliedCoupon,
        };
      } else {
        quoteDetails = {
          selectedModules: selectedModulesData,
          pricing: {
            subtotal: totalPrice,
            bundleDiscount: bundleDiscount,
            couponDiscount: couponDiscount,
            total: totalPrice - bundleDiscount - couponDiscount,
          },
          customer: {
            facilityName: "Your Healthcare Facility",
            date: formattedDate,
            quoteNumber: quoteNumber,
          },
          billingCycle: "monthly",
          appliedCoupon: appliedCoupon,
        };
      }

      const success = await generateQuotePDF(quoteDetails);

      if (success) {
        toast({
          title: "Quote generated successfully",
          description: "Your quote has been downloaded as a PDF.",
        });
      } else {
        toast({
          title: "Error generating quote",
          description:
            "There was a problem generating your quote. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating quote:", error);
      toast({
        title: "Error generating quote",
        description:
          "There was a problem generating your quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  const handleDistributorPlanSelect = (planId: string) => {
    setSelectedDistributorPlan(
      planId === selectedDistributorPlan ? null : planId,
    );

    // Set down payment based on selected plan
    if (planId !== selectedDistributorPlan) {
      const plan = distributorPlans.find((p) => p.id === planId);
      if (plan) {
        setDownPayment(plan.downPayment);
      }
    } else {
      setDownPayment(null);
    }
  };

  const handleDistributorChange = (distributorId: string | null) => {
    setSelectedDistributor(distributorId);
  };

  return (
    <div
      className="min-h-screen bg-background"
      style={{ height: "100vh", overflowY: "auto" }}
    >
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {showBackButton && (
          <Button variant="ghost" className="mb-6" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Module Selection</h1>
          <p className="text-muted-foreground mt-2">
            Choose the modules you need for your healthcare facility
          </p>
        </div>

        <Tabs
          defaultValue="customer"
          className="w-full"
          onValueChange={(value) =>
            setActiveTab(value as "customer" | "distributor")
          }
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="distributor">Distributor</TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="mt-0">
            <DistributorSelection
              onDistributorChange={handleDistributorChange}
            />

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Customer Modules</h2>
              <p className="text-muted-foreground">
                Select the modules you need for your healthcare facility
              </p>
            </div>

            <ModuleSelection
              onComplete={handleComplete}
              onDownloadQuote={(couponCode, couponDiscount) =>
                handleDownloadQuote(couponCode, couponDiscount)
              }
              isGeneratingQuote={isGeneratingQuote}
            />
          </TabsContent>

          <TabsContent value="distributor" className="mt-0">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Distributor Plans</h2>
              <p className="text-muted-foreground">
                Become a distributor and grow your business by offering our
                healthcare solutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {distributorPlans.map((plan) => (
                <DistributorPlan
                  key={plan.id}
                  id={plan.id}
                  name={plan.name}
                  description={plan.description}
                  price={plan.price}
                  downPayment={plan.downPayment}
                  features={plan.features}
                  selected={selectedDistributorPlan === plan.id}
                  onSelect={() => handleDistributorPlanSelect(plan.id)}
                  popular={plan.popular}
                />
              ))}
            </div>

            {selectedDistributorPlan && (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 mb-6 max-w-md">
                    <h3 className="text-lg font-medium mb-4">
                      Distributor Details
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="distributorCode">
                          Your Distributor Code
                        </Label>
                        <Input
                          id="distributorCode"
                          placeholder="Enter your preferred code"
                          value={distributorCode}
                          onChange={(e) => setDistributorCode(e.target.value)}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          This code will be used by your customers to identify
                          you as their distributor
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-auto">
                  <div className="sticky top-4">
                    <PricingSummary
                      isDistributor={true}
                      selectedDistributorPlan={selectedDistributorPlan}
                      distributorPlanPrice={
                        distributorPlans.find(
                          (p) => p.id === selectedDistributorPlan,
                        )?.price || 0
                      }
                      downPayment={downPayment}
                      billingCycle="monthly"
                      onCheckout={handleComplete}
                      isFreeTrial={distributorFreeTrial}
                      onFreeTrialChange={(checked) =>
                        setDistributorFreeTrial(checked)
                      }
                      onDownloadQuote={(couponCode, couponDiscount) =>
                        handleDownloadQuote(couponCode, couponDiscount)
                      }
                      isGeneratingQuote={isGeneratingQuote}
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModuleSelectionPage;
