import React from "react";
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
import { CreditCard, Download, Info, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Module {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  selected: boolean;
}

interface PricingSummaryProps {
  selectedModules?: Module[];
  subtotal?: number;
  discount?: number;
  total?: number;
  onCheckout?: () => void;
  onDownloadQuote?: () => void;
  isGeneratingQuote?: boolean;
}

const PricingSummary = ({
  selectedModules = [
    {
      id: "1",
      name: "Patient Management",
      price: 49.99,
      billingCycle: "monthly",
      selected: true,
    },
    {
      id: "2",
      name: "Appointments",
      price: 29.99,
      billingCycle: "monthly",
      selected: true,
    },
    {
      id: "3",
      name: "Billing",
      price: 39.99,
      billingCycle: "monthly",
      selected: true,
    },
  ],
  subtotal = 119.97,
  discount = 10.0,
  total = 109.97,
  onCheckout = () => console.log("Checkout clicked"),
  onDownloadQuote = () => console.log("Download quote clicked"),
  isGeneratingQuote = false,
}: PricingSummaryProps) => {
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
          {selectedModules.map((module) => (
            <div key={module.id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">{module.name}</span>
                <Badge variant="outline" className="text-xs">
                  {module.billingCycle}
                </Badge>
              </div>
              <span className="font-medium">${module.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Discount</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      Bundle discount for selecting multiple modules
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-medium text-green-600">
              -${discount.toFixed(2)}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <div className="text-right">
            <div className="font-bold text-lg">${total.toFixed(2)}</div>
            <div className="text-xs text-gray-500">
              per month, billed monthly
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full" onClick={onCheckout}>
          <CreditCard className="mr-2 h-4 w-4" />
          Proceed to Checkout
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onDownloadQuote}
          disabled={isGeneratingQuote}
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
