import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, Share2 } from "lucide-react";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface AlternativePrescriptionViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkup: any; // In a real app, this would be properly typed
}

const AlternativePrescriptionView: React.FC<
  AlternativePrescriptionViewProps
> = ({ open, onOpenChange, checkup }) => {
  if (!checkup) return null;

  const prescriptionRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = document.getElementById("alternative-prescription-content");
    const originalContents = document.body.innerHTML;

    if (!content) return;

    // Create a new window with only the token content
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    // Create a styled document for printing
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: white;
            }
            .prescription-content {
              max-width: 800px;
              margin: 0 auto;
              background-color: white;
            }
            .header {
              display: flex;
              align-items: center;
              gap: 20px;
              padding-bottom: 15px;
            }
            .logo {
              width: 80px;
              height: 80px;
              background-color: #f0f0f0;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
            }
            .doctor-info {
              flex: 1;
            }
            .doctor-name {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin: 0;
            }
            .specialty {
              font-size: 18px;
              margin: 5px 0;
            }
            .credentials {
              font-size: 14px;
              color: #666;
              margin: 2px 0;
            }
            .separator {
              height: 1px;
              background-color: #ddd;
              margin: 15px 0;
            }
            .patient-box {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              background-color: #f9fafb;
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 14px;
              color: #666;
              font-weight: 500;
              margin-bottom: 5px;
            }
            .patient-name {
              font-size: 18px;
              font-weight: bold;
              margin: 0 0 10px 0;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            .vitals-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 10px;
            }
            .info-label {
              font-size: 14px;
              color: #666;
              margin: 0;
            }
            .info-value {
              font-size: 14px;
              margin: 0;
            }
            .main-content {
              display: grid;
              grid-template-columns: 1fr 2fr;
              gap: 20px;
            }
            .left-column, .right-column {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }
            .section-box {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
            }
            .section-heading {
              font-size: 16px;
              font-weight: bold;
              margin: 0 0 10px 0;
            }
            .symptom-item, .diagnosis-item, .test-item {
              display: flex;
              align-items: flex-start;
              margin-bottom: 8px;
            }
            .bullet {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: #2563eb;
              margin-top: 6px;
              margin-right: 8px;
            }
            .medication-item {
              border-bottom: 1px solid #eee;
              padding-bottom: 15px;
              margin-bottom: 15px;
            }
            .medication-item:last-child {
              border-bottom: none;
              padding-bottom: 0;
              margin-bottom: 0;
            }
            .medication-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .medication-name-container {
              display: flex;
              align-items: center;
            }
            .medication-number {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: rgba(37, 99, 235, 0.1);
              color: #2563eb;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              font-weight: bold;
              margin-right: 8px;
            }
            .medication-name {
              font-size: 18px;
              font-weight: bold;
            }
            .medication-category {
              font-size: 14px;
              color: #666;
              margin-left: 28px;
            }
            .medication-dosage {
              display: inline-block;
              border: 1px solid #ddd;
              border-radius: 4px;
              padding: 2px 8px;
              font-size: 14px;
              margin-bottom: 4px;
            }
            .medication-days {
              font-size: 14px;
            }
            .medication-instructions {
              margin-top: 8px;
              margin-left: 28px;
              font-size: 14px;
              background-color: #f9fafb;
              padding: 8px;
              border-radius: 4px;
            }
            .advice-box, .followup-box {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 12px;
            }
            .footer {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 15px;
              padding-top: 15px;
              margin-top: 20px;
              border-top: 1px solid #ddd;
            }
            .footer-heading {
              font-size: 14px;
              font-weight: bold;
              margin: 0 0 5px 0;
            }
            .footer-text {
              font-size: 14px;
              margin: 0 0 3px 0;
            }
            .signature-container {
              display: flex;
              justify-content: flex-end;
              margin-top: 15px;
            }
            .signature-line {
              width: 200px;
              height: 1px;
              border-bottom: 1px dashed #000;
              margin-bottom: 5px;
            }
            .signature-name {
              font-weight: 500;
            }
            .signature-label {
              font-size: 12px;
              color: #666;
            }
            .disclaimer {
              font-size: 12px;
              color: #666;
              background-color: #f9fafb;
              padding: 8px;
              border-radius: 4px;
              margin-top: 20px;
            }
            .print-button {
              display: block;
              margin: 20px auto;
              padding: 10px 20px;
              background-color: #2563eb;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
            }
            .print-button:hover {
              background-color: #1d4ed8;
            }
            @media print {
              .print-button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="prescription-content">
            ${content.innerHTML}
          </div>
          <button class="print-button" onclick="window.print(); window.close();">Print Prescription</button>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleDownload = async () => {
    if (!prescriptionRef.current) return;

    try {
      const canvas = await html2canvas(prescriptionRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`prescription-${checkup.id}.pdf`);

      alert("Prescription downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download prescription. Please try again.");
    }
  };

  const handleShare = async () => {
    if (!prescriptionRef.current) return;

    try {
      const canvas = await html2canvas(prescriptionRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      // Check if Web Share API is available
      if (navigator.share) {
        const blob = await (await fetch(imgData)).blob();
        const file = new File([blob], `prescription-${checkup.id}.png`, {
          type: "image/png",
        });

        await navigator.share({
          title: `Prescription ${checkup.id}`,
          text: `Medical prescription for ${checkup.patient.name}`,
          files: [file],
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(
            `<img src="${imgData}" alt="Prescription" style="max-width:100%;">`,
          );
          newWindow.document.title = `Prescription ${checkup.id}`;
        } else {
          alert("Please allow popups to share the prescription.");
        }
      }
    } catch (error) {
      console.error("Error sharing prescription:", error);
      alert("Failed to share prescription. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prescription</DialogTitle>
        </DialogHeader>

        <div
          className="space-y-6 py-4"
          id="alternative-prescription-content"
          ref={prescriptionRef}
        >
          {/* Hospital/Doctor Header */}
          <div className="flex items-center gap-6 pb-4">
            <div className="h-20 w-20 rounded-md bg-primary/10 flex items-center justify-center">
              <img
                src="https://api.dicebear.com/7.x/shapes/svg?seed=healthcare"
                alt="Hospital Logo"
                className="h-16 w-16"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary">
                {checkup.doctor}
              </h1>
              <p className="text-lg font-medium">
                Specialist in {checkup.department}
              </p>
              <p className="text-sm text-muted-foreground">
                MBBS, MD, FRCP, Fellowship in {checkup.department}
              </p>
              <p className="text-sm text-muted-foreground">
                License No: MED12345
              </p>
            </div>
          </div>

          <Separator />

          {/* Patient Information Box */}
          <div className="border rounded-md p-4 bg-muted/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  BASIC INFORMATION
                </h3>
                <p className="font-bold text-lg">{checkup.patient.name}</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <p className="text-sm text-muted-foreground">Age/Gender</p>
                    <p className="text-sm">
                      {checkup.patient.age} / {checkup.patient.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Patient ID</p>
                    <p className="text-sm">{checkup.patient.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Group</p>
                    <p className="text-sm">{checkup.patient.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="text-sm">{checkup.patient.contact}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  VITALS
                </h3>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <div>
                    <p className="text-sm text-muted-foreground">BP</p>
                    <p className="text-sm">120/80 mmHg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <p className="text-sm">98.6 °F</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pulse</p>
                    <p className="text-sm">72 bpm</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="text-sm">175 cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="text-sm">70 kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">SpO2</p>
                    <p className="text-sm">98%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column - Symptoms & Diagnosis */}
            <div className="md:col-span-4 space-y-6">
              {/* Symptoms */}
              <div className="border rounded-md p-4">
                <h3 className="font-bold mb-3">Symptoms</h3>
                <ul className="space-y-2">
                  {checkup.symptoms.map((symptom: any, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                      <div>
                        <span className="font-medium">{symptom.name}</span>
                        {symptom.description && (
                          <span className="text-sm text-muted-foreground">
                            {" "}
                            - {symptom.description}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnosis */}
              <div className="border rounded-md p-4">
                <h3 className="font-bold mb-3">Diagnosis</h3>
                <ul className="space-y-2">
                  {checkup.diagnosis.map((diagnosis: any, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                      <div>
                        <span className="font-medium">{diagnosis.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          ({diagnosis.icd10Code})
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tests if available */}
              {checkup.tests && checkup.tests.length > 0 && (
                <div className="border rounded-md p-4">
                  <h3 className="font-bold mb-3">Tests Advised</h3>
                  <ul className="space-y-2">
                    {checkup.tests.map((test: any, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                        <span>{test.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Medications */}
            <div className="md:col-span-8">
              <div className="border rounded-md p-4">
                <h3 className="font-bold mb-4">Medications</h3>
                <div className="space-y-4">
                  {checkup.medications.map((medication: any, index: number) => (
                    <div
                      key={index}
                      className="border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mr-2">
                              {index + 1}
                            </span>
                            <span className="font-bold text-lg">
                              {medication.medicine.name}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground ml-7">
                            {medication.medicine.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            {medication.dosage.name}
                          </Badge>
                          <p className="text-sm">{medication.days.name}</p>
                        </div>
                      </div>
                      <div className="mt-2 ml-7">
                        <p className="text-sm bg-muted/20 p-2 rounded-md">
                          <span className="font-medium">Instructions:</span>{" "}
                          Take {medication.dosage.frequency} for{" "}
                          {medication.days.value} days
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice & Follow-up */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {checkup.remarks && (
                  <div className="border rounded-md p-3">
                    <h3 className="font-bold mb-2">Advice & Instructions</h3>
                    <p className="text-sm">{checkup.remarks}</p>
                  </div>
                )}

                {checkup.followUpDate && (
                  <div className="border rounded-md p-3">
                    <h3 className="font-bold mb-2">Follow-up</h3>
                    <p className="text-sm">
                      Please return for follow-up on{" "}
                      <span className="font-medium">
                        {format(new Date(checkup.followUpDate), "MMMM d, yyyy")}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <Separator className="mt-6" />
          <div className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-bold">Clinic Hours</h4>
                <p className="text-sm">Mon - Fri: 9:00 AM - 5:00 PM</p>
                <p className="text-sm">Sat: 9:00 AM - 1:00 PM</p>
                <p className="text-sm">Sun: Closed</p>
              </div>
              <div>
                <h4 className="text-sm font-bold">Contact</h4>
                <p className="text-sm">Phone: (123) 456-7890</p>
                <p className="text-sm">Email: doctor@healthcare.com</p>
                <p className="text-sm">Emergency: (123) 456-7899</p>
              </div>
              <div>
                <h4 className="text-sm font-bold">Healthcare Medical Center</h4>
                <p className="text-sm">123 Medical Street, Healthcare City</p>
                <p className="text-sm">Website: www.healthcaremedical.com</p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <div className="text-right">
                <div className="h-12 border-b border-dashed mb-1"></div>
                <p className="font-medium">{checkup.doctor}</p>
                <p className="text-xs text-muted-foreground">
                  Digital Signature
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded-md">
            <p>
              Disclaimer: This prescription is valid for the mentioned duration
              only. Please complete the full course of medication as prescribed.
              Contact your doctor immediately if you experience any adverse
              effects.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={handlePrint} data-prescription-print-button>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlternativePrescriptionView;
