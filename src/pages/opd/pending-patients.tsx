import React from "react";
import PendingPatients from "@/components/opd/PendingPatients";
import DashboardLayout from "@/components/layout/DashboardLayout";

const PendingPatientsPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <PendingPatients />
      </div>
    </DashboardLayout>
  );
};

export default PendingPatientsPage;
