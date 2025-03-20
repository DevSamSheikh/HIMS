import React from "react";
import DiseasesForm from "@/components/opd/definitions/DiseasesForm";
import DashboardLayout from "@/components/layout/DashboardLayout";

const DiseasesPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <DiseasesForm />
      </div>
    </DashboardLayout>
  );
};

export default DiseasesPage;
