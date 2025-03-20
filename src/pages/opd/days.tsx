import React from "react";
import DaysForm from "@/components/opd/definitions/DaysForm";
import DashboardLayout from "@/components/layout/DashboardLayout";

const DaysPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <DaysForm />
      </div>
    </DashboardLayout>
  );
};

export default DaysPage;
