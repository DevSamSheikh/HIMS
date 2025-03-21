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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface EnhancedPrescriptionViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkup: any; // In a real app, this would be properly typed
}

const EnhancedPrescriptionView: React.FC<EnhancedPrescriptionViewProps> = ({
  open,
  onOpenChange,
  checkup,
}) => {
  if (!checkup) return null;

  const prescriptionRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = document.getElementById("prescription-content");
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
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 1px solid #ddd;
              padding-bottom: 15px;
              margin-bottom: 15px;
            }
            .hospital-info {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .logo {
              width: 64px;
              height: 64px;
              background-color: #f0f0f0;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
            }
            .hospital-name {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin: 0;
            }
            .hospital-tagline {
              font-size: 16px;
              color: #666;
              margin: 5px 0;
            }
            .hospital-address {
              font-size: 14px;
              color: #666;
              margin: 2px 0;
            }
            .prescription-info {
              text-align: right;
            }
            .prescription-id {
              font-size: 14px;
              font-weight: 500;
              margin: 0;
            }
            .prescription-date {
              font-size: 14px;
              color: #666;
              margin: 5px 0 0 0;
            }
            .doctor-info {
              background-color: #f9fafb;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
            }
            .doctor-name {
              font-size: 18px;
              font-weight: bold;
              margin: 0;
            }
            .doctor-specialty {
              font-size: 14px;
              color: #666;
              margin: 5px 0;
            }
            .doctor-license {
              font-size: 14px;
              color: #666;
              margin: 2px 0;
            }
            .doctor-credentials {
              text-align: right;
              font-size: 14px;
            }
            .patient-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 20px;
            }
            .info-section {
              display: flex;
              flex-direction: column;
            }
            .section-title {
              font-size: 14px;
              color: #666;
              font-weight: 500;
              margin-bottom: 5px;
            }
            .patient-name {
              font-size: 16px;
              font-weight: 500;
              margin: 0;
            }
            .patient-details {
              font-size: 14px;
              margin: 5px 0;
            }
            .separator {
              height: 1px;
              background-color: #ddd;
              margin: 20px 0;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-heading {
              font-size: 18px;
              font-weight: bold;
              margin: 0 0 15px 0;
            }
            .symptom-item, .test-item {
              display: flex;
              align-items: flex-start;
              margin-bottom: 10px;
            }
            .bullet {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: #2563eb;
              margin-top: 6px;
              margin-right: 8px;
            }
            .symptom-name {
              font-weight: 500;
            }
            .symptom-description {
              font-size: 14px;
              color: #666;
            }
            .diagnosis-badges {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 10px;
            }
            .diagnosis-badge {
              display: inline-block;
              border: 1px solid #ddd;
              border-radius: 4px;
              padding: 4px 8px;
              font-size: 14px;
            }
            .medications-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            .medications-table th {
              text-align: left;
              padding: 10px;
              background-color: #f9fafb;
              font-size: 14px;
              font-weight: 500;
            }
            .medications-table td {
              padding: 10px;
              border-top: 1px solid #eee;
              font-size: 14px;
            }
            .medication-name {
              font-weight: 500;
            }
            .medication-category {
              font-size: 12px;
              color: #666;
            }
            .advice-followup {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-top: 20px;
            }
            .advice-box, .followup-box {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 12px;
            }
            .advice-heading, .followup-heading {
              font-size: 16px;
              font-weight: bold;
              margin: 0 0 8px 0;
            }
            .advice-text, .followup-text {
              font-size: 14px;
              margin: 0;
            }
            .footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #ddd;
            }
            .footer-text {
              max-width: 60%;
              font-size: 14px;
              color: #666;
            }
            .signature {
              text-align: right;
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
          id="prescription-content"
          ref={prescriptionRef}
        >
          {/* Hospital Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center">
                <img
                  src="https://api.dicebear.com/7.x/shapes/svg?seed=healthcare"
                  alt="Hospital Logo"
                  className="h-12 w-12"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">
                  Healthcare Medical Center
                </h1>
                <p className="text-muted-foreground">
                  Excellence in Healthcare Services
                </p>
                <p className="text-sm text-muted-foreground">
                  123 Medical Street, Healthcare City | Phone: (123) 456-7890
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                Prescription #: {checkup.id}
              </div>
              <div className="text-sm text-muted-foreground">
                Date: {new Date(checkup.date).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="bg-primary/5 p-4 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-lg">{checkup.doctor}</h2>
                <p className="text-sm text-muted-foreground">
                  Specialist in {checkup.department}
                </p>
                <p className="text-sm text-muted-foreground">
                  License No: MED12345
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">Healthcare Medical Center</p>
                <p className="text-sm text-muted-foreground">MBBS, MD, FRCP</p>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="grid grid-cols-2 gap-4 border p-4 rounded-md">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                PATIENT INFORMATION
              </h3>
              <p className="font-medium">{checkup.patient.name}</p>
              <p className="text-sm">
                {checkup.patient.age} years, {checkup.patient.gender}
              </p>
              <p className="text-sm">ID: {checkup.patient.id}</p>
              <p className="text-sm">
                Blood Group: {checkup.patient.bloodGroup}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                CONTACT
              </h3>
              <p className="text-sm">{checkup.patient.contact}</p>
              <h3 className="font-medium text-sm text-muted-foreground mt-2">
                VISIT DETAILS
              </h3>
              <p className="text-sm">
                Date: {new Date(checkup.date).toLocaleDateString()}
              </p>
              <p className="text-sm">Department: {checkup.department}</p>
            </div>
          </div>

          <Separator />

          {/* Clinical Information */}
          <div className="space-y-4">
            {/* Symptoms */}
            <div>
              <h3 className="font-bold">Symptoms</h3>
              <div className="mt-2 space-y-2">
                {checkup.symptoms.map((symptom: any, index: number) => (
                  <div key={index} className="flex items-start">
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
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <h3 className="font-bold">Diagnosis</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {checkup.diagnosis.map((diagnosis: any, index: number) => (
                  <Badge key={index} variant="outline" className="text-sm py-1">
                    {diagnosis.name} ({diagnosis.icd10Code})
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tests */}
            {checkup.tests && checkup.tests.length > 0 && (
              <div>
                <h3 className="font-bold">Tests Advised</h3>
                <div className="mt-2 space-y-2">
                  {checkup.tests.map((test: any, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                      <span>{test.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Medications */}
          <div>
            <h3 className="font-bold">Medications</h3>
            <div className="mt-4 border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 text-sm font-medium">#</th>
                    <th className="text-left p-2 text-sm font-medium">
                      Medication
                    </th>
                    <th className="text-left p-2 text-sm font-medium">
                      Dosage
                    </th>
                    <th className="text-left p-2 text-sm font-medium">
                      Duration
                    </th>
                    <th className="text-left p-2 text-sm font-medium">
                      Instructions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {checkup.medications.map((medication: any, index: number) => (
                    <tr key={index}>
                      <td className="p-2 text-sm">{index + 1}</td>
                      <td className="p-2">
                        <div className="font-medium">
                          {medication.medicine.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {medication.medicine.category}
                        </div>
                      </td>
                      <td className="p-2 text-sm">{medication.dosage.name}</td>
                      <td className="p-2 text-sm">{medication.days.name}</td>
                      <td className="p-2 text-sm">
                        {medication.dosage.frequency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Advice & Follow-up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checkup.remarks && (
              <div className="border p-3 rounded-md">
                <h3 className="font-bold mb-2">Advice & Instructions</h3>
                <p className="text-sm">{checkup.remarks}</p>
              </div>
            )}

            {checkup.followUpDate && (
              <div className="border p-3 rounded-md">
                <h3 className="font-bold mb-2">Follow-up</h3>
                <p className="text-sm">
                  Please return for follow-up on{" "}
                  <span className="font-medium">
                    {new Date(checkup.followUpDate).toLocaleDateString()}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t">
            <div className="flex justify-between items-start">
              <div className="max-w-xs">
                <p className="text-sm text-muted-foreground">
                  This prescription is electronically generated and is valid
                  without a physical signature.
                </p>
              </div>
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

export default EnhancedPrescriptionView;
