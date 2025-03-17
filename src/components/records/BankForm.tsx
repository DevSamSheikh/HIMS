import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BankTable, { Bank } from "./BankTable";
import { toast } from "@/components/ui/use-toast";

const BankForm = () => {
  const [banks, setBanks] = useState<Bank[]>([
    {
      id: "bank-1",
      name: "HDFC Bank",
    },
    {
      id: "bank-2",
      name: "State Bank of India",
    },
    {
      id: "bank-3",
      name: "ICICI Bank",
    },
    {
      id: "bank-4",
      name: "Axis Bank",
    },
    {
      id: "bank-5",
      name: "Bank of Baroda",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveBanks = (updatedBanks: Bank[]) => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setBanks(updatedBanks);
      setIsLoading(false);
      toast({
        title: "Banks Updated",
        description: "Bank list has been updated successfully",
      });
    }, 500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bank Management</CardTitle>
      </CardHeader>
      <CardContent>
        <BankTable
          initialData={banks}
          onSave={handleSaveBanks}
          isLoading={isLoading}
          isPaginated={true}
          addStartEntry={true}
        />
      </CardContent>
    </Card>
  );
};

export default BankForm;
