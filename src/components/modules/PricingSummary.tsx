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

interface Module {
  id: string;
  name: string;
  price: number;
  billingCycle?: "monthly" | "yearly" | "biennial";
}

interface PricingSummaryProps {
  selectedModules: Module[];
  totalPrice: number;
  onCheckout?: () => void;
  onDownloadQuote?: () => void;
  isGeneratingQuote?: boolean;
  billingCycle?: "monthly" | "yearly" | "biennial";
}

const PricingSummary = ({
  selectedModules = [],
  totalPrice = 0,
  onCheckout = () => {},
  onDownloadQuote = () => console.log("Download quote clicked"),
  isGeneratingQuote = false,
  billingCycle = "monthly",
}: PricingSummaryProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate bundle discount (10% if 3 or more modules selected)
  const bundleDiscount = selectedModules.length >= 3 ? totalPrice * 0.1 : 0;

  // Total after all discounts
  const finalTotal = totalPrice - bundleDiscount - couponDiscount;

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
      };

      if (validCoupons[couponCode.toUpperCase()]) {
        const discount = totalPrice * validCoupons[couponCode.toUpperCase()];
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

    // Call the onCheckout prop first (for any parent component handling)
    if (onCheckout) {
      onCheckout();
    }

    // Simulate API call
    setTimeout(() => {
      if (isFreeTrial) {
        // For free trial, show success message and navigate to dashboard
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

  return (
    <Card className="w-full max-w-[350px] bg-white shadow-lg mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">
          Subscription Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
                <span className="font-medium">${module.price.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400 italic">
              No modules selected
            </div>
          )}
        </div>

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
              disabled={isApplying || !couponCode}
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
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>

          {bundleDiscount > 0 && (
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

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="free-trial"
            checked={isFreeTrial}
            onCheckedChange={(checked) => setIsFreeTrial(checked === true)}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="free-trial"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Start with 14-day free trial
            </Label>
            <p className="text-xs text-muted-foreground">
              Try all selected modules for free. No credit card required for
              trial period.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          className="w-full"
          onClick={handleCheckout}
          disabled={selectedModules.length === 0 || isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isFreeTrial ? (
            <PlayCircle className="mr-2 h-4 w-4" />
          ) : (
            <CreditCard className="mr-2 h-4 w-4" />
          )}
          {isProcessing
            ? "Processing..."
            : isFreeTrial
              ? "Start Free Trial"
              : "Proceed to Checkout"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onDownloadQuote}
          disabled={isGeneratingQuote || selectedModules.length === 0}
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
