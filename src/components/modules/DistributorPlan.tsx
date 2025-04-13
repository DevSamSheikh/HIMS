import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Feature {
  name: string;
  included: boolean;
}

interface DistributorPlanProps {
  id: string;
  name: string;
  description: string;
  price: number;
  downPayment: number;
  features: Feature[];
  selected: boolean;
  onSelect: () => void;
  billingCycle?: "monthly" | "yearly" | "biennial";
  popular?: boolean;
}

const DistributorPlan = ({
  id,
  name,
  description,
  price,
  downPayment,
  features,
  selected,
  onSelect,
  billingCycle = "monthly",
  popular = false,
}: DistributorPlanProps) => {
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

  return (
    <Card
      className={`w-full h-full flex flex-col bg-white dark:bg-gray-800 border-2 transition-all duration-200 hover:shadow-md relative ${popular ? "border-primary" : ""}`}
      style={{
        borderColor: selected
          ? "hsl(var(--primary))"
          : popular
            ? "hsl(var(--primary))"
            : "hsl(var(--border))",
      }}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-full">
          Most Popular
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <CardDescription className="text-sm mt-1">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <div className="space-y-4">
          <div>
            <div className="text-2xl font-bold">${price.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">
              {getBillingText()}
            </div>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm font-medium">Down Payment</div>
            <div className="text-lg font-semibold">
              ${downPayment.toFixed(2)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Features</div>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm">
                {feature.included ? (
                  <Check className="h-4 w-4 mr-2 flex-shrink-0 text-green-500" />
                ) : (
                  <X className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                )}
                <span className={feature.included ? "" : "text-gray-400"}>
                  {feature.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          className="w-full"
          variant={selected ? "outline" : "default"}
          onClick={onSelect}
        >
          {selected ? "Selected" : "Select Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DistributorPlan;
