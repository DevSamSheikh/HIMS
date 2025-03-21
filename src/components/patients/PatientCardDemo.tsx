import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Patient } from "./types";
import GeneratePatientCardButton from "./GeneratePatientCardButton";

const PatientCardDemo = () => {
  // Sample patient data
  const samplePatient: Patient = {
    id: "p-123456",
    mrNumber: "MR-2023-12345",
    name: "John Doe",
    age: 35,
    ageUnit: "Years",
    gender: "Male",
    contact: "+92 300 1234567",
    address: "123 Main Street, Islamabad, Pakistan",
    registrationDate: "2023-06-15",
    patientType: ["OPD"],
    lastVisit: "2023-06-15",
    bloodGroup: "O+",
    email: "john.doe@example.com",
    cnic: "12345-6789012-3",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Card Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-md bg-muted/20">
            <h3 className="text-lg font-medium mb-2">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{samplePatient.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MR Number</p>
                <p className="font-medium">{samplePatient.mrNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age/Gender</p>
                <p className="font-medium">
                  {samplePatient.age} {samplePatient.ageUnit} /{" "}
                  {samplePatient.gender}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <p className="font-medium">{samplePatient.bloodGroup}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{samplePatient.contact}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CNIC</p>
                <p className="font-medium">{samplePatient.cnic}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <GeneratePatientCardButton patient={samplePatient} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientCardDemo;
