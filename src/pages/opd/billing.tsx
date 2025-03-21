import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CompletedCheckupsList from "@/components/opd/billing/CompletedCheckupsList";

const OPDBillingPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>OPD Billing</CardTitle>
            <CardDescription>
              Manage billing for OPD consultations and services
            </CardDescription>
          </CardHeader>
          <CompletedCheckupsList />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OPDBillingPage;
