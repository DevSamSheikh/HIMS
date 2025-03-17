import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompanyTable, { Company } from "./CompanyTable";
import { toast } from "@/components/ui/use-toast";

const CompanyForm = () => {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "comp-1",
      name: "Sun Pharmaceuticals",
      address: "Mumbai, India",
      contact: "+91 22 4324 4324",
    },
    {
      id: "comp-2",
      name: "Cipla Ltd",
      address: "Mumbai, India",
      contact: "+91 22 2382 8585",
    },
    {
      id: "comp-3",
      name: "Dr. Reddy's Laboratories",
      address: "Hyderabad, India",
      contact: "+91 40 4900 2900",
    },
    {
      id: "comp-4",
      name: "Lupin Limited",
      address: "Mumbai, India",
      contact: "+91 22 6640 2222",
    },
    {
      id: "comp-5",
      name: "Aurobindo Pharma",
      address: "Hyderabad, India",
      contact: "+91 40 6672 5000",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveCompanies = (updatedCompanies: Company[]) => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setCompanies(updatedCompanies);
      setIsLoading(false);
      toast({
        title: "Companies Updated",
        description: "Company list has been updated successfully",
      });
    }, 500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Company Management</CardTitle>
      </CardHeader>
      <CardContent>
        <CompanyTable
          initialData={companies}
          onSave={handleSaveCompanies}
          isLoading={isLoading}
          isPaginated={true}
          addStartEntry={true}
        />
      </CardContent>
    </Card>
  );
};

export default CompanyForm;
