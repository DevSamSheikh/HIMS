import React from "react";
import TestsForm from "@/components/opd/definitions/TestsForm";
import DashboardLayout from "@/components/layout/DashboardLayout";

const TestsPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <TestsForm />
      </div>
    </DashboardLayout>
  );
};

export default TestsPage;
