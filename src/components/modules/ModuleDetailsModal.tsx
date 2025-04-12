import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Feature {
  name: string;
  included: boolean;
}

interface ModuleDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: {
    id: string;
    name: string;
    description: string;
    price: number;
    icon: string;
    features?: Feature[];
  } | null;
  onSelect: () => void;
  isSelected: boolean;
  onBillingCycleChange: (cycle: "monthly" | "yearly" | "biennial") => void;
  billingCycle: "monthly" | "yearly" | "biennial";
}

const ModuleDetailsModal = ({
  open,
  onOpenChange,
  module,
  onSelect,
  isSelected,
  onBillingCycleChange,
  billingCycle,
}: ModuleDetailsModalProps) => {
  if (!module) return null;

  // Default features if none provided
  const features = module.features || [
    { name: "Basic functionality", included: true },
    { name: "Standard reports", included: true },
    { name: "User management", included: true },
    { name: "API access", included: false },
    { name: "Advanced analytics", included: false },
    { name: "24/7 support", included: false },
  ];

  // Calculate prices for different billing cycles
  const monthlyPrice = module.price;
  const yearlyPrice = module.price * 10; // 2 months free
  const biennialPrice = module.price * 20 * 0.8; // 20% discount

  const getDisplayPrice = () => {
    switch (billingCycle) {
      case "yearly":
        return yearlyPrice.toFixed(2);
      case "biennial":
        return biennialPrice.toFixed(2);
      default:
        return monthlyPrice.toFixed(2);
    }
  };

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

  const getSavingsText = () => {
    switch (billingCycle) {
      case "yearly":
        return "Save 16.7% compared to monthly billing";
      case "biennial":
        return "Save 20% compared to yearly billing";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{module.icon}</span>
            <DialogTitle className="text-xl">{module.name}</DialogTitle>
          </div>
          <DialogDescription>{module.description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div>
            <h3 className="font-medium mb-3">Features</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  {feature.included ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-gray-300" />
                  )}
                  <span
                    className={`${feature.included ? "" : "text-gray-400"}`}
                  >
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h3 className="font-medium mb-3">14-Day Free Trial</h3>
              <p className="text-sm text-muted-foreground">
                Try this module for free for 14 days. No credit card required.
                Cancel anytime during the trial period.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Billing Cycle</h3>
              <RadioGroup
                value={billingCycle}
                onValueChange={(value) =>
                  onBillingCycleChange(
                    value as "monthly" | "yearly" | "biennial",
                  )
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly" className="cursor-pointer">
                    Monthly (${monthlyPrice.toFixed(2)}/month)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yearly" id="yearly" />
                  <Label htmlFor="yearly" className="cursor-pointer">
                    Yearly (${yearlyPrice.toFixed(2)}/year - 2 months free)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="biennial" id="biennial" />
                  <Label htmlFor="biennial" className="cursor-pointer">
                    Biennial (${biennialPrice.toFixed(2)}/2 years - 20% off)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="text-2xl font-bold">${getDisplayPrice()}</div>
              <div className="text-sm text-muted-foreground">
                {getBillingText()}
              </div>
              {getSavingsText() && (
                <div className="text-sm text-green-600 mt-1">
                  {getSavingsText()}
                </div>
              )}
            </div>

            <Button
              onClick={onSelect}
              className="w-full"
              variant={isSelected ? "outline" : "default"}
            >
              {isSelected ? "Remove from Selection" : "Add to Selection"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleDetailsModal;
