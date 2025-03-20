import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface TokenPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenData: {
    tokenNumber: string;
    patientName: string;
    mrNumber: string;
    department?: string;
    doctorName?: string;
    date: string;
    time: string;
  };
}

const TokenPrintModal: React.FC<TokenPrintModalProps> = ({
  isOpen,
  onClose,
  tokenData,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    // Create a new window with only the token content
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    // Create a styled document for printing
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Token</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
              display: flex;
              justify-content: center;
              padding-top: 20px;
            }
            .token-receipt {
              padding: 20px;
              border: 1px solid #ccc;
              max-width: 80mm;
              background-color: white;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 15px;
              border-bottom: 1px dashed #ccc;
              padding-bottom: 15px;
            }
            .hospital-name {
              font-size: 18px;
              font-weight: bold;
              margin: 0;
            }
            .hospital-address {
              font-size: 12px;
              margin: 5px 0;
              color: #555;
            }
            .token-number {
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              margin: 15px 0;
              padding: 8px;
              border: 2px solid #000;
              border-radius: 5px;
            }
            .patient-info {
              margin: 15px 0;
              font-size: 14px;
            }
            .patient-info p {
              margin: 8px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              border-top: 1px dashed #ccc;
              padding-top: 15px;
              color: #555;
            }
            .label {
              font-weight: bold;
            }
            .date-time {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              margin: 15px 0;
              color: #666;
            }
            .print-button {
              display: block;
              margin: 20px auto;
              padding: 8px 16px;
              background-color: #4a5568;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            }
            .print-button:hover {
              background-color: #2d3748;
            }
            @media print {
              body {
                background-color: white;
                padding-top: 0;
              }
              .token-receipt {
                border: none;
                box-shadow: none;
                padding: 0;
                max-width: 100%;
              }
              .print-button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="token-receipt">
            <div class="header">
              <p class="hospital-name">Healthcare Hospital</p>
              <p class="hospital-address">123 Medical Center Road, City</p>
              <p class="hospital-address">Phone: (123) 456-7890</p>
            </div>
            
            <div class="token-number">
              Token: ${tokenData.tokenNumber}
            </div>
            
            <div class="patient-info">
              <p><span class="label">Patient:</span> ${tokenData.patientName}</p>
              <p><span class="label">MR#:</span> ${tokenData.mrNumber}</p>
              ${tokenData.department ? `<p><span class="label">Department:</span> ${tokenData.department}</p>` : ""}
              ${tokenData.doctorName ? `<p><span class="label">Doctor:</span> ${tokenData.doctorName}</p>` : ""}
            </div>
            
            <div class="date-time">
              <span>${tokenData.date}</span>
              <span>${tokenData.time}</span>
            </div>
            
            <div class="footer">
              <p>Please keep this token and present it at reception</p>
              <p>Thank you for choosing Healthcare Hospital</p>
            </div>
          </div>
          <button class="print-button" onclick="window.print()">Print Token</button>
          <script>
            // Auto print option - uncomment if you want it to print automatically
            // window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Patient Token</DialogTitle>
          <DialogDescription>
            Preview and print the patient token.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div ref={printRef} className="border rounded-md p-4 bg-white">
            <div className="text-center border-b pb-2 mb-3">
              <h3 className="font-bold text-lg">Healthcare Hospital</h3>
              <p className="text-xs text-muted-foreground">
                123 Medical Center Road, City
              </p>
            </div>

            <div className="text-center my-4">
              <div className="text-2xl font-bold border-2 border-black inline-block px-4 py-2 rounded">
                Token: {tokenData.tokenNumber}
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <p>
                <span className="font-semibold">Patient:</span>{" "}
                {tokenData.patientName}
              </p>
              <p>
                <span className="font-semibold">MR#:</span> {tokenData.mrNumber}
              </p>
              {tokenData.department && (
                <p>
                  <span className="font-semibold">Department:</span>{" "}
                  {tokenData.department}
                </p>
              )}
              {tokenData.doctorName && (
                <p>
                  <span className="font-semibold">Doctor:</span>{" "}
                  {tokenData.doctorName}
                </p>
              )}
            </div>

            <div className="flex justify-between text-xs mt-4">
              <span>{tokenData.date}</span>
              <span>{tokenData.time}</span>
            </div>

            <div className="text-center text-xs mt-4 pt-2 border-t">
              <p>Please keep this token and present it at reception</p>
              <p>Thank you for choosing Healthcare Hospital</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="space-x-2">
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              <Printer className="mr-2 h-4 w-4" />
              View Token
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print Token
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TokenPrintModal;
