import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DistributorSelectionProps {
  onDistributorChange: (distributorId: string | null) => void;
}

const DistributorSelection = ({
  onDistributorChange,
}: DistributorSelectionProps) => {
  const { toast } = useToast();
  const [selectionType, setSelectionType] = useState<"code" | "list">("list");
  const [distributorCode, setDistributorCode] = useState("");
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(
    null,
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Mock distributor data
  const distributors = [
    { id: "direct", name: "Direct Customer (No Distributor)" },
    { id: "dist-001", name: "MedSupply Solutions" },
    { id: "dist-002", name: "HealthTech Distributors" },
    { id: "dist-003", name: "Global Medical Partners" },
  ];

  const handleDistributorSelect = (value: string) => {
    const distributorId = value === "direct" ? null : value;
    setSelectedDistributor(value);
    onDistributorChange(distributorId);
  };

  const verifyDistributorCode = () => {
    if (!distributorCode) return;

    setIsVerifying(true);

    // Simulate API verification
    setTimeout(() => {
      // Mock verification - in a real app, this would be an API call
      const isValid = distributorCode.startsWith("DIST");

      if (isValid) {
        setIsVerified(true);
        // Find a mock distributor for this code
        const mockDistId = "dist-001";
        setSelectedDistributor(mockDistId);
        onDistributorChange(mockDistId);

        toast({
          title: "Distributor code verified",
          description: "You've been linked to MedSupply Solutions",
        });
      } else {
        setIsVerified(false);
        toast({
          title: "Invalid distributor code",
          description: "Please check the code and try again",
          variant: "destructive",
        });
      }

      setIsVerifying(false);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Distributor Selection</h3>

      <div className="flex gap-4 mb-4">
        <Button
          variant={selectionType === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectionType("list")}
        >
          Select from list
        </Button>
        <Button
          variant={selectionType === "code" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setSelectionType("code");
            setIsVerified(false);
          }}
        >
          Enter distributor code
        </Button>
      </div>

      {selectionType === "list" ? (
        <div className="space-y-2">
          <Label htmlFor="distributor">Select Distributor</Label>
          <Select
            value={selectedDistributor || "direct"}
            onValueChange={handleDistributorSelect}
          >
            <SelectTrigger id="distributor" className="w-full">
              <SelectValue placeholder="Select a distributor" />
            </SelectTrigger>
            <SelectContent>
              {distributors.map((distributor) => (
                <SelectItem key={distributor.id} value={distributor.id}>
                  {distributor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Select "Direct Customer" if you're not associated with any
            distributor
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="distributorCode">Distributor Code</Label>
          <div className="flex gap-2">
            <Input
              id="distributorCode"
              placeholder="Enter code (e.g., DIST123)"
              value={distributorCode}
              onChange={(e) => setDistributorCode(e.target.value)}
              className={isVerified ? "border-green-500" : ""}
              disabled={isVerified}
            />
            {isVerified ? (
              <Button
                variant="outline"
                className="shrink-0 border-green-500 text-green-500"
              >
                <Check className="h-4 w-4 mr-1" /> Verified
              </Button>
            ) : (
              <Button
                onClick={verifyDistributorCode}
                disabled={!distributorCode || isVerifying}
                className="shrink-0"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Verifying
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            )}
          </div>
          {isVerified && (
            <p className="text-sm text-green-600">
              You're linked to MedSupply Solutions
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Enter the distributor code provided by your distributor
          </p>
        </div>
      )}
    </div>
  );
};

export default DistributorSelection;
