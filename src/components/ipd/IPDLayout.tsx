import React from "react";
import { Outlet, Routes, Route, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import IPDDashboard from "./IPDDashboard";
import DeathCertificate from "./DeathCertificate";
import BirthCertificate from "./BirthCertificate";
import WardForm from "./definitions/WardForm";
import RoomForm from "./definitions/RoomForm";
import BedForm from "./definitions/BedForm";
import ServiceForm from "./definitions/ServiceForm";
import PatientTreatment from "./PatientTreatment";
import IPDBilling from "./IPDBilling";

const IPDLayout = () => {
  const location = useLocation();

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">IPD Management</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
};

export default IPDLayout;
