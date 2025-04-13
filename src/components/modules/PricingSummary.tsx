import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Info, Loader2, PlayCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/hooks/redux";
import { activateFreeTrial, setSelectedModules } from "@/store/authSlice";

interface Module {
  id: string;
  name: string;
  price: number;
  billingCycle?: "monthly" | "yearly" | "biennial";
}

interface PricingSummaryProps {
  selectedModules?: Module[];
  totalPrice?: number;
  onCheckout?: () => void;
  onDownloadQuote?: (couponCode?: string, couponDiscount?: number) => void;
  isGeneratingQuote?: boolean;
  billingCycle?: "monthly" | "yearly" | "biennial";
  isDistributor?: boolean;
  selectedDistributorPlan?: string | null;
  distributorPlanPrice?: number;
  downPayment?: number | null;
  isFreeTrial?: boolean;
  onFreeTrialChange?: (checked: boolean) => void;
}

const PricingSummary = ({
  selectedModules = [],
  totalPrice = 0,
  onCheckout = () => {},
  onDownloadQuote = () => {},
  isGeneratingQuote = false,
  billingCycle = "monthly",
  isDistributor = false,
  selectedDistributorPlan = null,
  distributorPlanPrice = 0,
  downPayment = null,
  isFreeTrial = false,
  onFreeTrialChange,
}: PricingSummaryProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isLocalFreeTrial, setIsLocalFreeTrial] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use the prop value if provided, otherwise use local state
  const effectiveIsFreeTrial = onFreeTrialChange
    ? isFreeTrial
    : isLocalFreeTrial;

  // Calculate bundle discount (10% if 3 or more modules selected)
  const bundleDiscount =
    !isDistributor && selectedModules.length >= 3 ? totalPrice * 0.1 : 0;

  // Total after all discounts
  const finalTotal = isDistributor
    ? distributorPlanPrice - couponDiscount
    : totalPrice - bundleDiscount - couponDiscount;

  const getBillingText = () => {
    switch (billingCycle) {
      case "yearly":
        return "per year";
      case "biennial":
        return "per 2 years";
      default:
        return "per month";
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode) return;

    setIsApplying(true);

    // Simulate API call to validate coupon
    setTimeout(() => {
      // Mock coupon codes
      const validCoupons: Record<string, number> = {
        WELCOME10: 0.1, // 10% off
        HEALTH20: 0.2, // 20% off
        CLINIC15: 0.15, // 15% off
        FIRST25: 0.25, // 25% off
        DIST10: 0.1, // 10% off for distributors
        DIST20: 0.2, // 20% off for distributors
      };

      const priceToDiscount = isDistributor ? distributorPlanPrice : totalPrice;

      if (validCoupons[couponCode.toUpperCase()]) {
        const discount =
          priceToDiscount * validCoupons[couponCode.toUpperCase()];
        setCouponDiscount(discount);
        setAppliedCoupon(couponCode.toUpperCase());
        toast({
          title: "Coupon applied",
          description: `${couponCode.toUpperCase()} coupon applied successfully!`,
        });
      } else {
        setCouponDiscount(0);
        setAppliedCoupon(null);
        toast({
          title: "Invalid coupon",
          description: "The coupon code you entered is invalid or expired.",
          variant: "destructive",
        });
      }

      setIsApplying(false);
    }, 800);
  };

  const handleCheckout = () => {
    setIsProcessing(true);

    if (!isDistributor) {
      // Save selected modules to Redux store
      dispatch(setSelectedModules(selectedModules.map((module) => module.id)));
    }

    // Call the onCheckout prop first (for any parent component handling)
    if (onCheckout) {
      onCheckout();
    }

    // Simulate API call
    setTimeout(() => {
      if (effectiveIsFreeTrial) {
        // For free trial, activate trial in Redux and navigate to dashboard
        dispatch(activateFreeTrial());

        toast({
          title: "Free trial activated",
          description:
            "Your 14-day free trial has been activated successfully!",
        });
        navigate("/dashboard");
      } else {
        // For regular checkout, navigate to billing details
        navigate("/billing-details");
      }
      setIsProcessing(false);
    }, 1000);
  };

  const handleDownloadQuote = () => {
    console.log("Download Quote button clicked");
    console.log("Applied coupon:", appliedCoupon);
    console.log("Coupon discount:", couponDiscount);
    console.log("Selected modules:", selectedModules);
    console.log("Is distributor:", isDistributor);
    console.log("Selected distributor plan:", selectedDistributorPlan);
    onDownloadQuote(appliedCoupon || undefined, couponDiscount);
  };

  return (
    <Card className="w-full max-w-[350px] bg-white shadow-lg mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">
          {isDistributor ? "Distributor Plan Summary" : "Subscription Summary"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDistributor ? (
          selectedDistributorPlan ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Selected Plan
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {selectedDistributorPlan === "basic-distributor"
                      ? "Basic Distributor"
                      : selectedDistributorPlan === "professional-distributor"
                        ? "Professional Distributor"
                        : "Enterprise Distributor"}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {billingCycle}
                  </Badge>
                </div>
                <span className="font-medium">
                  ${distributorPlanPrice.toFixed(2)}
                </span>
              </div>

              {downPayment !== null && (
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Down Payment</span>
                    <span className="font-medium">
                      ${downPayment.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    One-time payment required to start as a distributor
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-400 italic">
              No distributor plan selected
            </div>
          )
        ) : (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">
              Selected Modules
            </h3>
            {selectedModules.length > 0 ? (
              selectedModules.map((module) => (
                <div
                  key={module.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{module.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {module.billingCycle || billingCycle}
                    </Badge>
                  </div>
                  <span className="font-medium">
                    ${module.price.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-400 italic">
                No modules selected
              </div>
            )}
          </div>
        )}

        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <Input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="h-9"
            />
            <Button
              size="sm"
              onClick={handleApplyCoupon}
              disabled={
                isApplying ||
                !couponCode ||
                (isDistributor && !selectedDistributorPlan) ||
                (!isDistributor && selectedModules.length === 0)
              }
              className="whitespace-nowrap"
            >
              {isApplying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </div>

          {appliedCoupon && (
            <div className="text-xs text-green-600 mb-2">
              Coupon {appliedCoupon} applied successfully!
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="font-medium">
              $
              {isDistributor
                ? distributorPlanPrice.toFixed(2)
                : totalPrice.toFixed(2)}
            </span>
          </div>

          {!isDistributor && bundleDiscount > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">Bundle Discount</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        10% discount for selecting 3 or more modules
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="font-medium text-green-600">
                -${bundleDiscount.toFixed(2)}
              </span>
            </div>
          )}

          {couponDiscount > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">Coupon Discount</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        Discount from coupon code {appliedCoupon}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="font-medium text-green-600">
                -${couponDiscount.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <div className="text-right">
            <div className="font-bold text-lg">${finalTotal.toFixed(2)}</div>
            <div className="text-xs text-gray-500">{getBillingText()}</div>
          </div>
        </div>

        {downPayment !== null && isDistributor && (
          <div className="bg-muted p-3 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Initial Payment</span>
              <span className="font-bold">
                ${(finalTotal + downPayment).toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Includes first {billingCycle} payment and one-time down payment
            </p>
          </div>
        )}

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="free-trial"
            checked={effectiveIsFreeTrial}
            onCheckedChange={(checked) => {
              if (onFreeTrialChange) {
                onFreeTrialChange(checked === true);
              } else {
                setIsLocalFreeTrial(checked === true);
              }
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="free-trial"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Start with 14-day free trial
            </Label>
            <p className="text-xs text-muted-foreground">
              Try{" "}
              {isDistributor
                ? "our distributor platform"
                : "all selected modules"}{" "}
              for free. No credit card required for trial period.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          className="w-full"
          onClick={handleCheckout}
          disabled={
            (isDistributor && !selectedDistributorPlan) ||
            (!isDistributor && selectedModules.length === 0) ||
            isProcessing
          }
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : effectiveIsFreeTrial ? (
            <PlayCircle className="mr-2 h-4 w-4" />
          ) : (
            <CreditCard className="mr-2 h-4 w-4" />
          )}
          {isProcessing
            ? "Processing..."
            : effectiveIsFreeTrial
              ? "Start Free Trial"
              : "Proceed to Checkout"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleDownloadQuote}
          disabled={
            isGeneratingQuote ||
            (isDistributor && !selectedDistributorPlan) ||
            (!isDistributor && selectedModules.length === 0)
          }
        >
          {isGeneratingQuote ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Quote...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Quote
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingSummary;
