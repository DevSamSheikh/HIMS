import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OPDCheckupForm from "@/components/opd/checkup/OPDCheckupForm";

const OPDCheckupPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <OPDCheckupForm />
      </div>
    </DashboardLayout>
  );
};

export default OPDCheckupPage;
