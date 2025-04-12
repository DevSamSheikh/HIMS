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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Feature {
  name: string;
  included: boolean;
}

interface ModuleCardProps {
  id?: string;
  name: string;
  description: string;
  price: number;
  icon?: string;
  features?: Feature[];
  selected: boolean;
  onClick: () => void;
  onViewDetails: () => void;
  billingCycle?: "monthly" | "yearly" | "biennial";
}

const ModuleCard = ({
  id = "module-1",
  name = "Patient Management",
  description = "Comprehensive patient data management with registration, search, and record viewing capabilities.",
  price = 99.99,
  icon = "🏥",
  features = [
    { name: "Patient Registration", included: true },
    { name: "Medical History Tracking", included: true },
    { name: "Insurance Management", included: true },
    { name: "Document Upload", included: false },
  ],
  selected = false,
  onClick = () => {},
  onViewDetails = () => {},
  billingCycle = "monthly",
}: ModuleCardProps) => {
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
      className="w-full h-full flex flex-col bg-white dark:bg-gray-800 border-2 transition-all duration-200 hover:shadow-md"
      style={{
        borderColor: selected ? "hsl(var(--primary))" : "hsl(var(--border))",
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <div>
              <CardTitle className="text-lg font-bold">{name}</CardTitle>
              <CardDescription className="text-sm mt-1 line-clamp-2">
                {description}
              </CardDescription>
            </div>
          </div>
          <Switch
            checked={selected}
            onCheckedChange={onClick}
            aria-label={`Select ${name} module`}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <div className="space-y-1">
          {features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center text-sm">
              {feature.included ? (
                <Check className="h-4 w-4 mr-2 flex-shrink-0 text-green-500" />
              ) : (
                <span className="h-4 w-4 mr-2 flex-shrink-0 flex items-center justify-center text-gray-400">
                  -
                </span>
              )}
              <span className={feature.included ? "" : "text-gray-400"}>
                {feature.name}
              </span>
            </div>
          ))}
          {features.length > 3 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-sm cursor-pointer text-gray-500 hover:text-gray-700">
                    <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{features.length - 3} more features</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 p-1">
                    {features.slice(3).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        {feature.included ? (
                          <Check className="h-4 w-4 mr-2 flex-shrink-0 text-green-500" />
                        ) : (
                          <span className="h-4 w-4 mr-2 flex-shrink-0 flex items-center justify-center text-gray-400">
                            -
                          </span>
                        )}
                        <span
                          className={feature.included ? "" : "text-gray-400"}
                        >
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0 mt-auto">
        <Badge variant="outline" className="font-semibold">
          ${price.toFixed(2)} {getBillingText()}
        </Badge>
        <Button variant="ghost" size="sm" onClick={onViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModuleCard;
