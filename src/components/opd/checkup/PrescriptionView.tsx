import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Printer, Download } from "lucide-react";

interface PrescriptionViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkup: any; // In a real app, this would be properly typed
}

const PrescriptionView: React.FC<PrescriptionViewProps> = ({
  open,
  onOpenChange,
  checkup,
}) => {
  if (!checkup) return null;

  const handlePrint = () => {
    // In a real app, this would use a proper print library
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF for download
    alert("Downloading prescription as PDF");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prescription</DialogTitle>
          <DialogDescription>
            Checkup ID: {checkup.id} | Date: {checkup.date}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4" id="prescription-content">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Healthcare Facility Name</h2>
              <p className="text-muted-foreground">
                123 Medical Street, Healthcare City
              </p>
              <p className="text-muted-foreground">Phone: (123) 456-7890</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Dr. Sarah Johnson</p>
              <p className="text-sm text-muted-foreground">General Physician</p>
              <p className="text-sm text-muted-foreground">
                License No: MED12345
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Patient Information</h3>
              <p>Name: {checkup.patient?.name}</p>
              <p>ID: {checkup.patient?.id}</p>
              <p>
                Age/Gender: {checkup.patient?.age} / {checkup.patient?.gender}
              </p>
            </div>
            <div className="text-right">
              <h3 className="font-medium">Prescription Details</h3>
              <p>Date: {checkup.date}</p>
              <p>Prescription ID: {checkup.id}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Diagnosis</h3>
            <div className="flex flex-wrap gap-2">
              {checkup.diagnosis?.map((diagnosis: any, index: number) => (
                <Badge key={index} variant="outline">
                  {diagnosis.name} ({diagnosis.icd10Code})
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Medications</h3>
            {checkup.medications?.length > 0 ? (
              <div className="space-y-2">
                {checkup.medications.map((medication: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">
                        {index + 1}. {medication.medicine.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {medication.medicine.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>{medication.dosage.name}</p>
                      <p className="text-sm">
                        For {medication.days.name} ({medication.days.value}{" "}
                        days)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No medications prescribed</p>
            )}
          </div>

          {checkup.tests?.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Tests Advised</h3>
              <div className="flex flex-wrap gap-2">
                {checkup.tests.map((test: any, index: number) => (
                  <Badge key={index} variant="secondary">
                    {test.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {checkup.remarks && (
            <div>
              <h3 className="font-medium mb-2">Remarks & Instructions</h3>
              <p>{checkup.remarks}</p>
            </div>
          )}

          {checkup.followUpDate && (
            <div>
              <h3 className="font-medium mb-2">Follow-up</h3>
              <p>
                Please return for follow-up on{" "}
                {new Date(checkup.followUpDate).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="mt-8 pt-4 border-t text-center">
            <p className="font-medium">Dr. Sarah Johnson</p>
            <p className="text-sm text-muted-foreground">Signature & Stamp</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionView;
