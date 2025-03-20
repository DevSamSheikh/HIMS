import React from "react";
import SymptomsForm from "@/components/opd/definitions/SymptomsForm";
import DashboardLayout from "@/components/layout/DashboardLayout";

const SymptomsPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <SymptomsForm />
      </div>
    </DashboardLayout>
  );
};

export default SymptomsPage;
