import React from "react";
import DosageForm from "@/components/opd/definitions/DosageForm";
import DashboardLayout from "@/components/layout/DashboardLayout";

const DosagePage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <DosageForm />
      </div>
    </DashboardLayout>
  );
};

export default DosagePage;
